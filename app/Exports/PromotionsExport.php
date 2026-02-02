<?php

namespace App\Exports;

use App\Models\Promotion;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PromotionsExport implements FromQuery, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function query()
    {
        $query = Promotion::with(['martyr', 'militaryRank', 'promotionRank', 'currentJobGrade', 'promotionJobGrade']);

        // Apply tab filter
        if (!empty($this->filters['tab'])) {
            if ($this->filters['tab'] === 'military') {
                $query->whereNull('current_job_grade_id')->whereNull('promotion_job_grade_id');
            } elseif ($this->filters['tab'] === 'employees') {
                $query->where(function ($q) {
                    $q->whereNotNull('current_job_grade_id')->orWhereNotNull('promotion_job_grade_id');
                });
            }
        }

        // Apply search
        if (!empty($this->filters['search'])) {
            $query->whereHas('martyr', function ($q) {
                $q->where('full_name', 'like', '%' . $this->filters['search'] . '%')
                  ->orWhere('national_id', 'like', '%' . $this->filters['search'] . '%');
            });
        }

        // Apply martyr_id
        if (!empty($this->filters['martyr_id'])) {
            $query->where('martyr_id', $this->filters['martyr_id']);
        }

        return $query->orderBy('next_due_date', 'asc');
    }

    public function map($promotion): array
    {
        return [
            'id' => $promotion->id,
            'martyr_name' => $promotion->martyr?->full_name ?? 'غير محدد',
            'martyr_national_id' => $promotion->martyr?->national_id ?? 'غير محدد',
            'current_rank' => $promotion->militaryRank?->name_ar ?? 'غير محدد',
            'promotion_rank' => $promotion->promotionRank?->name_ar ?? 'غير محدد',
            'current_job_grade' => $promotion->currentJobGrade?->name_ar ?? 'غير محدد',
            'promotion_job_grade' => $promotion->promotionJobGrade?->name_ar ?? 'غير محدد',
            'current_rank_date' => $promotion->current_rank_date?->format('d/m/Y'),
            'promotion_years' => $promotion->promotion_years,
            'next_due_date' => $promotion->next_due_date->format('d/m/Y'),
            'status' => $promotion->status_label,
            'description' => $promotion->description,
            'created_at' => $promotion->created_at->format('d/m/Y'),
        ];
    }

    public function headings(): array
    {
        $headings = [
            'الرقم',
            'اسم الشهيد',
            'الرقم الوطني',
            'الرتبة الحالية',
            'رتبة الترقية',
            'الدرجة الحالية',
            'درجة الترقية',
            'تاريخ الحصول',
            'سنوات الترقية',
            'تاريخ الاستحقاق التالي',
            'الحالة',
            'الوصف',
            'تاريخ الإنشاء',
        ];

        if (app()->getLocale() === 'ar') {
            $headings = array_reverse($headings);
        }

        return $headings;
    }
}