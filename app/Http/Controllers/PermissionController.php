<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(): Response
    {
        if (!auth()->user()->can('permissions.view')) {
            abort(403, 'Unauthorized');
        }
        $permissions = Permission::orderBy('name')->paginate(15);

        return Inertia::render('Permissions/Index', [
            'paginatedPermissions' => $permissions,
            'filters' => request()->only(['search']),
        ]);
    }

    public function create(): Response
    {
        if (!auth()->user()->can('permissions.create')) {
            abort(403, 'Unauthorized');
        }
        return Inertia::render('Permissions/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        if (!auth()->user()->can('permissions.create')) {
            abort(403, 'Unauthorized');
        }
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
            'guard_name' => ['sometimes', 'string', 'max:255'],
        ]);

        Permission::create($validated);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    public function show(Permission $permission): Response
    {
        if (!auth()->user()->can('permissions.view')) {
            abort(403, 'Unauthorized');
        }
        return Inertia::render('Permissions/Show', [
            'permission' => $permission,
        ]);
    }

    public function edit(Permission $permission): Response
    {
        if (!auth()->user()->can('permissions.edit')) {
            abort(403, 'Unauthorized');
        }
        return Inertia::render('Permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        if (!auth()->user()->can('permissions.edit')) {
            abort(403, 'Unauthorized');
        }
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions')->ignore($permission->id)],
            'guard_name' => ['sometimes', 'string', 'max:255'],
        ]);

        $permission->update($validated);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        if (!auth()->user()->can('permissions.delete')) {
            abort(403, 'Unauthorized');
        }
        $permission->delete();

        return redirect()->route('permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }

    public function apiIndex(Request $request)
    {
        if (!auth()->user()->can('permissions.view')) {
            abort(403, 'Unauthorized');
        }
        $search = $request->get('search', '');

        $permissions = Permission::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($permissions);
    }
}
