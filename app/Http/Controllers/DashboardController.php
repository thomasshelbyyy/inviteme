<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $invitations = $user->invitations()
            ->withCount(['guests', 'rsvpResponses'])
            ->latest()
            ->take(6)
            ->get();

        $stats = [
            'total_invitations' => $user->invitations()->count(),
            'published_invitations' => $user->invitations()->where('status', 'published')->count(),
            'total_guests' => Guest::whereIn(
                'invitation_id',
                $user->invitations()->pluck('id')
            )->count(),
        ];

        return Inertia::render('Dashboard/Index', [
            'invitations' => $invitations,
            'stats' => $stats,
        ]);
    }
}
