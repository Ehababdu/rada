<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Employer extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'name_ar',
        'name_en',
        'employer_location_id',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who created this employer.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the location for this employer.
     */
    public function location()
    {
        return $this->belongsTo(EmployerLocation::class, 'employer_location_id');
    }

    /**
     * Get the locations for this employer.
     */
    public function locations()
    {
        return $this->hasMany(EmployerLocation::class);
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
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
        ];
    }

    /**
     * Scope a query to only include active employers.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
