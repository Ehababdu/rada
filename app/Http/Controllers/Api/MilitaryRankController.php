<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MilitaryRank;
use Illuminate\Http\Request;

class MilitaryRankController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');

        $query = MilitaryRank::select('id', 'name_ar', 'name_en');

        if ($search) {
            $query->where('name_ar', 'like', "%{$search}%")
                ->orWhere('name_en', 'like', "%{$search}%");
        }

        return $query->get();
    }
}
