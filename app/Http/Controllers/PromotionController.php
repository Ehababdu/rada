<?php

namespace App\Http\Controllers;

use App\Models\JobGrade;
use App\Models\Martyr;
use App\Models\MilitaryRank;
use App\Models\Promotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        if (! auth()->user()->can('promotions.view')) {
            abort(403, 'Unauthorized');
        }
        // Update promotion statuses
        Artisan::call('promotions:update-statuses');

        $search = $request->get('search');

        if ($search) {
            // Use Scout for search
            $promotions = Promotion::search($search)
                ->query(fn ($query) => $query->with(['martyr', 'militaryRank', 'promotionRank', 'currentJobGrade', 'promotionJobGrade']))
                ->paginate(15);
        } else {
            // Use regular query for listing
            $promotions = Promotion::with(['martyr', 'militaryRank', 'promotionRank', 'currentJobGrade', 'promotionJobGrade'])
                ->when($request->martyr_id, function ($query) use ($request) {
                    $query->where('martyr_id', $request->martyr_id);
                })
                ->orderBy('next_due_date', 'asc')
                ->paginate(15);
        }

        $promotions->through(function ($promotion) {
            return [
                'id' => $promotion->id,
                'martyr_id' => $promotion->martyr_id,
                'martyr_name' => $promotion->martyr?->full_name ?? 'غير محدد',
                'martyr_national_id' => $promotion->martyr?->national_id ?? 'غير محدد',
                'current_rank' => $promotion->militaryRank?->name_ar ?? 'غير محدد',
                'promotion_rank' => $promotion->promotionRank?->name_ar ?? 'غير محدد',
                'current_job_grade' => $promotion->currentJobGrade?->name_ar ?? 'غير محدد',
                'promotion_job_grade' => $promotion->promotionJobGrade?->name_ar ?? 'غير محدد',
                'current_job_grade_id' => $promotion->current_job_grade_id,
                'promotion_job_grade_id' => $promotion->promotion_job_grade_id,
                'current_rank_date' => $promotion->current_rank_date?->format('Y-m-d'),
                'promotion_years' => $promotion->promotion_years,
                'next_due_date' => $promotion->next_due_date->format('Y-m-d'),
                'next_due_date_formatted' => $promotion->next_due_date->format('d/m/Y'),
                'description' => $promotion->description,
                'status' => $promotion->status,
                'status_label' => $promotion->status_label,
                'created_at' => $promotion->created_at->format('d/m/Y'),
            ];
        });

        $martyrs = Martyr::select('id', 'full_name', 'national_id', 'military_rank_id', 'employment_status_id', 'job_grade_id')
            ->with(['militaryRank:id,name_ar,name_en', 'jobGrade:id,name_ar,name_en'])
            ->orderBy('full_name')
            ->get()
            ->map(function ($martyr) {
                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                    'military_rank' => $martyr->militaryRank?->name_ar,
                    'job_grade' => $martyr->jobGrade?->name_ar,
                ];
            });

        return Inertia::render('Promotions/Index', [
            'promotions' => $promotions,
            'martyrs' => $martyrs,
            'filters' => $request->only(['search', 'martyr_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        if (! auth()->user()->can('promotions.create')) {
            abort(403, 'Unauthorized');
        }
        $martyrs = Martyr::select('id', 'full_name', 'national_id', 'military_rank_id', 'job_grade_id', 'employment_status_id')
            ->with('militaryRank:id,name_ar,name_en', 'jobGrade:id,name_ar')
            ->orderBy('full_name')
            ->get()
            ->map(function ($martyr) {
                // If martyr has no direct military_rank_id, try to find last promotion's rank
                $militaryRankId = $martyr->military_rank_id;
                $militaryRankName = $martyr->militaryRank?->name_ar;

                if (is_null($militaryRankId)) {
                    $lastPromotion = \App\Models\Promotion::where('martyr_id', $martyr->id)
                        ->latest('created_at')
                        ->with('militaryRank:id,name_ar')
                        ->first();

                    if ($lastPromotion && $lastPromotion->militaryRank) {
                        $militaryRankId = $lastPromotion->militaryRank->id;
                        $militaryRankName = $lastPromotion->militaryRank->name_ar;
                    }
                }

                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                    'military_rank_id' => $militaryRankId,
                    'military_rank' => $militaryRankName,
                    'employment_status_id' => $martyr->employment_status_id,
                    'job_grade_id' => $martyr->job_grade_id,
                    'jobGrade' => $martyr->jobGrade ? [
                        'id' => $martyr->jobGrade->id,
                        'name_ar' => $martyr->jobGrade->name_ar,
                    ] : null,
                ];
            });

        $selectedMartyr = null;
        if ($request->martyr_id) {
            $selectedMartyr = Martyr::find($request->martyr_id);
        }

        $militaryRanks = MilitaryRank::select('id', 'name_ar')->orderBy('id')->get()->map(function ($rank) {
            return [
                'id' => $rank->id,
                'name_ar' => $rank->name_ar,
            ];
        });

        $employmentStatuses = \App\Models\EmploymentStatus::select('id', 'name')->orderBy('id')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
            ];
        });

        $jobGrades = JobGrade::select('id', 'name_ar', 'name_en', 'order')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return Inertia::render('Promotions/Create', [
            'martyrs' => $martyrs,
            'selectedMartyr' => $selectedMartyr,
            'military_ranks' => $militaryRanks,
            'employment_statuses' => $employmentStatuses,
            'jobGrades' => $jobGrades,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'martyr_id' => 'required|exists:martyrs,id',
            'current_rank' => 'nullable|exists:military_ranks,id',
            'promotion_rank' => 'nullable|exists:military_ranks,id',
            'current_job_grade_id' => 'nullable|exists:job_grades,id',
            'promotion_job_grade_id' => 'nullable|exists:job_grades,id',
            'current_rank_date' => 'nullable|date',
            'promotion_years' => 'required|integer|min:1|max:10',
            'next_due_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ]);

        Promotion::create($validated);

        return redirect()->route('promotions.index')
            ->with('success', 'تم إضافة الترقية بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(Promotion $promotion): Response
    {
        $promotion->load(['martyr', 'militaryRank', 'promotionRank']);

        return Inertia::render('Promotions/Show', [
            'promotion' => [
                'id' => $promotion->id,
                'martyr_id' => $promotion->martyr_id,
                'martyr_name' => $promotion->martyr->full_name,
                'martyr_national_id' => $promotion->martyr->national_id,
                'current_rank' => $promotion->militaryRank?->name_ar ?? 'غير محدد',
                'promotion_rank' => $promotion->promotionRank?->name_ar ?? 'غير محدد',
                'promotion_years' => $promotion->promotion_years,
                'next_due_date' => $promotion->next_due_date->format('Y-m-d'),
                'next_due_date_formatted' => $promotion->next_due_date->format('d/m/Y'),
                'description' => $promotion->description,
                'created_at' => $promotion->created_at->format('d/m/Y H:i'),
                'updated_at' => $promotion->updated_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promotion $promotion): Response
    {
        $promotion->load(['martyr', 'currentJobGrade', 'promotionJobGrade']);

        $martyrs = Martyr::select('id', 'full_name', 'national_id', 'military_rank_id', 'job_grade_id', 'employment_status_id')
            ->with('militaryRank:id,name_ar,name_en', 'jobGrade:id,name_ar')
            ->orderBy('full_name')
            ->get()
            ->map(function ($martyr) {
                // If martyr has no direct military_rank_id, try to find last promotion's rank
                $militaryRankId = $martyr->military_rank_id;
                $militaryRankName = $martyr->militaryRank?->name_ar;

                if (is_null($militaryRankId)) {
                    $lastPromotion = \App\Models\Promotion::where('martyr_id', $martyr->id)
                        ->latest('created_at')
                        ->with('militaryRank:id,name_ar')
                        ->first();

                    if ($lastPromotion && $lastPromotion->militaryRank) {
                        $militaryRankId = $lastPromotion->militaryRank->id;
                        $militaryRankName = $lastPromotion->militaryRank->name_ar;
                    }
                }

                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                    'military_rank_id' => $militaryRankId,
                    'military_rank' => $militaryRankName,
                    'employment_status_id' => $martyr->employment_status_id,
                    'job_grade_id' => $martyr->job_grade_id,
                    'jobGrade' => $martyr->jobGrade ? [
                        'id' => $martyr->jobGrade->id,
                        'name_ar' => $martyr->jobGrade->name_ar,
                    ] : null,
                ];
            });

        $militaryRanks = MilitaryRank::select('id', 'name_ar')->orderBy('id')->get()->map(function ($rank) {
            return [
                'id' => $rank->id,
                'name_ar' => $rank->name_ar,
            ];
        });

        $employmentStatuses = \App\Models\EmploymentStatus::select('id', 'name')->orderBy('id')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
            ];
        });

        $jobGrades = JobGrade::select('id', 'name_ar', 'name_en', 'order')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        // Ensure we pass the promotion as a plain array and include job grade names
        $promotionData = $promotion->toArray();
        $promotionData['currentJobGrade'] = $promotion->currentJobGrade ? [
            'id' => $promotion->currentJobGrade->id,
            'name_ar' => $promotion->currentJobGrade->name_ar,
            'name_en' => $promotion->currentJobGrade->name_en,
        ] : null;
        $promotionData['promotionJobGrade'] = $promotion->promotionJobGrade ? [
            'id' => $promotion->promotionJobGrade->id,
            'name_ar' => $promotion->promotionJobGrade->name_ar,
            'name_en' => $promotion->promotionJobGrade->name_en,
        ] : null;

        return Inertia::render('Promotions/Edit', [
            'promotion' => $promotionData,
            'martyrs' => $martyrs,
            'military_ranks' => $militaryRanks,
            'employment_statuses' => $employmentStatuses,
            'jobGrades' => $jobGrades,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promotion $promotion): RedirectResponse
    {
        if (! auth()->user()->can('promotions.edit')) {
            abort(403, 'Unauthorized');
        }
        $validated = $request->validate([
            'martyr_id' => 'required|exists:martyrs,id',
            'current_rank' => 'nullable|exists:military_ranks,id',
            'promotion_rank' => 'nullable|exists:military_ranks,id',
            'current_job_grade' => 'nullable|string|max:255',
            'promotion_job_grade' => 'nullable|string|max:255',
            'current_rank_date' => 'nullable|date',
            'promotion_years' => 'required|integer|min:1|max:10',
            'next_due_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ]);
        // Convert job grade names to IDs
        if (! empty($validated['current_job_grade'])) {
            $currentJobGrade = \App\Models\JobGrade::where('name_ar', $validated['current_job_grade'])
                ->orWhere('name_en', $validated['current_job_grade'])
                ->first();
            $validated['current_job_grade_id'] = $currentJobGrade?->id;
        } else {
            $validated['current_job_grade_id'] = null;
        }

        if (! empty($validated['promotion_job_grade'])) {
            $promotionJobGrade = \App\Models\JobGrade::where('name_ar', $validated['promotion_job_grade'])
                ->orWhere('name_en', $validated['promotion_job_grade'])
                ->first();
            $validated['promotion_job_grade_id'] = $promotionJobGrade?->id;
        } else {
            $validated['promotion_job_grade_id'] = null;
        }

        // Remove the string fields as they're not in the fillable array
        unset($validated['current_job_grade'], $validated['promotion_job_grade']);
        $promotion->update($validated);

        return redirect()->route('promotions.index')
            ->with('success', 'تم تحديث الترقية بنجاح');
    }

    /**
     * Confirm the promotion and update martyr's rank/grade.
     */
    public function confirm(Promotion $promotion): RedirectResponse
    {
        $martyr = $promotion->martyr;

        if (! $martyr) {
            return redirect()->route('promotions.index')
                ->with('error', 'الشهيد غير موجود');
        }

        // Update martyr's current rank/grade
        if ($promotion->promotion_rank) {
            $martyr->military_rank_id = $promotion->promotion_rank;
        }
        if ($promotion->promotion_job_grade_id) {
            $martyr->job_grade_id = $promotion->promotion_job_grade_id;
        }
        $martyr->save();

        // Update promotion's obtained date to today
        $today = now();
        $promotion->current_rank_date = $today;
        $promotion->next_due_date = $today->copy()->addYears($promotion->promotion_years);
        $promotion->status = 'completed';
        $promotion->save();

        return redirect()->route('promotions.index')
            ->with('success', 'تم تأكيد الترقية وتحديث بيانات الشهيد بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promotion $promotion): RedirectResponse
    {
        $promotion->delete();

        return redirect()->route('promotions.index')
            ->with('success', 'تم حذف الترقية بنجاح');
    }

    public function export(Request $request)
    {
        if (! auth()->user()->can('promotions.export')) {
            abort(403, 'Unauthorized');
        }
        $filters = $request->only(['tab', 'search', 'martyr_id']);

        // If client requested a synchronous download (e.g. ?sync=1), return the file directly.
        if ($request->boolean('sync')) {
            $fileName = 'promotions_' . now()->format('Y-m-d_H-i-s') . '.xlsx';

            return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\PromotionsExport($filters), $fileName);
        }

        \App\Jobs\ExportPromotions::dispatch(auth()->user(), $filters);

        return back()->with('success', 'سيتم إرسال إشعار عند جاهزية التقرير.');
    }

    /**
     * Redirect to the latest export file if exists.
     */
    public function latestExport()
    {
        $dir = storage_path('app/public/exports');

        if (! is_dir($dir)) {
            abort(404, 'No exports directory');
        }

        $files = array_values(array_filter(scandir($dir), function ($f) use ($dir) {
            return is_file($dir . DIRECTORY_SEPARATOR . $f) && str_starts_with($f, 'promotions_');
        }));

        if (empty($files)) {
            abort(404, 'No export files');
        }

        usort($files, function ($a, $b) use ($dir) {
            return filemtime($dir . DIRECTORY_SEPARATOR . $b) <=> filemtime($dir . DIRECTORY_SEPARATOR . $a);
        });

        $latest = $files[0];

        $publicUrl = url('storage/exports/' . $latest);

        return redirect($publicUrl);
    }
}
