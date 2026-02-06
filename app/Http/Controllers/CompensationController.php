<?php

namespace App\Http\Controllers;

use App\Models\Compensation;
use App\Models\Martyr;
use App\Models\Alert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompensationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        if (! auth()->user()->can('compensations.view')) {
            abort(403, 'Unauthorized');
        }
        $search = $request->get('search');

        if ($search) {
            // Use Scout for search
            $compensations = Compensation::search($search)
                ->query(fn ($query) => $query->with(['martyr.parentsStatus', 'martyr.employmentStatus', 'martyr.maritalStatus']))
                ->paginate(15);
        } else {
            // Use regular query for listing
            $compensations = Compensation::with(['martyr.parentsStatus', 'martyr.employmentStatus', 'martyr.maritalStatus'])
                ->when($request->martyr_id, function ($query) use ($request) {
                    $query->where('martyr_id', $request->martyr_id);
                })
                ->when($request->parents_status_id, function ($query) use ($request) {
                    $query->whereHas('martyr', function ($q) use ($request) {
                        $q->where('parents_status_id', $request->parents_status_id);
                    });
                })
                ->when($request->employment_status_id, function ($query) use ($request) {
                    $query->whereHas('martyr', function ($q) use ($request) {
                        $q->where('employment_status_id', $request->employment_status_id);
                    });
                })
                ->orderBy('receipt_date', 'desc')
                ->paginate(15);
        }

        $compensations->through(function ($compensation) {
            return [
                'id' => $compensation->id,
                'martyr_id' => $compensation->martyr_id,
                'martyr_name' => $compensation->martyr->full_name,
                'martyr_national_id' => $compensation->martyr->national_id,
                'parents_status' => $compensation->martyr->parentsStatus?->name_ar,
                'employment_status' => $compensation->martyr->employmentStatus?->name_ar,
                'marital_status' => $compensation->martyr->maritalStatus?->name_ar,
                'military_rank' => $compensation->martyr->militaryRank?->name_ar,
                'recipient_name' => $compensation->recipient_name,
                'recipient_passport_number' => $compensation->recipient_passport_number,
                'amount' => $compensation->amount,
                'receipt_date' => $compensation->receipt_date->format('Y-m-d'),
                'receipt_date_formatted' => $compensation->receipt_date->format('d/m/Y'),
                'months' => $compensation->months,
                'created_at' => $compensation->created_at->format('d/m/Y'),
            ];
        });

        // Get all martyrs for filter dropdown
        $martyrs = Martyr::select('id', 'full_name', 'national_id', 'military_rank_id')
            ->with('militaryRank:id,name_ar,name_en')
            ->orderBy('full_name')
            ->get()
            /** @phpstan-ignore-next-line */
            ->map(function (Martyr $martyr) {
                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                    'military_rank' => $martyr->militaryRank?->name_ar,
                ];
            });

        // Get parents statuses for filter
        $parentsStatuses = \App\Models\ParentsStatus::select('id', 'name_ar', 'name_en')->get();

        // Get employment statuses for filter
        $employmentStatuses = \App\Models\EmploymentStatus::select('id', 'name')->get();

        return Inertia::render('Compensations/Index', [
            'compensations' => $compensations,
            'martyrs' => $martyrs,
            'parentsStatuses' => $parentsStatuses,
            'employmentStatuses' => $employmentStatuses,
            'filters' => $request->only(['search', 'martyr_id', 'parents_status_id', 'employment_status_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $martyrs = Martyr::select('id', 'full_name', 'national_id', 'military_rank_id', 'parents_status_id', 'marital_status_id', 'children_count', 'wife_status')
            ->with('militaryRank:id,name_ar,name_en')
            ->orderBy('full_name')
            ->get()
            /** @phpstan-ignore-next-line */
            ->map(function (Martyr $martyr) {
                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                    'military_rank' => $martyr->militaryRank?->name_ar,
                    'parents_status_id' => $martyr->parents_status_id,
                    'marital_status_id' => $martyr->marital_status_id,
                    'children_count' => $martyr->children_count,
                    'wife_status' => $martyr->wife_status,
                ];
            });

        $selectedMartyr = null;
        if ($request->martyr_id) {
            $selectedMartyr = Martyr::find($request->martyr_id);
        }

        return Inertia::render('Compensations/Create', [
            'martyrs' => $martyrs,
            'selectedMartyr' => $selectedMartyr,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'martyr_id' => 'required|exists:martyrs,id',
            'recipient_name' => 'required|string|max:255',
            'recipient_passport_number' => 'required|string|max:255',
            'amount' => 'nullable|numeric|min:0',
            'receipt_date' => 'required|date',
            'months' => 'required|array|min:1',
            'months.*' => 'integer|between:1,12',
        ]);

        // Load martyr with relationships
        $martyr = Martyr::with(['parentsStatus', 'maritalStatus'])->findOrFail($validated['martyr_id']);

        // Calculate amount if not provided
        /** @phpstan-ignore-next-line */
        if (! isset($validated['amount']) || $validated['amount'] === null) {
            $baseAmount = $martyr->calculateCompensationAmount();
            $monthsCount = isset($validated['months']) ? count($validated['months']) : 1;
            $validated['amount'] = $baseAmount * $monthsCount;
        }

        $compensation = Compensation::create($validated);

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "تمت إضافة مكافأة جديدة",
                'message' => "تمت إضافة مكافأة مالية للشهيد {$martyr->full_name}",
                'type' => 'success',
                'user_id' => auth()->id(),
                'data' => [
                    'compensation_id' => $compensation->id,
                    'martyr_id' => $martyr->id,
                    'action' => 'create'
                ]
            ]);
        }

        return redirect()->route('compensations.index')
            ->with('success', 'تم إضافة المكافاة بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(Compensation $compensation): Response
    {
        $compensation->load('martyr');

        return Inertia::render('Compensations/Show', [
            'compensation' => [
                'id' => $compensation->id,
                'martyr_id' => $compensation->martyr_id,
                'martyr_name' => $compensation->martyr->full_name,
                'martyr_national_id' => $compensation->martyr->national_id,
                'recipient_name' => $compensation->recipient_name,
                'recipient_passport_number' => $compensation->recipient_passport_number,
                'amount' => $compensation->amount,
                'receipt_date' => $compensation->receipt_date->format('Y-m-d'),
                'receipt_date_formatted' => $compensation->receipt_date->format('d/m/Y'),
                'created_at' => $compensation->created_at->format('d/m/Y'),
                'updated_at' => $compensation->updated_at->format('d/m/Y'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Compensation $compensation): Response
    {
        $compensation->load('martyr');

        $martyrs = Martyr::select('id', 'full_name', 'national_id', 'military_rank_id', 'parents_status_id', 'marital_status_id', 'children_count', 'wife_status')
            ->with('militaryRank:id,name_ar,name_en')
            ->orderBy('full_name')
            ->get()
            /** @phpstan-ignore-next-line */
            ->map(function (Martyr $martyr) {
                return [
                    'id' => $martyr->id,
                    'full_name' => $martyr->full_name,
                    'national_id' => $martyr->national_id,
                    'military_rank' => $martyr->militaryRank?->name_ar,
                    'parents_status_id' => $martyr->parents_status_id,
                    'marital_status_id' => $martyr->marital_status_id,
                    'children_count' => $martyr->children_count,
                    'wife_status' => $martyr->wife_status,
                ];
            });

        return Inertia::render('Compensations/Edit', [
            'compensation' => [
                'id' => $compensation->id,
                'martyr_id' => $compensation->martyr_id,
                'martyr_name' => $compensation->martyr->full_name,
                'martyr_national_id' => $compensation->martyr->national_id,
                'recipient_name' => $compensation->recipient_name,
                'recipient_passport_number' => $compensation->recipient_passport_number,
                'amount' => $compensation->amount,
                'receipt_date' => $compensation->receipt_date->format('Y-m-d'),
                'months' => $compensation->months,
                'martyr' => $compensation->martyr,
            ],
            'martyrs' => $martyrs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Compensation $compensation): RedirectResponse
    {
        $validated = $request->validate([
            'martyr_id' => 'required|exists:martyrs,id',
            'recipient_name' => 'required|string|max:255',
            'recipient_passport_number' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'receipt_date' => 'required|date',
        ]);

        $compensation->update($validated);

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "تحديث بيانات المكافأة",
                'message' => "تم تحديث بيانات المكافأة للشهيد {$compensation->martyr->full_name}",
                'type' => 'success',
                'user_id' => auth()->id(),
                'data' => [
                    'compensation_id' => $compensation->id,
                    'martyr_id' => $compensation->martyr_id,
                    'action' => 'update'
                ]
            ]);
        }

        return redirect()->route('compensations.index')
            ->with('success', 'تم تحديث المكافاة بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Compensation $compensation): RedirectResponse
    {
        $martyrId = $compensation->martyr_id;
        $compensation->delete();

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "حذف مكافأة",
                'message' => "تم حذف مكافأة للشهيد {$compensation->martyr->full_name}",
                'type' => 'warning',
                'user_id' => auth()->id(),
                'data' => [
                    'martyr_id' => $martyrId,
                    'action' => 'delete'
                ]
            ]);
        }

        return redirect()->route('compensations.index')
            ->with('success', 'تم حذف المكافاة بنجاح');
    }
}
