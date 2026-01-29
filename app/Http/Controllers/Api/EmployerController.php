<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employer;
use Illuminate\Http\Request;

class EmployerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');

        $query = Employer::select('id', 'name_ar', \DB::raw('NULL as name_en'))
            ->where('is_active', true);

        if ($search) {
            $query->where('name_ar', 'like', "%{$search}%");
        }

        return $query->get();
    }

    public function locations(Employer $employer, Request $request)
    {
        $search = $request->get('search', '');

        $query = $employer->locations()->select('id', 'name_ar', \DB::raw('NULL as name_en'))
            ->where('is_active', true);

        if ($search) {
            $query->where('name_ar', 'like', "%{$search}%");
        }

        return $query->get();
    }
}