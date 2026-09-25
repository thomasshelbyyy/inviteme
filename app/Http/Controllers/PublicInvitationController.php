<?php

namespace App\Http\Controllers;

use App\Models\AnalyticsEvent;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\RsvpResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class PublicInvitationController extends Controller
{
    public function show(string $slug, Request $request): Response|RedirectResponse
    {
        $invitation = Invitation::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $guest = null;
        $guestName = null;

        if ($token = $request->query('to')) {
            $guest = Guest::where('invitation_id', $invitation->id)
                ->where('token', $token)
                ->first();

            if ($guest) {
                $guestName = $guest->name;

                // Track view event
                AnalyticsEvent::create([
                    'invitation_id' => $invitation->id,
                    'guest_id' => $guest->id,
                    'event_type' => 'view',
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            }
        } else {
            // Track anonymous view
            AnalyticsEvent::create([
                'invitation_id' => $invitation->id,
                'event_type' => 'view',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return Inertia::render('Public/Invitation', [
            'invitation' => [
                'id' => $invitation->id,
                'title' => $invitation->title,
                'slug' => $invitation->slug,
                'design' => $invitation->design,
            ],
            'guest' => $guest ? [
                'id' => $guest->id,
                'name' => $guest->name,
                'token' => $guest->token,
                'rsvp_status' => $guest->rsvp_status,
            ] : null,
        ]);
    }

    public function submitRsvp(string $slug, Request $request): JsonResponse
    {
        // Rate limit: 5 RSVP submissions per IP per 10 minutes
        $key = 'rsvp:'.$request->ip().':'.$slug;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Terlalu banyak percobaan. Coba lagi nanti.'], 429);
        }
        RateLimiter::hit($key, 600);

        $invitation = Invitation::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $validated = $request->validate([
            'token' => ['nullable', 'string', 'max:16'],
            'attendance' => ['required', 'in:yes,no'],
            'attendee_count' => ['required', 'integer', 'min:1', 'max:10'],
            'message' => ['nullable', 'string', 'max:500'],
        ]);

        $guest = null;
        if ($validated['token']) {
            $guest = Guest::where('invitation_id', $invitation->id)
                ->where('token', $validated['token'])
                ->first();

            if ($guest) {
                $guest->update([
                    'rsvp_status' => $validated['attendance'] === 'yes' ? 'confirmed' : 'declined',
                ]);
            }
        }

        RsvpResponse::create([
            'invitation_id' => $invitation->id,
            'guest_id' => $guest?->id,
            'attendance' => $validated['attendance'],
            'attendee_count' => $validated['attendee_count'],
            'message' => $validated['message'] ?? null,
            'ip_address' => $request->ip(),
            'submitted_at' => now(),
        ]);

        // Track event
        AnalyticsEvent::create([
            'invitation_id' => $invitation->id,
            'guest_id' => $guest?->id,
            'event_type' => 'rsvp_submit',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => $validated['attendance'] === 'yes'
                ? 'Terima kasih! Kehadiranmu sudah dikonfirmasi. 🎉'
                : 'Terima kasih atas konfirmasimu.',
        ]);
    }
}
