<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@inviteme.id',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@inviteme.id',
            'role' => 'user',
        ]);

        Plan::create([
            'key' => 'basic',
            'name' => 'Basic',
            'description' => 'Akses semua fitur dasar',
            'price' => 49000,
            'features' => [
                'Unlimited Tamu',
                'Custom Link',
                'Buku Tamu (RSVP)',
            ],
            'is_active' => true,
        ]);

        Plan::create([
            'key' => 'premium',
            'name' => 'Premium',
            'description' => 'Akses semua fitur tanpa batas',
            'price' => 99000,
            'features' => [
                'Semua Fitur Basic',
                'Galeri Foto (Unlimited)',
                'Musik Latar',
                'Bebas Watermark',
            ],
            'is_active' => true,
        ]);
    }
}
