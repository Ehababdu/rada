<?php

namespace App\Models;

use App\Events\AlertCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Alert extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'title',
        'message',
        'type',
        'user_id',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    protected $dispatchesEvents = [
        'created' => AlertCreated::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function markAsUnread(): void
    {
        $this->update(['read_at' => null]);
    }

    public function isRead(): bool
    {
        return ! is_null($this->read_at);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'message', 'type', 'user_id', 'read_at'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
