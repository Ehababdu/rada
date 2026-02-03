<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Branch extends Model
{
    use Searchable;

    protected $fillable = [
        'bank_id',
        'name_ar',
        'name_en',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'name_ar' => $this->name_ar,
        ];
    }
}
