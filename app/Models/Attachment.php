<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Attachment extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivity, Searchable;

    protected $fillable = [
        'martyr_id',
        'attachment_type',
        'file_path',
        'original_filename',
        'mime_type',
        'file_size',
        'description',
    ];

    protected $appends = ['file_url', 'formatted_file_size'];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->registerMediaCollections();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachments')
            ->acceptsMimeTypes([
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png',
                'image/jpg',
            ])
            ->singleFile();
    }

    public function getMediaModel(): string
    {
        return Media::class;
    }

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
        return $this->attachmentType->label ?? $this->attachment_type;
    }

    public function getFileUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('attachments');
    }

    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->file_size;
        if (! $bytes) {
            // Try to get size from media if available
            $media = $this->getFirstMedia('attachments');
            if ($media) {
                $bytes = $media->size;
            }
        }

        if (! $bytes) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['martyr_id', 'attachment_type', 'original_filename', 'description'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
