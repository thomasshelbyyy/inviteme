<?php

namespace App\Enums;

enum UserRole: string
{
    case User = 'user';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            UserRole::User => 'User',
            UserRole::Admin => 'Admin',
        };
    }

    public function isAdmin(): bool
    {
        return $this === UserRole::Admin;
    }
}
