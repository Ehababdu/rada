<?php

namespace App\Services;

use App\Models\Martyr;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class MartyrService
{
    public function getMartyrs(Request $request): LengthAwarePaginator
    {
        $search = $request->get('search', '');
        $perPage = $request->get('per_page', 15);

        $builder = Martyr::with(['militaryRank', 'bank', 'branch', 'employmentStatus', 'maritalStatus', 'parentsStatus', 'jobGrade', 'employer', 'employerLocation', 'previousEmployer', 'previousEmployerLocation']);

        if ($search) {
            $searchTerm = trim($search);
            // إزالة الحركات والتشكيل من البحث لتحسين النتائج
            $searchTerm = preg_replace('/[\x{064B}-\x{065F}]/u', '', $searchTerm);

            $builder->where(function ($query) use ($searchTerm) {
                // البحث في الاسم الكامل كاملاً أولاً
                $query->where('full_name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('agent_name', 'LIKE', "%{$searchTerm}%");

                // البحث في كلمات منفصلة في الاسم الكامل
                $searchWords = explode(' ', $searchTerm);
                if (count($searchWords) > 1) {
                    foreach ($searchWords as $word) {
                        $word = trim($word);
                        if (empty($word) || mb_strlen($word, 'UTF-8') < 2) {
                            continue;
                        }

                        $query->orWhere('full_name', 'LIKE', "%{$word}%")
                            ->orWhere('agent_name', 'LIKE', "%{$word}%");
                    }
                }

                // البحث في الحقول الأخرى
                $query->orWhere('national_id', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('address', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('military_number', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('bank_account_number', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('agent_phone', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('agent_relationship', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('agent_passport_number', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('decision_number', 'LIKE', "%{$searchTerm}%");

                // Search in related model names (parents, marital, employment, rank, bank)
                $query->orWhereHas('parentsStatus', function ($q) use ($searchTerm) {
                    $q->where('name_ar', 'like', "%{$searchTerm}%")
                        ->orWhere('name_en', 'like', "%{$searchTerm}%");
                });

                $query->orWhereHas('maritalStatus', function ($q) use ($searchTerm) {
                    $q->where('name_ar', 'like', "%{$searchTerm}%")
                        ->orWhere('name_en', 'like', "%{$searchTerm}%");
                });

                $query->orWhereHas('employmentStatus', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%");
                });

                $query->orWhereHas('militaryRank', function ($q) use ($searchTerm) {
                    $q->where('name_ar', 'like', "%{$searchTerm}%")
                        ->orWhere('name_en', 'like', "%{$searchTerm}%");
                });

                $query->orWhereHas('bank', function ($q) use ($searchTerm) {
                    $q->where('name_ar', 'like', "%{$searchTerm}%")
                        ->orWhere('name_en', 'like', "%{$searchTerm}%");
                });
            });
        }

        // Apply filters
        $allowedFilters = [
            'full_name',
            'national_id',
            'address',
            'parents_status_id',
            'marital_status_id',
            'employment_status_id',
            'military_number',
            'bank_id',
            'branch_id',
            'agent_name',
            'agent_phone',
            'employer_id',
            'previous_employer_id',
            'status',
            'wife_status',
        ];

        foreach ($allowedFilters as $filter) {
            if ($request->has($filter) && $request->get($filter)) {
                $builder->where($filter, $request->get($filter));
            }
        }

        // Apply date filters
        if ($request->has('date_from') && $request->get('date_from')) {
            $builder->where('created_at', '>=', $request->get('date_from'));
        }

        if ($request->has('date_to') && $request->get('date_to')) {
            $builder->where('created_at', '<=', $request->get('date_to'));
        }

        // Apply death date filters
        if ($request->has('death_date_from') && $request->get('death_date_from')) {
            $years = array_map('trim', explode(',', $request->get('death_date_from')));
            $builder->whereIn(\DB::raw('YEAR(death_date)'), $years);
        }

        // Apply decision date filters
        if ($request->has('decision_date_from') && $request->get('decision_date_from')) {
            $years = array_map('trim', explode(',', $request->get('decision_date_from')));
            $builder->whereIn(\DB::raw('YEAR(decision_date)'), $years);
        }

        // Apply martyr decision filter
        if ($request->has('has_martyr_decision') && $request->get('has_martyr_decision') !== '') {
            $builder->where('has_martyr_decision', $request->get('has_martyr_decision') === '1');
        }

        // Apply sorting
        $sort = $request->get('sort', '-created_at');
        if (str_starts_with($sort, '-')) {
            $sortField = substr($sort, 1);
            $direction = 'desc';
        } else {
            $sortField = $sort;
            $direction = 'asc';
        }

        $allowedSorts = [
            'full_name',
            'national_id',
            'address',
            'parents_status_id',
            'marital_status_id',
            'employment_status_id',
            'created_at',
            'updated_at',
            'status',
        ];

        if (in_array($sortField, $allowedSorts)) {
            $builder->orderBy($sortField, $direction);
        } else {
            $builder->orderBy('created_at', 'desc');
        }

        $paginator = $builder->paginate($perPage)->appends($request->query());

        return $paginator;
    }

    public function createMartyr(array $data, Request $request): Martyr
    {
        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')->store('martyrs/images', 'public');
        }

        if ($request->hasFile('national_id_file')) {
            $data['national_id_file'] = $request->file('national_id_file')->store('martyrs/files', 'public');
        }

        if ($request->hasFile('art_image')) {
            $data['art_image'] = $request->file('art_image')->store('martyrs/art', 'public');
        }

        return Martyr::create($data);
    }

    public function updateMartyr(Martyr $martyr, array $data, Request $request): Martyr
    {
        // Handle profile image
        if ($request->hasFile('profile_image')) {
            if ($martyr->profile_image) {
                Storage::disk('public')->delete($martyr->profile_image);
            }
            $data['profile_image'] = $request->file('profile_image')->store('martyrs/images', 'public');
        }

        // Handle national id file
        if ($request->hasFile('national_id_file')) {
            if ($martyr->national_id_file) {
                Storage::disk('public')->delete($martyr->national_id_file);
            }
            $data['national_id_file'] = $request->file('national_id_file')->store('martyrs/files', 'public');
        }

        // Handle art image
        if ($request->hasFile('art_image')) {
            if ($martyr->art_image) {
                Storage::disk('public')->delete($martyr->art_image);
            }
            $data['art_image'] = $request->file('art_image')->store('martyrs/art', 'public');
        }

        $martyr->update($data);

        return $martyr;
    }

    public function deleteMartyr(Martyr $martyr): void
    {
        $martyr->delete();
    }

    /**
     * Search martyrs with Scout (Meilisearch) for faster results.
     */
    public function searchMartyrs(string $query, int $limit = 10)
    {
        $query = trim($query);

        if ($query === '') {
            return collect([]);
        }

        // Skip Scout in testing environment to avoid index issues
        if (app()->environment('testing')) {
            $searchTerm = '%'.$query.'%';
            $results = Martyr::where('full_name', 'like', $searchTerm)
                ->orWhere('national_id', 'like', $searchTerm)
                ->take($limit)
                ->get();

            return $results->map(function ($martyr) {
                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                ];
            });
        }

        \Log::info('Using Scout search');
        try {
            // Use Scout for search
            $results = Martyr::search($query)->take($limit)->get();

            // Return only needed fields
            return $results->map(function ($martyr) {
                // Handle both model instances and arrays (Scout database driver returns arrays)
                if (is_array($martyr)) {
                    return [
                        'id' => $martyr['id'],
                        'full_name' => $martyr['full_name'],
                        'national_id' => $martyr['national_id'],
                    ];
                }

                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                ];
            });
        } catch (\Exception $e) {
            \Log::info('Scout failed, falling back to database search: '.$e->getMessage());
            // Fall back to regular database search if Scout fails
            $searchTerm = '%'.$query.'%';
            $results = Martyr::where('full_name', 'like', $searchTerm)
                ->orWhere('national_id', 'like', $searchTerm)
                ->take($limit)
                ->get();

            return $results->map(function ($martyr) {
                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                ];
            });
        }
    }
}
