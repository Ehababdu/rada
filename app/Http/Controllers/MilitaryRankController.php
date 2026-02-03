<?php

namespace App\Http\Controllers;

use App\Models\MilitaryRank;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MilitaryRankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MilitaryRank::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $militaryRanks = $query->ordered()
            ->paginate(15)
            ->appends($request->query());

        return Inertia::render('MilitaryRanks/Index', [
            'militaryRanks' => $militaryRanks,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MilitaryRanks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        MilitaryRank::create($validated);

        return redirect()->route('military-ranks.index')
            ->with('success', 'تم إنشاء الرتبة العسكرية بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(MilitaryRank $militaryRank)
    {
        return Inertia::render('MilitaryRanks/Show', [
            'militaryRank' => $militaryRank,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MilitaryRank $militaryRank)
    {
        return Inertia::render('MilitaryRanks/Edit', [
            'militaryRank' => $militaryRank,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MilitaryRank $militaryRank): RedirectResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $militaryRank->update($validated);

        return redirect()->route('military-ranks.index')
            ->with('success', 'تم تحديث الرتبة العسكرية بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MilitaryRank $militaryRank): RedirectResponse
    {
        // Check if rank is being used
        if ($militaryRank->martyrs()->exists()) {
            return redirect()->route('military-ranks.index')
                ->with('error', 'لا يمكن حذف هذه الرتبة لأنها مرتبطة بشهداء');
        }

        $militaryRank->delete();

        return redirect()->route('military-ranks.index')
            ->with('success', 'تم حذف الرتبة العسكرية بنجاح');
    }

    /**
     * API endpoint for getting active military ranks.
     */
    public function apiIndex(Request $request): JsonResponse
    {
        $ranks = MilitaryRank::active()
            ->ordered()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('name_ar', 'like', "%{$request->search}%");
            })
            ->get(['id', 'name_ar', 'name_en']);

        return response()->json($ranks);
    }
}
