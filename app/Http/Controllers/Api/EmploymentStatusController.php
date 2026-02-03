<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmploymentStatusController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');

        $query = \App\Models\EmploymentStatus::select('id', 'name as name_ar', \DB::raw('NULL as name_en'));

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->get();
    }
}
