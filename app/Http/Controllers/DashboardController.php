<?php

namespace App\Http\Controllers;

use App\Models\Compensation;
use App\Models\Martyr;
use App\Models\Promotion;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics.
     */
    public function index()
    {
        // 1. Total Martyrs Count
        $totalMartyrs = Martyr::count();

        // 2. Promotions due in the current year
        $currentYear = now()->year;
        $promotionsDueThisYear = Promotion::whereYear('next_due_date', $currentYear)->count();

        // 3. Total Receipts (Compensations) paid in the current year
        $totalReceiptsThisYear = Compensation::whereYear('receipt_date', $currentYear)->sum('amount');

        return Inertia::render('dashboard', [
            'stats' => [
                'totalMartyrs' => $totalMartyrs,
                'promotionsDueThisYear' => $promotionsDueThisYear,
                'totalReceiptsThisYear' => $totalReceiptsThisYear,
            ],
        ]);
    }
}
