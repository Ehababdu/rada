<?php

namespace App\Http\Controllers;

use App\Models\EmploymentStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmploymentStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = EmploymentStatus::query();

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $employmentStatuses = $query
            ->orderBy('name')
            ->paginate(15);

        $employmentStatuses->through(function ($employmentStatus) {
            return [
                'id' => $employmentStatus->id,
                'name' => $employmentStatus->name,
                'created_at' => $employmentStatus->created_at->format('d/m/Y'),
            ];
        });

        return Inertia::render('EmploymentStatuses/Index', [
            'employmentStatuses' => $employmentStatuses,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('EmploymentStatuses/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:employment_statuses',
        ]);

        EmploymentStatus::create($validated);

        return redirect()->route('employment-statuses.index')
            ->with('success', 'تم إنشاء حالة التوظيف بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show($employmentStatusId): Response
    {
        $employmentStatus = EmploymentStatus::findOrFail($employmentStatusId);

        return Inertia::render('EmploymentStatuses/Show', [
            'employmentStatus' => [
                'id' => $employmentStatus->id,
                'name' => $employmentStatus->name,
                'created_at' => $employmentStatus->created_at->format('d/m/Y'),
                'updated_at' => $employmentStatus->updated_at->format('d/m/Y'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($employmentStatusId): Response
    {
        $employmentStatus = EmploymentStatus::findOrFail($employmentStatusId);

        return Inertia::render('EmploymentStatuses/Edit', [
            'employmentStatus' => $employmentStatus,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $employmentStatusId): RedirectResponse
    {
        $employmentStatus = EmploymentStatus::findOrFail($employmentStatusId);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:employment_statuses,name,' . $employmentStatus->id . ',id',
        ]);

        $employmentStatus->update($validated);

        return redirect()->route('employment-statuses.index')
            ->with('success', 'تم تحديث حالة التوظيف بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($employmentStatusId): RedirectResponse
    {
        $employmentStatus = EmploymentStatus::findOrFail($employmentStatusId);
        $employmentStatus->delete();

        return redirect()->route('employment-statuses.index')
            ->with('success', 'تم حذف حالة التوظيف بنجاح');
    }

    /**
     * API endpoint for getting employment statuses.
     */
    public function apiIndex(Request $request): JsonResponse
    {
        $statuses = EmploymentStatus::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->search}%");
            })
            ->orderBy('name')
            ->get(['id', 'name']);

        $statuses->transform(function ($status) {
            return [
                'id' => $status->id,
                'name_ar' => $status->name,
                'name_en' => null,
            ];
        });

        return response()->json($statuses);
    }
}
