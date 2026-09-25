<?php

namespace App\Services;

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use App\Models\InvitationTemplate;
use App\Models\User;
use Illuminate\Support\Str;

class InvitationService
{
    /**
     * @param  array{title: string, slug?: string|null}  $data
     */
    public function create(User $user, array $data): Invitation
    {
        $slug = $this->generateUniqueSlug($data['slug'] ?? $data['title']);

        $design = $this->defaultDesign($data['title']);

        if (! empty($data['template_id'])) {
            $template = InvitationTemplate::find($data['template_id']);
            if ($template && $template->design) {
                $design = $template->design;
            }
        }

        return $user->invitations()->create([
            'title' => $data['title'],
            'slug' => $slug,
            'status' => InvitationStatus::Draft,
            'design' => $design,
        ]);
    }

    /**
     * Generate a unique URL-safe slug from a string.
     */
    public function generateUniqueSlug(string $input): string
    {
        $base = Str::slug($input);
        $slug = $base;
        $count = 1;

        while (Invitation::withTrashed()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }

    /**
     * Return the default design JSON for a new invitation.
     *
     * @return array<string, mixed>
     */
    public function defaultDesign(string $title): array
    {
        return [
            'version' => 1,
            'meta' => [
                'title' => $title,
                'coupleNames' => '',
                'weddingDate' => '',
                'slug' => '',
            ],
            'theme' => [
                'primaryColor' => '#8B5E5E',
                'secondaryColor' => '#D4B896',
                'backgroundColor' => '#FDF8F3',
                'fontHeading' => 'Playfair Display',
                'fontBody' => 'Inter',
                'accentColor' => '#C8956C',
            ],
            'settings' => [
                'guestGreeting' => "Kepada Yth.\n{{guest.name}}",
                'musicAutoplay' => false,
                'showRsvp' => true,
                'language' => 'id',
            ],
            'blocks' => [
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'hero',
                    'visible' => true,
                    'props' => [
                        'title' => 'The Wedding Of',
                        'coupleNames' => 'Nama & Pasangan',
                        'subtitle' => 'Tanggal Pernikahan',
                        'backgroundImage' => null,
                        'overlayOpacity' => 0.4,
                        'textAlign' => 'center',
                    ],
                ],
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'countdown',
                    'visible' => true,
                    'props' => [
                        'targetDate' => '',
                        'label' => 'Menuju Hari Bahagia',
                        'completedText' => 'Hari Ini!',
                    ],
                ],
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'rsvp',
                    'visible' => true,
                    'props' => [
                        'title' => 'Konfirmasi Kehadiran',
                        'subtitle' => 'Mohon konfirmasi kehadiran Anda',
                        'deadline' => null,
                    ],
                ],
            ],
        ];
    }
}
