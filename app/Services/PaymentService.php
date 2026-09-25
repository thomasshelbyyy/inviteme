<?php

namespace App\Services;

use App\Enums\InvitationStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;

/**
 * Handles all Midtrans payment operations:
 * - Creating Snap transaction tokens for the frontend popup
 * - Verifying and processing incoming payment notifications (webhooks)
 */
class PaymentService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Create a Midtrans Snap transaction and return its token.
     * The token is passed to window.snap.pay() on the frontend.
     *
     * @throws \Exception When Midtrans API call fails
     */
    public function createSnapToken(Order $order, User $user): string
    {
        $params = [
            'transaction_details' => [
                'order_id' => $order->id,
                'gross_amount' => $order->amount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
            'item_details' => [
                [
                    'id' => $order->plan,
                    'price' => $order->amount,
                    'quantity' => 1,
                    'name' => "Paket {$order->plan} — {$order->invitation->title}",
                ],
            ],
            'callbacks' => [
                'finish' => route('invitations.editor', $order->invitation_id),
            ],
        ];

        $snapToken = Snap::getSnapToken($params);

        // Persist the gateway order ID for webhook matching
        $order->update([
            'gateway_order_id' => $order->id,
            'payment_gateway' => 'midtrans',
        ]);

        return $snapToken;
    }

    /**
     * Process an incoming Midtrans payment notification webhook.
     * Verifies the signature, updates the order status, and publishes
     * the invitation automatically when payment is confirmed.
     */
    public function handleWebhookNotification(array $payload): void
    {
        // Use Midtrans Notification helper to auto-verify signature
        $notification = new Notification;

        $orderId = $notification->order_id;
        $transactionStatus = $notification->transaction_status;
        $fraudStatus = $notification->fraud_status;
        $transactionId = $notification->transaction_id;

        Log::info('Midtrans webhook received', [
            'order_id' => $orderId,
            'status' => $transactionStatus,
            'fraud' => $fraudStatus,
        ]);

        $order = Order::with('invitation')->find($orderId);

        if (! $order) {
            Log::warning('Midtrans webhook: order not found', ['order_id' => $orderId]);

            return;
        }

        // Only process if order is still pending (idempotency guard)
        if ($order->status !== OrderStatus::Pending) {
            return;
        }

        if ($this->isPaymentSuccessful($transactionStatus, $fraudStatus)) {
            $order->update([
                'status' => OrderStatus::Paid,
                'gateway_payment_id' => $transactionId,
                'gateway_payload' => $payload,
                'paid_at' => now(),
            ]);

            // Auto-publish the invitation
            if ($order->invitation && ! $order->invitation->isPublished()) {
                $order->invitation->update([
                    'status' => InvitationStatus::Published,
                    'published_at' => now(),
                ]);

                Log::info('Invitation auto-published after payment', [
                    'invitation_id' => $order->invitation_id,
                ]);
            }
        } elseif ($this->isPaymentFailed($transactionStatus)) {
            $order->update([
                'status' => OrderStatus::Failed,
                'gateway_payload' => $payload,
            ]);
        }
    }

    /**
     * Determine whether the transaction counts as a successful payment.
     * Covers settlement (final) and capture (credit card pre-auth cleared).
     */
    private function isPaymentSuccessful(string $transactionStatus, ?string $fraudStatus): bool
    {
        if ($transactionStatus === 'capture') {
            return $fraudStatus === 'accept';
        }

        return $transactionStatus === 'settlement';
    }

    /**
     * Determine whether the transaction has definitively failed.
     */
    private function isPaymentFailed(string $transactionStatus): bool
    {
        return in_array($transactionStatus, ['deny', 'cancel', 'expire'], true);
    }
}
