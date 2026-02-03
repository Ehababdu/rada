<?php

namespace App\Services;

use App\Models\Bank;
use Illuminate\Http\Request;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BankService
{
    public function getBanks(Request $request): LengthAwarePaginator
    {
        $search = $request->get('search', '');
        $perPage = $request->get('per_page', 15);

        $builder = Bank::search($search);

        // Apply filters
        $allowedFilters = [
            'name_ar',
            'name_en',
            'code',
            'phone',
            'email',
            'is_active',
        ];

        foreach ($allowedFilters as $filter) {
            if ($request->has($filter) && $request->get($filter) !== null) {
                if ($filter === 'is_active') {
                    $builder->where($filter, $request->boolean($filter));
                } else {
                    $builder->where($filter, $request->get($filter));
                }
            }
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
            'name_ar',
            'name_en',
            'code',
            'phone',
            'email',
            'is_active',
            'created_at',
            'updated_at',
        ];

        if (in_array($sortField, $allowedSorts)) {
            $builder->orderBy($sortField, $direction);
        } else {
            $builder->orderBy('created_at', 'desc');
        }

        return $builder->paginate($perPage)->appends($request->query());
    }

    public function createBank(array $data): Bank
    {
        return Bank::create($data);
    }

    public function updateBank(Bank $bank, array $data): Bank
    {
        $bank->update($data);

        return $bank;
    }

    public function deleteBank(Bank $bank): void
    {
        $bank->delete();
    }
}
