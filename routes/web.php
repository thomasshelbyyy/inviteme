<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PublicInvitationController;
use App\Http\Controllers\RsvpDashboardController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Marketing / Landing
Route::get('/', [LandingController::class, 'index'])->name('home');

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Invitations
    Route::resource('invitations', InvitationController::class)
        ->except(['show']);
    Route::post('/invitations/{invitation}/publish', [InvitationController::class, 'publish'])
        ->name('invitations.publish');

    // Editor
    Route::get('/invitations/{invitation}/editor', [EditorController::class, 'show'])
        ->name('invitations.editor');
    Route::put('/invitations/{invitation}/design', [EditorController::class, 'saveDesign'])
        ->name('invitations.design.save');

    // Guests
    Route::get('/invitations/{invitation}/guests', [GuestController::class, 'index'])
        ->name('invitations.guests.index');
    Route::post('/invitations/{invitation}/guests', [GuestController::class, 'store'])
        ->name('invitations.guests.store');
    Route::put('/invitations/{invitation}/guests/{guest}', [GuestController::class, 'update'])
        ->name('invitations.guests.update');
    Route::delete('/invitations/{invitation}/guests/{guest}', [GuestController::class, 'destroy'])
        ->name('invitations.guests.destroy');
    Route::post('/invitations/{invitation}/guests/{guest}/generate-link', [GuestController::class, 'generateLink'])
        ->name('invitations.guests.generate-link');

    // RSVP Dashboard
    Route::get('/invitations/{invitation}/rsvp', [RsvpDashboardController::class, 'index'])
        ->name('invitations.rsvp');

    // Analytics
    Route::get('/invitations/{invitation}/analytics', [AnalyticsController::class, 'show'])
        ->name('invitations.analytics');

    // Media
    Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::post('/media', [MediaController::class, 'store'])->name('media.store');
    Route::delete('/media/{medium}', [MediaController::class, 'destroy'])->name('media.destroy');

    // Templates (browsing)
    Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::post('/invitations/{invitation}/clone-template/{template}', [TemplateController::class, 'clone'])
        ->name('invitations.template.clone');

    // Billing / Orders
    Route::get('/billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('/orders', [BillingController::class, 'createOrder'])->name('orders.store');

    // Admin Group
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', UserController::class)->only(['index', 'update']);
    });

    // Account Settings
    Route::get('/settings', [AccountController::class, 'index'])->name('settings.index');
    Route::put('/settings', [AccountController::class, 'update'])->name('settings.update');
    Route::put('/settings/password', [AccountController::class, 'updatePassword'])->name('settings.password');
});

// Midtrans Webhook — no auth, no CSRF (excluded in bootstrap/app.php)
Route::post('/webhooks/midtrans', [BillingController::class, 'handleWebhook'])
    ->name('webhooks.midtrans');

// Public Invitation Routes (MUST be last — catch-all slug)
Route::post('/{slug}/rsvp', [PublicInvitationController::class, 'submitRsvp'])
    ->name('public.rsvp');
Route::get('/{slug}', [PublicInvitationController::class, 'show'])
    ->name('public.invitation');
