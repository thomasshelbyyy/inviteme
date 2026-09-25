<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Inertia\Inertia;
use Inertia\Response;

class RsvpDashboardController extends Controller
{
    public function index(Invitation $invitation): Response
    {
        $this->authorize('update', $invitation);

        $invitation->loadCount(['guests', 'rsvpResponses']);

        $responses = $invitation->rsvpResponses()
            ->with('guest:id,name,phone,email,group,rsvp_status')
            ->latest('submitted_at')
            ->get();

        $confirmedCount = $responses->where('attendance', 'yes')->count();
        $declinedCount = $responses->where('attendance', 'no')->count();
        $totalAttendees = $responses->where('attendance', 'yes')->sum('attendee_count');

        $guestsByStatus = $invitation->guests()
            ->selectRaw('rsvp_status, count(*) as count')
            ->groupBy('rsvp_status')
            ->pluck('count', 'rsvp_status');

        // Responses per day (last 30 days)
        $responsesByDay = $invitation->rsvpResponses()
            ->selectRaw('DATE(submitted_at) as date, count(*) as count')
            ->where('submitted_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        return Inertia::render('Rsvp/Dashboard', [
            'invitation' => $invitation->only('id', 'title', 'slug', 'status'),
            'stats' => [
                'total_guests' => $invitation->guests_count,
                'total_responses' => $invitation->rsvp_responses_count,
                'confirmed' => $confirmedCount,
                'declined' => $declinedCount,
                'total_attendees' => (int) $totalAttendees,
                'pending' => ($invitation->guests_count - $confirmedCount - $declinedCount),
                'guests_by_status' => $guestsByStatus,
            ],
            'responses' => $responses,
            'responses_by_day' => $responsesByDay,
        ]);
    }
}
