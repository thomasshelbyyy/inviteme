<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\InvitationTemplate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function index(): Response
    {
        $templates = InvitationTemplate::where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Templates/Index', [
            'templates' => $templates,
        ]);
    }

    public function clone(Invitation $invitation, InvitationTemplate $template): RedirectResponse
    {
        $this->authorize('update', $invitation);

        $invitation->update([
            'design' => $template->design,
        ]);

        return redirect()->route('invitations.editor', $invitation->id)
            ->with('success', 'Template berhasil diterapkan ke undangan Anda.');
    }
}
