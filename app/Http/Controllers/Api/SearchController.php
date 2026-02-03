<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemPage;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search for system pages.
     */
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([]);
        }

        $results = SystemPage::search($query)
            ->take(10)
            ->get();

        $user = $request->user();

        // Filter results based on user permissions
        $filteredResults = $results->filter(function ($page) use ($user) {
            if (empty($page->permission)) {
                return true;
            }

            // Super admin always has access
            if ($user->hasRole('super-admin')) {
                return true;
            }

            return $user->can($page->permission);
        });

        return response()->json($filteredResults->values());
    }
}
