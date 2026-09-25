<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Failed = 'failed';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            OrderStatus::Pending => 'Pending',
            OrderStatus::Paid => 'Paid',
            OrderStatus::Failed => 'Failed',
            OrderStatus::Refunded => 'Refunded',
        };
    }

    public function isPaid(): bool
    {
        return $this === OrderStatus::Paid;
    }
}
