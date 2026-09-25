<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
            'total_invitations' => Invitation::count(),
            'published_invitations' => Invitation::where('status', 'published')->count(),
            'total_orders' => Order::where('status', 'paid')->count(),
            'total_revenue' => Order::where('status', 'paid')->sum('amount'),
        ];

        $recentUsers = User::latest()->take(5)->get();
        $recentOrders = Order::with(['user', 'invitation'])->where('status', 'paid')->latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentOrders' => $recentOrders,
        ]);
    }
}
