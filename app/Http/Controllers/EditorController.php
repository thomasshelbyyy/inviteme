<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    public function show(Invitation $invitation): Response
    {
        $this->authorize('update', $invitation);

        $invitation->load('media');

        $hasActiveOrder = Order::where('invitation_id', $invitation->id)
            ->where('status', OrderStatus::Paid)
            ->exists();

        $plans = Plan::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Editor/Index', [
            'invitation' => $invitation,
            'hasActiveOrder' => $hasActiveOrder,
            'plans' => $plans,
        ]);
    }

    public function saveDesign(Request $request, Invitation $invitation): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $invitation);

        $validated = $request->validate([
            'design' => ['required', 'array'],
            'design.version' => ['required', 'integer'],
            'design.blocks' => ['required', 'array'],
        ]);

        $invitation->update(['design' => $validated['design']]);

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Design saved.', 'saved_at' => now()]);
        }

        return back()->with('success', 'Desain berhasil disimpan.');
    }
}
