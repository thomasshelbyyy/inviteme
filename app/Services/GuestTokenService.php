<?php

namespace App\Services;

use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Support\Str;

class GuestTokenService
{
    /**
     * Generate a unique secure token for a guest.
     */
    public function generateToken(Invitation $invitation): string
    {
        do {
            $token = Str::random(12);
        } while (
            Guest::where('invitation_id', $invitation->id)
                ->where('token', $token)
                ->exists()
        );

        return $token;
    }

    /**
     * Generate the personalized URL for a guest.
     */
    public function personalizedUrl(Guest $guest): string
    {
        return url("/{$guest->invitation->slug}?to={$guest->token}");
    }
}
