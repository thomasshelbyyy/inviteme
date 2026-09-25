<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Plan;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function index(Request $request): Response
    {
        $plans = Plan::where('is_active', true)->orderBy('sort_order')->get();

        $orders = Order::where('user_id', $request->user()->id)
            ->with('invitation')
            ->latest()
            ->get();

        $invitations = $request->user()->invitations()
            ->select('id', 'title')
            ->latest()
            ->get();

        return Inertia::render('Billing/Index', [
            'plans' => $plans,
            'orders' => $orders,
            'invitations' => $invitations,
        ]);
    }

    /**
     * Create a pending order and return a Midtrans Snap token for the frontend.
     * The frontend calls window.snap.pay(token) to open the payment popup.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $request->validate([
            'invitation_id' => ['required', 'exists:invitations,id'],
            'plan_key' => ['required', 'exists:plans,key'],
        ]);

        $invitation = $request->user()->invitations()->findOrFail($request->invitation_id);
        $plan = Plan::where('key', $request->plan_key)->firstOrFail();

        // Guard: prevent duplicate purchase for an already-paid invitation
        $existingPaidOrder = Order::where('invitation_id', $invitation->id)
            ->where('status', OrderStatus::Paid)
            ->first();

        if ($existingPaidOrder) {
            return response()->json([
                'error' => 'Undangan ini sudah memiliki paket aktif.',
            ], 422);
        }

        // Cancel any lingering pending orders for this invitation+plan
        Order::where('invitation_id', $invitation->id)
            ->where('status', OrderStatus::Pending)
            ->delete();

        // Create a fresh pending order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'invitation_id' => $invitation->id,
            'plan' => $plan->key,
            'amount' => $plan->price,
            'currency' => 'IDR',
            'status' => OrderStatus::Pending,
            'payment_gateway' => 'midtrans',
        ]);

        $order->load('invitation');

        $snapToken = $this->paymentService->createSnapToken($order, $request->user());

        return response()->json([
            'snap_token' => $snapToken,
            'order_id' => $order->id,
            'amount' => $order->amount,
            'client_key' => config('midtrans.client_key'),
        ]);
    }

    /**
     * Receive payment status notifications from Midtrans.
     * This endpoint is excluded from CSRF protection (see bootstrap/app.php).
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        try {
            $this->paymentService->handleWebhookNotification($request->all());

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Midtrans webhook error', [
                'message' => $e->getMessage(),
                'payload' => $request->all(),
            ]);

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
