<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployerRequest;
use App\Http\Requests\UpdateEmployerRequest;
use App\Models\Employer;
use App\Models\EmployerLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $search = $request->get('search');

        if ($search) {
            // Use Scout for search
            $employers = Employer::search($search)->paginate(15);
        } else {
            // Use regular query for listing
            $employers = Employer::when($request->is_active !== null, function ($query) use ($request) {
                $query->where('is_active', $request->boolean('is_active'));
            })
                ->orderBy('name_ar')
                ->paginate(15);
        }

        $employers->through(function ($employer) {
            return [
                'id' => $employer->id,
                'name_ar' => $employer->name_ar,
                'name_en' => $employer->name_en,
                'location' => $employer->location ? [
                    'id' => $employer->location->id,
                    'name_ar' => $employer->location->name_ar,
                    'name_en' => $employer->location->name_en,
                ] : null,
                'is_active' => $employer->is_active,
                'created_at' => $employer->created_at->format('d/m/Y'),
                'updated_at' => $employer->updated_at->format('d/m/Y'),
            ];
        });

        return Inertia::render('Employers/Index', [
            'employers' => $employers,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        $locations = EmployerLocation::active()->orderBy('name_ar')->get(['id', 'name_ar', 'name_en']);

        return Inertia::render('Employers/Create', [
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployerRequest $request): RedirectResponse
    {
        Employer::create([
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
            'employer_location_id' => $request->employer_location_id,
            'is_active' => $request->is_active ?? true,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('employers.index')
            ->with('success', __('Employer created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Employer $employer): \Inertia\Response
    {
        return Inertia::render('Employers/Show', [
            'employer' => [
                'id' => $employer->id,
                'name_ar' => $employer->name_ar,
                'name_en' => $employer->name_en,
                'location' => $employer->location ? [
                    'id' => $employer->location->id,
                    'name_ar' => $employer->location->name_ar,
                    'name_en' => $employer->location->name_en,
                ] : null,
                'is_active' => $employer->is_active,
                'created_at' => $employer->created_at->format('d/m/Y H:i'),
                'updated_at' => $employer->updated_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employer $employer): \Inertia\Response
    {
        $locations = EmployerLocation::active()->orderBy('name_ar')->get(['id', 'name_ar', 'name_en']);

        return Inertia::render('Employers/Edit', [
            'employer' => [
                'id' => $employer->id,
                'name_ar' => $employer->name_ar,
                'name_en' => $employer->name_en,
                'employer_location_id' => $employer->employer_location_id,
                'is_active' => $employer->is_active,
            ],
            'locations' => $locations,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployerRequest $request, Employer $employer): RedirectResponse
    {
        $validated = $request->validated();

        $employer->update($validated);

        return redirect()->route('employers.index')
            ->with('success', __('Employer updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employer $employer): RedirectResponse
    {
        $employer->delete();

        return redirect()->route('employers.index')
            ->with('success', __('Employer deleted successfully.'));
    }

    /**
     * API endpoint for employers listing.
     */
    public function apiIndex(Request $request)
    {
        $search = $request->get('search');

        /** @phpstan-ignore-next-line */
        $employers = Employer::with('location')
            ->when($search, function ($query) use ($search) {
                $query->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%");
            })
            ->where('is_active', true)
            ->orderBy('name_ar')
            ->get(['id', 'name_ar', 'name_en', 'employer_location_id']);

        return response()->json($employers);
    }
}
