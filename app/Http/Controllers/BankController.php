<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBankRequest;
use App\Http\Requests\UpdateBankRequest;
use App\Models\Bank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $search = $request->get('search');

        if ($search) {
            // Use Scout for search
            $banks = Bank::search($search)->paginate(15);
        } else {
            // Use regular query for listing
            $banks = Bank::when($request->is_active !== null, function ($query) use ($request) {
                $query->where('is_active', $request->boolean('is_active'));
            })
                ->orderBy('name_ar')
                ->paginate(15);
        }

        $banks->through(function ($bank) {
            return [
                'id' => $bank->id,
                'name_ar' => $bank->name_ar,
                'created_at' => $bank->created_at->format('d/m/Y'),
                'updated_at' => $bank->updated_at->format('d/m/Y'),
            ];
        });

        return Inertia::render('Banks/Index', [
            'banks' => $banks,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Banks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBankRequest $request): RedirectResponse
    {
        Bank::create([
            'name_ar' => $request->name_ar,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('banks.index')
            ->with('success', __('Bank created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Bank $bank): \Inertia\Response
    {
        return Inertia::render('Banks/Show', [
            'bank' => [
                'id' => $bank->id,
                'name_ar' => $bank->name_ar,
                'created_at' => $bank->created_at->format('d/m/Y H:i'),
                'updated_at' => $bank->updated_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $bank): \Inertia\Response
    {
        return Inertia::render('Banks/Edit', [
            'bank' => [
                'id' => $bank->id,
                'name_ar' => $bank->name_ar,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBankRequest $request, Bank $bank): RedirectResponse
    {
        $validated = $request->validated();

        $bank->update($validated);

        return redirect()->route('banks.index')
            ->with('success', __('Bank updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank): RedirectResponse
    {
        $bank->delete();

        return redirect()->route('banks.index')
            ->with('success', __('Bank deleted successfully.'));
    }

    /**
     * API endpoint for banks listing.
     */
    public function apiIndex(Request $request)
    {
        $search = $request->get('search');

        $banks = Bank::when($search, function ($query) use ($search) {
            $query->where('name_ar', 'like', "%{$search}%")
                ->orWhere('name_en', 'like', "%{$search}%");
        })
            ->where('is_active', true)
            ->orderBy('name_ar')
            ->get(['id', 'name_ar', 'name_en']);

        return response()->json($banks);
    }
}
