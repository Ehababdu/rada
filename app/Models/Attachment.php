<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Attachment extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'martyr_id',
        'attachment_type',
        'file_path',
        'original_filename',
        'mime_type',
        'file_size',
        'description',
    ];

    public function martyr(): BelongsTo
    {
        return $this->belongsTo(Martyr::class);
    }

    public function attachmentType(): BelongsTo
    {
        return $this->belongsTo(AttachmentType::class, 'attachment_type', 'id');
    }

    public function getAttachmentTypeLabelAttribute(): string
    {
        return $this->attachmentType?->label ?? $this->attachment_type;
    }

    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2).' '.$units[$i];
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'martyr_id' => $this->martyr_id,
            'attachment_type' => $this->attachment_type,
            'original_filename' => $this->original_filename,
            'mime_type' => $this->mime_type,
            'description' => $this->description,
        ];
    }
}
