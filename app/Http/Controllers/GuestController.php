<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Invitation;
use App\Services\GuestTokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    public function __construct(private readonly GuestTokenService $tokenService) {}

    public function index(Invitation $invitation): Response
    {
        $this->authorize('update', $invitation);

        $guests = $invitation->guests()
            ->latest()
            ->paginate(50);

        return Inertia::render('Guests/Index', [
            'invitation' => $invitation->only('id', 'title', 'slug', 'status'),
            'guests' => $guests,
        ]);
    }

    public function store(Request $request, Invitation $invitation): RedirectResponse
    {
        $this->authorize('update', $invitation);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'group' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $invitation->guests()->create([
            ...$validated,
            'token' => $this->tokenService->generateToken($invitation),
            'rsvp_status' => 'pending',
        ]);

        return back()->with('success', 'Tamu berhasil ditambahkan.');
    }

    public function update(Request $request, Invitation $invitation, Guest $guest): RedirectResponse
    {
        $this->authorize('update', $invitation);

        abort_if($guest->invitation_id !== $invitation->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'group' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $guest->update($validated);

        return back()->with('success', 'Data tamu berhasil diperbarui.');
    }

    public function destroy(Invitation $invitation, Guest $guest): RedirectResponse
    {
        $this->authorize('update', $invitation);

        abort_if($guest->invitation_id !== $invitation->id, 403);

        $guest->delete();

        return back()->with('success', 'Tamu berhasil dihapus.');
    }

    public function generateLink(Invitation $invitation, Guest $guest): JsonResponse
    {
        $this->authorize('update', $invitation);

        abort_if($guest->invitation_id !== $invitation->id, 403);

        $url = $this->tokenService->personalizedUrl($guest);

        return response()->json([
            'url' => $url,
            'token' => $guest->token,
        ]);
    }
}
