<?php

namespace App\Enums;

enum RsvpAttendance: string
{
    case Yes = 'yes';
    case No = 'no';

    public function label(): string
    {
        return match ($this) {
            RsvpAttendance::Yes => 'Hadir',
            RsvpAttendance::No => 'Tidak Hadir',
        };
    }
}
