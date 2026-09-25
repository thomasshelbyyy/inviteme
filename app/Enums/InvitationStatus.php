<?php

namespace App\Enums;

enum InvitationStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match ($this) {
            InvitationStatus::Draft => 'Draft',
            InvitationStatus::Published => 'Published',
            InvitationStatus::Suspended => 'Suspended',
        };
    }

    public function isPublished(): bool
    {
        return $this === InvitationStatus::Published;
    }

    public function canBeEdited(): bool
    {
        return $this !== InvitationStatus::Suspended;
    }
}
