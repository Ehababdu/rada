<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class EmployerLocation extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'name_ar',
        'name_en',
        'employer_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the employer for this location.
     */
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    /**
     * Get the name attribute based on current locale
     */
    public function getNameAttribute(): string
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? $this->name_ar : $this->name_en;
    }

    public function toSearchableArray(): array
    {
        return [
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
        ];
    }
}
