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
        $query = Martyr::with([
            'parentsStatus:id,name_ar,name_en',
            'maritalStatus:id,name_ar,name_en',
            'employmentStatus:id,name',
            'militaryRank:id,name_ar,name_en',
            'bank:id,name_ar',
            'branch:id,name_ar',
            'jobGrade:id,name_ar',
            'employer:id,name_ar,name_en',
            'employerLocation:id,name_ar,name_en',
            'previousEmployer:id,name_ar,name_en',
            'previousEmployerLocation:id,name_ar,name_en',
        ]);

        // If specific IDs are provided, only export those
        if (! empty($this->ids)) {
            $query->whereIn('id', $this->ids);
        } else {
            // Apply filters only if no specific IDs are provided
            if (! empty($this->filters['search'])) {
                $searchTerm = trim($this->filters['search']);

                // If it's a phone number (starts with 09), search phone field only
                if (is_numeric($searchTerm) && str_starts_with($searchTerm, '09')) {
                    $query->where('agent_phone', 'LIKE', '%' . $searchTerm . '%');
                }
                // If it's a number, search in all numeric fields
                elseif (is_numeric($searchTerm)) {
                    $query->where(function ($q) use ($searchTerm) {
                        $q->orWhere('military_number', 'LIKE', '%' . $searchTerm . '%');
                        $q->orWhere('national_id', 'LIKE', '%' . $searchTerm . '%');
                        $q->orWhere('agent_phone', 'LIKE', '%' . $searchTerm . '%');
                        $q->orWhere('file_number', 'LIKE', '%' . $searchTerm . '%');
                    });
                } else {
                    // Split search term into words for partial name matching
                    $searchWords = array_filter(explode(' ', $searchTerm));

                    if (! empty($searchWords)) {
                        $validWords = array_filter($searchWords, function ($word) {
                            return mb_strlen($word) >= 2;
                        });

                        if (! empty($validWords)) {
                            $query->where(function ($q) use ($validWords) {
                                foreach ($validWords as $word) {
                                    $q->where('full_name', 'LIKE', '%' . $word . '%');
                                }
                            });
                        }
                    }
                }
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
                $truthyValues = ['1', 1, true, 'true'];
                $falsyValues = ['0', 0, false, 'false'];

                if (in_array($val, $truthyValues, true)) {
                    $query->where('has_martyr_decision', true);
                } elseif (in_array($val, $falsyValues, true)) {
                    $query->where('has_martyr_decision', false);
                }
            }

            if (! empty($this->filters['death_date_from'])) {
                $query->whereDate('death_date', '>=', $this->filters['death_date_from']);
            }

            if (! empty($this->filters['death_date_to'])) {
                $query->whereDate('death_date', '<=', $this->filters['death_date_to']);
            }

            // Apply additional filters
            $allowedFilters = [
                'marital_status_id',
                'employment_status_id',
                'bank_id',
                'branch_id',
                'parents_status_id',
                'employer_id',
                'previous_employer_id',
                'status',
                'wife_status',
                'file_number',
            ];

            foreach ($allowedFilters as $filter) {
                if (! empty($this->filters[$filter])) {
                    $query->where($filter, $this->filters[$filter]);
                }
            }

            // Apply date filters
            if (! empty($this->filters['date_from'])) {
                $query->where('created_at', '>=', $this->filters['date_from']);
            }

            if (! empty($this->filters['date_to'])) {
                $query->where('created_at', '<=', $this->filters['date_to']);
            }

            // Apply decision date filters
            if (! empty($this->filters['decision_date_from'])) {
                $years = array_map('trim', explode(',', $this->filters['decision_date_from']));
                $query->whereIn(\DB::raw('YEAR(decision_date)'), $years);
            }

            // Apply martyr decision filter
            if (isset($this->filters['has_martyr_decision']) && $this->filters['has_martyr_decision'] !== '') {
                $query->where('has_martyr_decision', $this->filters['has_martyr_decision'] === '1');
            }
        }
        // Add other filters as needed

        return $query;
    }

    public function map($martyr): array
    {
        $all = [
            '#' => $martyr->id,
            'full_name' => $martyr->full_name,
            'file_number' => $martyr->file_number,
            'national_id' => $martyr->national_id,
            'address' => $martyr->address,
            'children_count' => $martyr->children_count,
            'military_rank' => $martyr->militaryRank?->name_ar,
            'job_grade' => $martyr->jobGrade?->name_ar,
            'employment_status' => $martyr->employmentStatus?->name,
            'marital_status' => $martyr->maritalStatus?->name_ar,
            'wife_status' => $martyr->wife_status,
            'military_number' => $martyr->military_number,
            'parents_status' => $martyr->parentsStatus?->name_ar,
            'bank' => $martyr->bank?->name_ar,
            'branch' => $martyr->branch?->name_ar,
            'employer' => $martyr->employer?->name_ar,
            'employer_location' => $martyr->employerLocation?->name_ar,
            'previous_employer' => $martyr->previousEmployer?->name_ar,
            'previous_employer_location' => $martyr->previousEmployerLocation?->name_ar,
            'bank_account_number' => $martyr->bank_account_number,
            'death_date' => $martyr->death_date?->format('Y-m-d'),
            'has_martyr_decision' => $martyr->has_martyr_decision ? 'نعم' : 'لا',
            'decision_number' => $martyr->decision_number,
            'decision_date' => $martyr->decision_date?->format('Y-m-d'),
            'agent_name' => $martyr->agent_name,
            'agent_phone' => $martyr->agent_phone,
            'agent_passport_number' => $martyr->agent_passport_number,
            'agent_relationship' => $martyr->agent_relationship,
            'status' => $martyr->status,
        ];

        // If columns requested, include those in order, otherwise return full set in default order
        if (! empty($this->columns)) {
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
            '#' => '#',
            'full_name' => 'الاسم الكامل',
            'file_number' => 'رقم الملف',
            'national_id' => 'الرقم الوطني',
            'address' => 'العنوان',
            'children_count' => 'عدد الأطفال',
            'military_rank' => 'الرتبة العسكرية',
            'job_grade' => 'الدرجة الوظيفية',
            'employment_status' => 'حالة التوظيف',
            'marital_status' => 'الحالة الزوجية',
            'wife_status' => 'حالة الزوجة',
            'military_number' => 'الرقم العسكري',
            'parents_status' => 'حالة الوالدين',
            'bank' => 'البنك',
            'branch' => 'الفرع',
            'employer' => 'الجهة',
            'employer_location' => 'مكان الجهة',
            'previous_employer' => 'الجهة السابقة',
            'previous_employer_location' => 'مكان الجهة السابقة',
            'bank_account_number' => 'رقم الحساب البنكي',
            'death_date' => 'تاريخ الوفاة',
            'has_martyr_decision' => 'لديه قرار شهيد',
            'decision_number' => 'رقم القرار',
            'decision_date' => 'تاريخ القرار',
            'agent_name' => 'اسم الوكيل',
            'agent_phone' => 'هاتف الوكيل',
            'agent_passport_number' => 'رقم جواز سفر الوكيل',
            'agent_relationship' => 'علاقة الوكيل',
            'status' => 'الحالة',
            'military_number' => 'الرقم العسكري',
            'military_rank' => 'الرتبة العسكرية',
            'bank' => 'البنك',
            'bank_account_number' => 'رقم الحساب البنكي',
            'branch' => 'الفرع',
            'agent_name' => 'اسم الوكيل',
            'agent_phone' => 'هاتف الوكيل',
            'agent_relationship' => 'علاقة الوكيل',
            'status' => 'الحالة',
        ];

        if (! empty($this->columns)) {
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
