<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Bank extends Model
{
    use LogsActivity, Searchable;

    protected $fillable = [
        'name_ar',
        'name_en',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who created this bank.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the branches for this bank.
     */
    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    /**
     * Get the name attribute based on current locale
     */
    public function getNameAttribute(): string
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? $this->name_ar : $this->name_en;
    }

    /**
     * Get the address attribute based on current locale
     */
    public function getAddressAttribute(): ?string
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? $this->address_ar : $this->address_en;
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name_ar' => $this->name_ar,
        ];
    }

    /**
     * Scope a query to only include active banks.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name_ar', 'name_en', 'is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
