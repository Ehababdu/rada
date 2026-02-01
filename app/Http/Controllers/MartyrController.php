<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMartyrRequest;
use App\Http\Requests\UpdateMartyrRequest;
use App\Models\Martyr;
use App\Services\MartyrService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MartyrController extends Controller
{
    protected MartyrService $martyrService;

    public function __construct(MartyrService $martyrService)
    {
        $this->martyrService = $martyrService;
    }

    public function index(Request $request)
    {
        if (!auth()->user()->can('martyrs.view')) {
            abort(403, 'Unauthorized');
        }

        $martyrs = $this->martyrService->getMartyrs($request);

        return Inertia::render('Martyrs/Index', [
            'martyrs' => $martyrs,
            'filters' => $request->only(['search', 'marital_status_id', 'employment_status_id', 'bank_id', 'branch_id', 'death_date_from', 'death_date_to', 'has_martyr_decision', 'parents_status_id', 'sort', 'date_from', 'date_to', 'employer_id', 'previous_employer_id', 'decision_date_from', 'decision_date_to', 'status', 'wife_status', 'per_page']),
            'maritalStatuses' => \Illuminate\Support\Facades\Cache::remember('martyrs.marital_statuses', 60 * 60, fn () => \App\Models\MaritalStatus::select('id', 'name_ar', 'name_en')->get()),
            'employmentStatuses' => \Illuminate\Support\Facades\Cache::remember('martyrs.employment_statuses', 60 * 60, fn () => \App\Models\EmploymentStatus::select('id', 'name as name_ar', \DB::raw('NULL as name_en'))->get()),
            'banks' => \Illuminate\Support\Facades\Cache::remember('martyrs.banks', 60 * 60, fn () => \App\Models\Bank::select('id', 'name_ar', \DB::raw('NULL as name_en'))->get()),
            'parentsStatuses' => \Illuminate\Support\Facades\Cache::remember('martyrs.parents_statuses', 60 * 60, fn () => \App\Models\ParentsStatus::select('id', 'name_ar', 'name_en')->get()),
            'militaryRanks' => \Illuminate\Support\Facades\Cache::remember('martyrs.military_ranks', 60 * 60, fn () => \App\Models\MilitaryRank::select('id', 'name_ar', 'name_en')->get()),
            'branches' => \Illuminate\Support\Facades\Cache::remember('martyrs.branches', 60 * 60, fn () => \App\Models\Branch::select('id', 'name_ar', 'bank_id', \DB::raw('NULL as name_en'))->get()),
            'employers' => \Illuminate\Support\Facades\Cache::remember('martyrs.employers', 60 * 60, fn () => \App\Models\Employer::select('id', 'name_ar', 'name_en')->where('is_active', true)->get()),
            'previousEmployers' => \Illuminate\Support\Facades\Cache::remember('martyrs.previous_employers', 60 * 60, fn () => \App\Models\Employer::select('id', 'name_ar', 'name_en')->where('is_active', true)->get()),
        ]);
    }

    public function create()
    {
        if (!auth()->user()->can('martyrs.create')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Martyrs/Create', [
            'employmentStatuses' => \App\Models\EmploymentStatus::select('id', 'name as name_ar', \DB::raw('NULL as name_en'))->get(),
            'militaryRanks' => \App\Models\MilitaryRank::select('id', 'name_ar', 'name_en')->get(),
            'banks' => \App\Models\Bank::select('id', 'name_ar', \DB::raw('NULL as name_en'))->get(),
            'parentsStatuses' => \App\Models\ParentsStatus::select('id', 'name_ar', 'name_en')->get(),
            'maritalStatuses' => \App\Models\MaritalStatus::select('id', 'name_ar', 'name_en')->get(),
            'jobGrades' => \App\Models\JobGrade::select('id', 'name_ar', 'name_en')->where('is_active', true)->orderBy('order')->get(),
            'employers' => \App\Models\Employer::select('id', 'name_ar', 'name_en')->where('is_active', true)->get(),
            'employerLocations' => \App\Models\EmployerLocation::select('id', 'name_ar', 'name_en')->where('is_active', true)->get(),
        ]);
    }

    public function store(StoreMartyrRequest $request)
    {
        if (!auth()->user()->can('martyrs.create')) {
            abort(403, 'Unauthorized');
        }
        $data = $request->validated();

        $this->martyrService->createMartyr($data, $request);

        session()->flash('success', 'تم إضافة الشهيد بنجاح');

        return redirect()->route('martyrs.index');
    }

    public function show(Martyr $martyr)
    {
        if (!auth()->user()->can('martyrs.view')) {
            abort(403, 'Unauthorized');
        }

        $martyr->load(['militaryRank', 'bank', 'branch', 'employmentStatus', 'parentsStatus', 'maritalStatus', 'employer', 'employerLocation', 'previousEmployer', 'previousEmployerLocation']);

        return Inertia::render('Martyrs/Show', [
            'martyr' => $martyr,
        ]);
    }

    public function edit(Martyr $martyr)
    {
        if (!auth()->user()->can('martyrs.edit')) {
            abort(403, 'Unauthorized');
        }
        $martyr->load(['militaryRank', 'bank', 'branch', 'employmentStatus', 'parentsStatus', 'maritalStatus', 'jobGrade', 'employer', 'employerLocation', 'previousEmployer', 'previousEmployerLocation']);

        return Inertia::render('Martyrs/Edit', [
            'martyr' => $martyr,
            'employmentStatuses' => \App\Models\EmploymentStatus::select('id', 'name as name_ar', \DB::raw('NULL as name_en'))->get(),
            'militaryRanks' => \App\Models\MilitaryRank::select('id', 'name_ar', 'name_en')->get(),
            'banks' => \App\Models\Bank::select('id', 'name_ar', \DB::raw('NULL as name_en'))->get(),
            'parentsStatuses' => \App\Models\ParentsStatus::select('id', 'name_ar', 'name_en')->get(),
            'maritalStatuses' => \App\Models\MaritalStatus::select('id', 'name_ar', 'name_en')->get(),
            'jobGrades' => \App\Models\JobGrade::where('is_active', true)->select('id', 'name_ar', 'name_en')->orderBy('order')->get(),
            'employers' => \App\Models\Employer::select('id', 'name_ar', 'name_en')->where('is_active', true)->get(),
            'employerLocations' => \App\Models\EmployerLocation::select('id', 'name_ar', 'name_en')->where('is_active', true)->get(),
        ]);
    }

    public function update(UpdateMartyrRequest $request, Martyr $martyr)
    {
        if (!auth()->user()->can('martyrs.edit')) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validated();

        \Log::debug('Martyr update data', ['martyr_id' => $martyr->id, 'data' => $data]);
        $this->martyrService->updateMartyr($martyr, $data, $request);

        session()->flash('success', 'تم تحديث بيانات الشهيد بنجاح');

        return redirect('/martyrs');
    }

    public function updateStatus(Request $request, Martyr $martyr)
    {
        $request->validate([
            'status' => 'required|in:draft,pending,approved,rejected',
        ]);

        $martyr->update(['status' => $request->status]);

        return response()->json(['message' => 'تم تحديث حالة الشهيد بنجاح']);
    }

    public function destroy(Martyr $martyr)
    {
        if (!auth()->user()->can('martyrs.delete')) {
            abort(403, 'Unauthorized');
        }

        $this->martyrService->deleteMartyr($martyr);

        session()->flash('success', 'تم حذف الشهيد بنجاح');

        return redirect('/martyrs');
    }

    public function export(Request $request)
    {
        if (!auth()->user()->can('martyrs.export')) {
            abort(403, 'Unauthorized');
        }
        $filters = $request->only(['search', 'marital_status_id', 'employment_status_id', 'bank_id', 'branch_id', 'death_date_from', 'death_date_to', 'has_martyr_decision', 'parents_status_id']);
        $columns = $request->input('columns', []);
        $ids = $request->input('ids', []);
        // allow comma-separated string for sync downloads
        if (is_string($columns)) {
            $columns = array_filter(array_map('trim', explode(',', $columns)));
        }
        if (is_string($ids)) {
            $ids = array_filter(array_map('trim', explode(',', $ids)));
        }

        // If client requested a synchronous download (e.g. ?sync=1), return the file directly.
        if ($request->boolean('sync')) {
            $fileName = 'martyrs_'.now()->format('Y-m-d_H-i-s').'.xlsx';
            return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\MartyrsExport($filters, $columns, $ids), $fileName);
        }

        \App\Jobs\ExportMartyrs::dispatch(auth()->user(), $filters, $columns, $ids);

        return back()->with('success', 'سيتم إرسال إشعار عند جاهزية التقرير.');
    }

    /**
     * Redirect to the latest export file if exists.
     */
    public function latestExport()
    {
        $dir = storage_path('app/public/exports');

        if (!is_dir($dir)) {
            abort(404, 'No exports directory');
        }

        $files = array_values(array_filter(scandir($dir), function ($f) use ($dir) {
            return is_file($dir.DIRECTORY_SEPARATOR.$f);
        }));

        if (empty($files)) {
            abort(404, 'No export files');
        }

        usort($files, function ($a, $b) use ($dir) {
            return filemtime($dir.DIRECTORY_SEPARATOR.$b) <=> filemtime($dir.DIRECTORY_SEPARATOR.$a);
        });

        $latest = $files[0];

        $publicUrl = url('storage/exports/'.$latest);

        return redirect($publicUrl);
    }

    /**
     * Return JSON status whether a latest export file exists and its public URL.
     */
    public function exportStatus()
    {
        $dir = storage_path('app/public/exports');

        if (!is_dir($dir)) {
            return response()->json(['exists' => false]);
        }

        $files = array_values(array_filter(scandir($dir), function ($f) use ($dir) {
            return is_file($dir.DIRECTORY_SEPARATOR.$f);
        }));

        if (empty($files)) {
            return response()->json(['exists' => false]);
        }

        usort($files, function ($a, $b) use ($dir) {
            return filemtime($dir.DIRECTORY_SEPARATOR.$b) <=> filemtime($dir.DIRECTORY_SEPARATOR.$a);
        });

        $latest = $files[0];
        $publicUrl = url('storage/exports/'.$latest);

        return response()->json(['exists' => true, 'file' => $latest, 'url' => $publicUrl]);
    }

    public function search(Request $request)
    {
        $query = (string) $request->get('q', '');

        if ($query === '') {
            return response()->json([]);
        }

        try {
            $results = $this->martyrService->searchMartyrs($query, 10);

            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error('Martyr search failed: '.$e->getMessage());

            return response()->json([], 500);
        }
    }

    /**
     * API endpoint to return martyrs as JSON filtered by employment status.
     */
    public function apiIndex(Request $request)
    {
        $employmentStatus = $request->query('employment_status');

        $query = Martyr::query()->select('id', 'full_name', 'national_id', 'job_grade_id', 'military_rank_id', 'employment_status_id');

        if ($employmentStatus !== null && $employmentStatus !== '') {
            $query->where('employment_status_id', $employmentStatus);
        }

        $martyrs = $query->with('militaryRank:id,name_ar', 'jobGrade:id,name_ar')->limit(500)->get()->map(function (Martyr $m) {
            return [
                'id' => $m->id,
                'full_name' => $m->full_name,
                'national_id' => $m->national_id,
                'job_grade_id' => $m->job_grade_id,
                'jobGrade' => $m->jobGrade ? [
                    'id' => $m->jobGrade->id,
                    'name_ar' => $m->jobGrade->name_ar,
                ] : null,
                'military_rank' => $m->militaryRank?->name_ar,
                'military_rank_id' => $m->military_rank_id,
                'employment_status_id' => $m->employment_status_id,
            ];
        });

        return response()->json($martyrs);
    }
}
