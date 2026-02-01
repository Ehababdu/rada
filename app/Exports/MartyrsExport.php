<?php

namespace App\Exports;

use App\Models\Martyr;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MartyrsExport implements FromQuery, WithHeadings, WithMapping
{
    protected $filters;
    protected $columns;
    protected $ids;

    public function __construct($filters = [], $columns = [], $ids = [])
    {
        $this->filters = $filters;
        $this->columns = is_array($columns) ? $columns : (is_string($columns) ? array_filter(array_map('trim', explode(',', $columns))) : []);
        $this->ids = is_array($ids) ? $ids : (is_string($ids) ? array_filter(array_map('trim', explode(',', $ids))) : []);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function query()
    {
        $query = Martyr::with(['parentsStatus', 'maritalStatus', 'employmentStatus', 'militaryRank', 'bank', 'branch']);

        // If specific IDs are provided, only export those
        if (!empty($this->ids)) {
            $query->whereIn('id', $this->ids);
        } else {
            // Apply filters only if no specific IDs are provided
            if (! empty($this->filters['search'])) {
                $query->where('full_name', 'like', '%'.$this->filters['search'].'%')
                    ->orWhere('national_id', 'like', '%'.$this->filters['search'].'%');
            }

            // Apply advanced filters if provided
            if (! empty($this->filters['marital_status_id'])) {
                $query->where('marital_status_id', $this->filters['marital_status_id']);
            }

            if (! empty($this->filters['employment_status_id'])) {
                $query->where('employment_status_id', $this->filters['employment_status_id']);
            }

            if (! empty($this->filters['bank_id'])) {
                $query->where('bank_id', $this->filters['bank_id']);
            }

            if (! empty($this->filters['branch_id'])) {
                $query->where('branch_id', $this->filters['branch_id']);
            }

            if (! empty($this->filters['parents_status_id'])) {
                $query->where('parents_status_id', $this->filters['parents_status_id']);
            }

            if (! empty($this->filters['has_martyr_decision'])) {
                $val = $this->filters['has_martyr_decision'];
                if ($val === '1' || $val === 1 || $val === true) {
                    $query->where('has_martyr_decision', true);
                } elseif ($val === '0' || $val === 0 || $val === 'false') {
                    $query->where('has_martyr_decision', false);
                }
            }

            if (! empty($this->filters['death_date_from'])) {
                $query->whereDate('death_date', '>=', $this->filters['death_date_from']);
            }

            if (! empty($this->filters['death_date_to'])) {
                $query->whereDate('death_date', '<=', $this->filters['death_date_to']);
            }
        }
        // Add other filters as needed

        return $query;
    }

    public function map($martyr): array
    {
        $all = [
            'id' => $martyr->id,
            'full_name' => $martyr->full_name,
            'national_id' => $martyr->national_id,
            'address' => $martyr->address,
            'parents_status' => $martyr->parentsStatus?->name_ar,
            'marital_status' => $martyr->maritalStatus?->name_ar,
            'children_count' => $martyr->children_count,
            'employment_status' => $martyr->employmentStatus?->name_ar,
            'workplace' => $martyr->workplace,
            'previous_workplace' => $martyr->previous_workplace,
            'military_number' => $martyr->military_number,
            'military_rank' => $martyr->militaryRank?->name_ar,
            'bank' => $martyr->bank?->name_ar,
            'bank_account_number' => $martyr->bank_account_number,
            'branch' => $martyr->branch?->name_ar,
            'agent_name' => $martyr->agent_name,
            'agent_phone' => $martyr->agent_phone,
            'agent_relationship' => $martyr->agent_relationship,
            'agent_passport_number' => $martyr->agent_passport_number,
            'profile_image' => $martyr->profile_image,
            'national_id_file' => $martyr->national_id_file,
            'art_image' => $martyr->art_image,
            'death_date' => $martyr->death_date?->format('Y-m-d'),
            'has_martyr_decision' => $martyr->has_martyr_decision ? 'Yes' : 'No',
            'decision_number' => $martyr->decision_number,
            'decision_date' => $martyr->decision_date?->format('Y-m-d'),
            'created_at' => $martyr->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $martyr->updated_at?->format('Y-m-d H:i:s'),
        ];

        // If columns requested, include those in order, otherwise return full set in default order
        if (!empty($this->columns)) {
            $row = [];
            foreach ($this->columns as $col) {
                // map potential alias keys
                $key = $col;
                if (array_key_exists($key, $all)) {
                    $row[] = $all[$key];
                } else {
                    // try alternative keys (e.g., 'military_rank' vs 'militaryRank')
                    $alt = strtolower($key);
                    $row[] = $all[$alt] ?? '';
                }
            }

            // If the app locale is Arabic, reverse the column order to match RTL expectations
            if (app()->getLocale() === 'ar') {
                $row = array_reverse($row);
            }

            return $row;
        }

        $values = array_values($all);
        if (app()->getLocale() === 'ar') {
            $values = array_reverse($values);
        }

        return $values;
    }

    public function headings(): array
    {
        $map = [
            'id' => 'الرقم',
            'full_name' => 'الاسم الكامل',
            'national_id' => 'الرقم الوطني',
            'address' => 'العنوان',
            'parents_status' => 'حالة الوالدين',
            'marital_status' => 'الحالة الزوجية',
            'children_count' => 'عدد الأطفال',
            'employment_status' => 'حالة التوظيف',
            'workplace' => 'مكان العمل',
            'previous_workplace' => 'مكان العمل السابق',
            'military_number' => 'الرقم العسكري',
            'military_rank' => 'الرتبة العسكرية',
            'bank' => 'البنك',
            'bank_account_number' => 'رقم الحساب البنكي',
            'branch' => 'الفرع',
            'agent_name' => 'اسم الوكيل',
            'agent_phone' => 'هاتف الوكيل',
            'agent_relationship' => 'علاقة الوكيل',
            'agent_passport_number' => 'رقم جواز سفر الوكيل',
            'profile_image' => 'الصورة الشخصية',
            'national_id_file' => 'ملف الهوية الوطنية',
            'art_image' => 'صورة فنية',
            'death_date' => 'تاريخ الوفاة',
            'has_martyr_decision' => 'لديه قرار شهيد',
            'decision_number' => 'رقم القرار',
            'decision_date' => 'تاريخ القرار',
            'created_at' => 'تاريخ الإنشاء',
            'updated_at' => 'تاريخ التحديث',
        ];

        if (!empty($this->columns)) {
            $heads = [];
            foreach ($this->columns as $col) {
                $key = $col;
                if (isset($map[$key])) {
                    $heads[] = $map[$key];
                } else {
                    $heads[] = ucfirst(str_replace('_', ' ', $key));
                }
            }
            if (app()->getLocale() === 'ar') {
                $heads = array_reverse($heads);
            }

            return $heads;
        }

        $values = array_values($map);
        if (app()->getLocale() === 'ar') {
            $values = array_reverse($values);
        }

        return $values;
    }
}
