<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentsStatus;
use Illuminate\Http\Request;

class ParentsStatusController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');

        $query = ParentsStatus::select('id', 'name_ar', 'name_en');

        if ($search) {
            $query->where('name_ar', 'like', "%{$search}%")
                ->orWhere('name_en', 'like', "%{$search}%");
        }

        return $query->get();
    }
}
