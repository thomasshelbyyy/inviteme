<?php

namespace App\Enums;

enum RsvpStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Declined = 'declined';

    public function label(): string
    {
        return match ($this) {
            RsvpStatus::Pending => 'Belum Konfirmasi',
            RsvpStatus::Confirmed => 'Hadir',
            RsvpStatus::Declined => 'Tidak Hadir',
        };
    }
}
