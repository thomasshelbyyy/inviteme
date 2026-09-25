<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class InvitationMedia extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'invitation_id',
        'filename',
        'storage_path',
        'disk',
        'mime_type',
        'size_bytes',
        'width',
        'height',
        'alt_text',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        if ($this->disk === 'local') {
            return asset('storage/'.$this->storage_path);
        }

        return Storage::disk($this->disk)->url($this->storage_path);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Invitation, $this> */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /**
     * Get the public URL for this media item, regardless of storage disk.
     */
    public function getUrl(): string
    {
        if ($this->disk === 'local') {
            return asset('storage/'.$this->storage_path);
        }

        return Storage::disk($this->disk)->url($this->storage_path);
    }

    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    public function isVideo(): bool
    {
        return str_starts_with($this->mime_type, 'video/');
    }

    public function isAudio(): bool
    {
        return str_starts_with($this->mime_type, 'audio/');
    }
}
