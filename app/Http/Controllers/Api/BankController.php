<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\Request;

class BankController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');

        $query = Bank::select('id', 'name_ar', \DB::raw('NULL as name_en'))
            ->where('is_active', true);

        if ($search) {
            $query->where('name_ar', 'like', "%{$search}%");
        }

        return $query->get();
    }

    public function branches(Bank $bank, Request $request)
    {
        $search = $request->get('search', '');

        $query = $bank->branches()
            ->select('id', 'name_ar', \DB::raw('NULL as name_en'))
            ->where('is_active', true);

        if ($search) {
            $query->where('name_ar', 'like', "%{$search}%");
        }

        return $query->get();
    }
}
