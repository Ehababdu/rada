<?php

namespace App\Http\Controllers;

use App\Models\Employer;
use App\Models\EmployerLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployerLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Employer $employer): Response
    {
        $search = $request->get('search');

        if ($search) {
            $locations = $employer->locations()->search($search)->paginate(15);
        } else {
            $locations = $employer->locations()
                ->orderBy('name_ar')
                ->paginate(15);
        }

        $locations->through(function ($location) {
            return [
                'id' => $location->id,
                'name_ar' => $location->name_ar,
                'name_en' => $location->name_en,
                'is_active' => $location->is_active,
                'created_at' => $location->created_at->format('d/m/Y'),
                'updated_at' => $location->updated_at->format('d/m/Y'),
            ];
        });

        return Inertia::render('Employers/Locations/Index', [
            'employer' => [
                'id' => $employer->id,
                'name_ar' => $employer->name_ar,
                'name_en' => $employer->name_en,
            ],
            'locations' => $locations,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Employer $employer): Response
    {
        return Inertia::render('Employers/Locations/Create', [
            'employer' => [
                'id' => $employer->id,
                'name_ar' => $employer->name_ar,
                'name_en' => $employer->name_en,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Employer $employer): RedirectResponse
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $employer->locations()->create([
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('employers.locations.index', $employer)
            ->with('success', __('Location created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Employer $employer, EmployerLocation $employer_location): Response
    {
        return Inertia::render('Employers/Locations/Show', [
            'employer' => [
                'id' => $employer->id,
                'name_ar' => $employer->name_ar,
                'name_en' => $employer->name_en,
            ],
            'location' => [
                'id' => $employer_location->id,
                'name_ar' => $employer_location->name_ar,
                'name_en' => $employer_location->name_en,
                'is_active' => $employer_location->is_active,
                'created_at' => $employer_location->created_at->format('d/m/Y H:i'),
                'updated_at' => $employer_location->updated_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employer $employer, EmployerLocation $employer_location): Response
    {
        return Inertia::render('Employers/Locations/Edit', [
            'employer' => [
                'id' => $employer->id,
                'name_ar' => $employer->name_ar,
                'name_en' => $employer->name_en,
            ],
            'location' => [
                'id' => $employer_location->id,
                'name_ar' => $employer_location->name_ar,
                'name_en' => $employer_location->name_en,
                'is_active' => $employer_location->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employer $employer, EmployerLocation $location): RedirectResponse
    {
        \Log::info('Update method called', [
            'employer_id' => $employer->id,
            'location_id' => $location ? $location->id : 'null',
        ]);

        if (!$location) {
            \Log::error('Location not found', [
                'employer_id' => $employer->id,
                'route_params' => $request->route()->parameters(),
            ]);
            abort(404, 'Location not found');
        }

        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $location->update([
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('employers.locations.index', $employer)
            ->with('success', __('Location updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employer $employer, EmployerLocation $location): RedirectResponse
    {
        $location->delete();

        return redirect()->route('employers.locations.index', $employer)
            ->with('success', __('Location deleted successfully.'));
    }

    /**
     * API endpoint for locations listing.
     */
    public function apiIndex(Request $request)
    {
        $search = $request->get('search');

        $locations = EmployerLocation::when($search, function ($query) use ($search) {
            $query->where('name_ar', 'like', "%{$search}%")
                ->orWhere('name_en', 'like', "%{$search}%");
        })
            ->where('is_active', true)
            ->orderBy('name_ar')
            ->get(['id', 'name_ar', 'name_en']);

        return response()->json($locations);
    }
}
