<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Compensation extends Model
{
    use HasFactory, Searchable;

    protected $table = 'compensations';

    protected $fillable = [
        'martyr_id',
        'recipient_name',
        'recipient_passport_number',
        'amount',
        'receipt_date',
        'months',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'receipt_date' => 'date',
        'months' => 'array',
    ];

    public function martyr(): BelongsTo
    {
        return $this->belongsTo(Martyr::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'recipient_name' => $this->recipient_name,
            'recipient_passport_number' => $this->recipient_passport_number,
            'amount' => $this->amount,
            'receipt_date' => $this->receipt_date->format('Y-m-d'),
        ];
    }
}
