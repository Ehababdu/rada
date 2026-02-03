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
        $perPage = $request->get('per_page', 10);

        // Start with base query
        $query = Martyr::query();

        // Apply search if provided
        if ($search) {
            $searchTerm = trim($search);

            // Search logic for numeric terms:
            // 1. If starts with '09' → search in agent_phone field only (Syrian phone numbers)
            // 2. If numeric but not phone → search in military_number, national_id, and agent_phone fields
            // 3. If text → search in full_name field with word matching

            // If it's a phone number (starts with 09), search phone field only
            if (is_numeric($searchTerm) && str_starts_with($searchTerm, '09')) {
                // Search by agent phone - supports partial matching
                $query->where('agent_phone', 'LIKE', '%' . $searchTerm . '%');
            }
            // If it's a number, search in all numeric fields
            elseif (is_numeric($searchTerm)) {
                $query->where(function ($q) use ($searchTerm) {
                    // Search by military number - supports partial matching
                    $q->orWhere('military_number', 'LIKE', '%' . $searchTerm . '%');
                    // Search by national ID - supports partial matching
                    $q->orWhere('national_id', 'LIKE', '%' . $searchTerm . '%');
                    // Also search in phone field for partial matches
                    $q->orWhere('agent_phone', 'LIKE', '%' . $searchTerm . '%');
                    // Search by file number - supports partial matching
                    $q->orWhere('file_number', 'LIKE', '%' . $searchTerm . '%');
                });
            } else {
                // Split search term into words for partial name matching
                $searchWords = array_filter(explode(' ', $searchTerm));

                if (! empty($searchWords)) {
                    // For multiple words, find records that contain ALL words (AND logic)
                    $validWords = array_filter($searchWords, function ($word) {
                        return mb_strlen($word) >= 2; // Only words with at least 2 characters
                    });

                    if (! empty($validWords)) {
                        $query->where(function ($q) use ($validWords) {
                            foreach ($validWords as $word) {
                                // Search for each word in the full_name field using LIKE
                                $q->where('full_name', 'LIKE', '%' . $word . '%');
                            }
                        });
                    }
                }
            }
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
            'file_number',
        ];

        foreach ($allowedFilters as $filter) {
            if ($request->has($filter) && $request->get($filter)) {
                $query->where($filter, $request->get($filter));
            }
        }

        // Apply date filters
        if ($request->has('date_from') && $request->get('date_from')) {
            $query->where('created_at', '>=', $request->get('date_from'));
        }

        if ($request->has('date_to') && $request->get('date_to')) {
            $query->where('created_at', '<=', $request->get('date_to'));
        }

        // Apply death date filters
        if ($request->has('death_date_from') && $request->get('death_date_from')) {
            $years = array_map('trim', explode(',', $request->get('death_date_from')));
            $query->whereIn(\DB::raw('YEAR(death_date)'), $years);
        }

        // Apply decision date filters
        if ($request->has('decision_date_from') && $request->get('decision_date_from')) {
            $years = array_map('trim', explode(',', $request->get('decision_date_from')));
            $query->whereIn(\DB::raw('YEAR(decision_date)'), $years);
        }

        // Apply martyr decision filter
        if ($request->has('has_martyr_decision') && $request->get('has_martyr_decision') !== '') {
            $query->where('has_martyr_decision', $request->get('has_martyr_decision') === '1');
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
            'file_number',
        ];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $direction);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginator = $query->paginate($perPage, ['*'], 'page', $request->get('page', 1))->appends($request->query());

        // Optimize relationship loading - only load what's needed for the table
        $paginator->load([
            'militaryRank:id,name_ar,name_en',
            'bank:id,name_ar',
            'branch:id,name_ar',
            'employmentStatus:id,name',
            'maritalStatus:id,name_ar,name_en',
            'parentsStatus:id,name_ar,name_en',
            'jobGrade:id,name_ar,name_en',
            'employer:id,name_ar,name_en',
            'employerLocation:id,name_ar,name_en',
            'previousEmployer:id,name_ar,name_en',
            'previousEmployerLocation:id,name_ar,name_en',
        ]);

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
    public function searchMartyrs(string $query, int $limit = 10, array $filters = [])
    {
        $query = trim($query);

        if ($query === '') {
            return collect([]);
        }

        try {
            // Use the same search logic as getMartyrs for consistency
            $searchTerm = trim($query);

            // Split search term into words for partial name matching
            $searchWords = array_filter(explode(' ', $searchTerm));

            $searchQuery = Martyr::query();

            // Apply search if provided
            if (! empty($searchWords)) {
                // For multiple words, find records that contain ALL words (AND logic)
                $validWords = array_filter($searchWords, function ($word) {
                    return mb_strlen($word) >= 2; // Only words with at least 2 characters
                });

                if (! empty($validWords)) {
                    $searchQuery->where(function ($q) use ($validWords) {
                        foreach ($validWords as $word) {
                            // Search for each word in the full_name field using LIKE
                            $q->where('full_name', 'LIKE', '%' . $word . '%');
                        }
                    });
                }
            }

            $results = $searchQuery->take($limit)->get();

            return $results->map(function ($martyr) {
                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                    'military_number' => $martyr->military_number,
                    'decision_number' => $martyr->decision_number,
                ];
            });
        } catch (\Exception $e) {
            \Log::error('Search failed, falling back to simple search: ' . $e->getMessage());

            // Fallback to simple LIKE search
            return $this->fallbackSearch($query, $limit);
        }
    }

    private function buildMeiliFilters(array $filters): string
    {
        $meiliFilters = [];

        foreach ($filters as $field => $value) {
            if ($value) {
                $meiliFilters[] = "{$field} = {$value}";
            }
        }

        return implode(' AND ', $meiliFilters);
    }

    private function fallbackSearch(string $query, int $limit)
    {
        $searchTerm = '%' . $query . '%';

        return Martyr::where(function ($q) use ($searchTerm) {
            $q->where('full_name', 'LIKE', $searchTerm)
                ->orWhere('national_id', 'LIKE', $searchTerm)
                ->orWhere('military_number', 'LIKE', $searchTerm)
                ->orWhere('decision_number', 'LIKE', $searchTerm);
        })->take($limit)->get()->map(function ($martyr) {
            return [
                'id' => $martyr->id,
                'full_name' => $martyr->full_name,
                'national_id' => $martyr->national_id,
            ];
        });
    }
}
