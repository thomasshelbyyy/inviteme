<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\InvitationTemplate;
use App\Models\Order;
use App\Services\InvitationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function __construct(private readonly InvitationService $invitationService) {}

    public function index(Request $request): Response
    {
        $invitations = $request->user()
            ->invitations()
            ->withCount(['guests', 'rsvpResponses'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Invitations/Index', [
            'invitations' => $invitations,
        ]);
    }

    public function create(): Response
    {
        $templates = InvitationTemplate::where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Invitations/Create', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/'],
            'template_id' => ['nullable', 'string', 'exists:invitation_templates,id'],
        ]);

        $invitation = $this->invitationService->create($request->user(), $validated);

        return redirect()->route('invitations.editor', $invitation->id)
            ->with('success', 'Undangan berhasil dibuat! Mulai desain sekarang.');
    }

    public function edit(Invitation $invitation): Response
    {
        $this->authorize('update', $invitation);

        return Inertia::render('Invitations/Edit', [
            'invitation' => $invitation,
        ]);
    }

    public function update(Request $request, Invitation $invitation): RedirectResponse
    {
        $this->authorize('update', $invitation);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $invitation->update($validated);

        return back()->with('success', 'Undangan berhasil diperbarui.');
    }

    public function destroy(Invitation $invitation): RedirectResponse
    {
        $this->authorize('delete', $invitation);

        $invitation->delete();

        return redirect()->route('invitations.index')
            ->with('success', 'Undangan berhasil dihapus.');
    }

    public function publish(Request $request, Invitation $invitation): RedirectResponse
    {
        $this->authorize('update', $invitation);

        // Check if there's a paid order for this invitation
        $hasPaidOrder = Order::where('invitation_id', $invitation->id)
            ->where('status', 'paid')
            ->exists();

        if (! $hasPaidOrder) {
            return redirect()->route('billing.index')
                ->withErrors(['publish' => 'Anda harus membeli paket (Basic/Premium) sebelum dapat mempublikasikan undangan.']);
        }

        $invitation->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return back()->with('success', 'Undangan berhasil dipublikasikan!');
    }
}
