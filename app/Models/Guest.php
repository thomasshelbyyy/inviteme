<?php

namespace App\Models;

use App\Enums\RsvpStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guest extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'invitation_id',
        'name',
        'phone',
        'email',
        'group',
        'address',
        'token',
        'rsvp_status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rsvp_status' => RsvpStatus::class,
        ];
    }

    /** @return BelongsTo<Invitation, $this> */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /** @return HasOne<RsvpResponse, $this> */
    public function rsvpResponse(): HasOne
    {
        return $this->hasOne(RsvpResponse::class)->latestOfMany('submitted_at');
    }

    public function getPersonalizedUrl(): string
    {
        return url("/{$this->invitation->slug}?to={$this->token}");
    }
}
