<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function show(Invitation $invitation): Response
    {
        $this->authorize('update', $invitation);

        $totalViews = $invitation->analyticsEvents()
            ->where('event_type', 'view')
            ->count();

        $uniqueVisitors = $invitation->analyticsEvents()
            ->where('event_type', 'view')
            ->distinct('ip_address')
            ->count('ip_address');

        $rsvpCount = $invitation->rsvpResponses()->count();

        // Views per day (last 30 days)
        $viewsByDay = $invitation->analyticsEvents()
            ->where('event_type', 'view')
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        // Event type breakdown
        $eventBreakdown = $invitation->analyticsEvents()
            ->selectRaw('event_type, count(*) as count')
            ->groupBy('event_type')
            ->pluck('count', 'event_type');

        return Inertia::render('Analytics/Show', [
            'invitation' => $invitation->only('id', 'title', 'slug', 'status'),
            'stats' => [
                'total_views'      => $totalViews,
                'unique_visitors'  => $uniqueVisitors,
                'rsvp_count'       => $rsvpCount,
                'conversion_rate'  => $totalViews > 0
                    ? round(($rsvpCount / $totalViews) * 100, 1)
                    : 0,
            ],
            'views_by_day'     => $viewsByDay,
            'event_breakdown'  => $eventBreakdown,
        ]);
    }
}
