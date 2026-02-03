<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Promotion extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'martyr_id',
        'current_rank',
        'promotion_rank',
        'current_job_grade_id',
        'promotion_job_grade_id',
        'current_rank_date',
        'promotion_years',
        'next_due_date',
        'description',
        'status',
    ];

    protected $casts = [
        'next_due_date' => 'date',
        'current_rank_date' => 'date',
        'promotion_years' => 'integer',
    ];

    public function martyr(): BelongsTo
    {
        return $this->belongsTo(Martyr::class);
    }

    public function militaryRank(): BelongsTo
    {
        return $this->belongsTo(MilitaryRank::class, 'current_rank');
    }

    public function promotionRank(): BelongsTo
    {
        return $this->belongsTo(MilitaryRank::class, 'promotion_rank');
    }

    public function currentJobGrade(): BelongsTo
    {
        return $this->belongsTo(JobGrade::class, 'current_job_grade_id');
    }

    public function promotionJobGrade(): BelongsTo
    {
        return $this->belongsTo(JobGrade::class, 'promotion_job_grade_id');
    }

    /**
     * Get the status label in Arabic.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status ?? 'default') {
            'pending' => 'في انتظار الترقية',
            'overdue' => 'ترقية متأخرة',
            'completed' => 'ترقية مكتملة',
            default => 'غير محدد',
        };
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'current_rank' => $this->militaryRank->name_ar ?? '',
            'promotion_rank' => $this->promotionRank->name_ar ?? '',
            'current_job_grade' => $this->currentJobGrade->name_ar ?? '',
            'promotion_job_grade' => $this->promotionJobGrade->name_ar ?? '',
            'current_rank_date' => $this->current_rank_date?->format('Y-m-d'),
            'promotion_years' => $this->promotion_years,
            'next_due_date' => $this->next_due_date->format('Y-m-d'),
            'description' => $this->description,
        ];
    }
}
