<?php

namespace App\Http\Controllers;

use App\Models\Compensation;
use App\Models\Martyr;
use App\Models\Promotion;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        // إحصائيات عامة
        $stats = [
            'total_martyrs' => Martyr::count(),
            'total_promotions' => Promotion::count(),
            'total_compensations' => Compensation::count(),
            'pending_promotions' => Promotion::where('status', 'pending')->count(),
            'overdue_promotions' => Promotion::where('status', 'overdue')->count(),
            'completed_promotions' => Promotion::where('status', 'completed')->count(),
        ];

        // بيانات الشهداء حسب الرتبة العسكرية
        $martyrsByRank = Martyr::with('militaryRank')
            ->selectRaw('military_rank_id, COUNT(*) as count')
            ->groupBy('military_rank_id')
            ->get()
            ->map(function ($item) {
                return [
                    'rank' => $item->militaryRank?->name_ar ?? 'غير محدد',
                    'count' => $item->count,
                ];
            });

        // بيانات الترقيات حسب السنة
        $promotionsByYear = Promotion::selectRaw('YEAR(next_due_date) as year, COUNT(*) as count')
            ->whereNotNull('next_due_date')
            ->groupBy('year')
            ->orderBy('year')
            ->get();

        // بيانات المكافآت حسب الشهر
        $compensationsByMonth = Compensation::selectRaw('MONTH(receipt_date) as month, COUNT(*) as count, SUM(amount) as total_amount')
            ->whereNotNull('receipt_date')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $this->getMonthName($item->month),
                    'count' => $item->count,
                    'total_amount' => $item->total_amount,
                ];
            });

        // أحدث الترقيات
        $recentPromotions = Promotion::with(['martyr', 'promotionRank'])
            ->whereHas('martyr')
            ->whereHas('promotionRank')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // أحدث المكافآت
        $recentCompensations = Compensation::with('martyr')
            ->whereHas('martyr')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return inertia('Reports/Index', [
            'stats' => $stats,
            'martyrsByRank' => $martyrsByRank,
            'promotionsByYear' => $promotionsByYear,
            'compensationsByMonth' => $compensationsByMonth,
            'recentPromotions' => $recentPromotions,
            'recentCompensations' => $recentCompensations,
        ]);
    }

    private function getMonthName($monthNumber)
    {
        $months = [
            1 => 'يناير',
            2 => 'فبراير',
            3 => 'مارس',
            4 => 'أبريل',
            5 => 'مايو',
            6 => 'يونيو',
            7 => 'يوليو',
            8 => 'أغسطس',
            9 => 'سبتمبر',
            10 => 'أكتوبر',
            11 => 'نوفمبر',
            12 => 'ديسمبر',
        ];

        return $months[$monthNumber] ?? 'غير محدد';
    }
}
