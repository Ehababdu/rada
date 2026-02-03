<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Bank $bank): Response
    {
        $search = $request->get('search');

        if ($search) {
            $branches = $bank->branches()->search($search)->paginate(15);
        } else {
            $branches = $bank->branches()
                ->orderBy('name_ar')
                ->paginate(15);
        }

        $branches->through(function ($branch) {
            return [
                'id' => $branch->id,
                'name_ar' => $branch->name_ar,
                'created_at' => $branch->created_at->format('d/m/Y'),
                'updated_at' => $branch->updated_at->format('d/m/Y'),
            ];
        });

        return Inertia::render('Banks/Branches/Index', [
            'bank' => [
                'id' => $bank->id,
                'name_ar' => $bank->name_ar,
            ],
            'branches' => $branches,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Bank $bank): Response
    {
        return Inertia::render('Banks/Branches/Create', [
            'bank' => [
                'id' => $bank->id,
                'name_ar' => $bank->name_ar,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Bank $bank): RedirectResponse
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
        ]);

        $bank->branches()->create([
            'name_ar' => $request->name_ar,
        ]);

        return redirect()->route('banks.branches.index', $bank)
            ->with('success', __('Branch created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Bank $bank, Branch $branch): Response
    {
        return Inertia::render('Banks/Branches/Show', [
            'bank' => [
                'id' => $bank->id,
                'name_ar' => $bank->name_ar,
            ],
            'branch' => [
                'id' => $branch->id,
                'name_ar' => $branch->name_ar,
                'created_at' => $branch->created_at->format('d/m/Y H:i'),
                'updated_at' => $branch->updated_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $bank, Branch $branch): Response
    {
        return Inertia::render('Banks/Branches/Edit', [
            'bank' => [
                'id' => $bank->id,
                'name_ar' => $bank->name_ar,
            ],
            'branch' => [
                'id' => $branch->id,
                'name_ar' => $branch->name_ar,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bank $bank, Branch $branch): RedirectResponse
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
        ]);

        $branch->update([
            'name_ar' => $request->name_ar,
        ]);

        return redirect()->route('banks.branches.index', $bank)
            ->with('success', __('Branch updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank, Branch $branch): RedirectResponse
    {
        $branch->delete();

        return redirect()->route('banks.branches.index', $bank)
            ->with('success', __('Branch deleted successfully.'));
    }

    /**
     * API endpoint for branches listing by bank.
     */
    public function apiIndex(Request $request, Bank $bank)
    {
        $search = $request->get('search');

        $branches = $bank->branches()
            ->when($search, function ($query) use ($search) {
                $query->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%");
            })
            ->where('is_active', true)
            ->orderBy('name_ar')
            ->get(['id', 'name_ar', 'name_en']);

        return response()->json($branches);
    }
}
