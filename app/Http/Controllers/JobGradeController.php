<?php

namespace App\Http\Controllers;

use App\Models\JobGrade;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class JobGradeController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('can:manage job grades'),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = JobGrade::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Sorting
        $sortField = $request->get('sort', 'order');
        $sortDirection = $request->get('direction', 'asc');

        if ($sortField === 'name') {
            $query->orderBy('name_ar', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $jobGrades = $query->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('JobGrades/Index', [
            'jobGrades' => $jobGrades,
            'filters' => $request->only(['search', 'is_active', 'sort', 'direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('JobGrades/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        // Auto-assign order if not provided
        if (! isset($validated['order']) || $validated['order'] === null) {
            $validated['order'] = JobGrade::max('order') + 1;
        }

        JobGrade::create($validated);

        return redirect()->route('job-grades.index')
            ->with('message', 'تم إنشاء الدرجة الوظيفية بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(JobGrade $jobGrade): Response
    {
        return Inertia::render('JobGrades/Show', [
            'jobGrade' => $jobGrade,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobGrade $jobGrade): Response
    {
        return Inertia::render('JobGrades/Edit', [
            'jobGrade' => $jobGrade,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobGrade $jobGrade): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        // Auto-assign order if not provided
        if (! isset($validated['order']) || $validated['order'] === null) {
            $validated['order'] = JobGrade::where('id', '!=', $jobGrade->id)->max('order') + 1;
        }

        $jobGrade->update($validated);

        return redirect()->route('job-grades.index')
            ->with('message', 'تم تحديث الدرجة الوظيفية بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobGrade $jobGrade): RedirectResponse
    {
        $jobGrade->delete();

        return redirect()->route('job-grades.index')
            ->with('message', 'تم حذف الدرجة الوظيفية بنجاح');
    }

    /**
     * API endpoint for job grades.
     */
    public function apiIndex(Request $request)
    {
        $query = JobGrade::where('is_active', true);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%");
            });
        }

        $query->orderBy('order');

        return $query->get(['id', 'name_ar', 'name_en', 'order']);
    }
}
