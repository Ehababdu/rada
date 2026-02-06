<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\Alert;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        if (! auth()->user()->can('permissions.view')) {
            abort(403, 'Unauthorized');
        }

        $roles = Role::with('permissions')
            ->withCount('users')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('display_name', 'like', '%' . $request->search . '%');
            })
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        if (! auth()->user()->can('permissions.create')) {
            abort(403, 'Unauthorized');
        }

        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        if (! auth()->user()->can('permissions.create')) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validated();

        $role = Role::create([
            'name' => $data['name'],
            'display_name' => $data['display_name'] ?? null,
            'description' => $data['description'] ?? null,
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "تمت إضافة دور جديد",
                'message' => "تمت إضافة الدور {$role->name} بنجاح.",
                'type' => 'success',
                'user_id' => auth()->id(),
                'data' => [
                    'role_id' => $role->id,
                    'action' => 'create'
                ]
            ]);
        }

        return redirect()->route('roles.index')
            ->with('success', 'تم إنشاء الدور بنجاح');
    }

    public function show(Role $role): Response
    {
        if (! auth()->user()->can('permissions.view')) {
            abort(403, 'Unauthorized');
        }

        $role->load(['permissions', 'users']);

        return Inertia::render('Roles/Show', [
            'role' => $role,
        ]);
    }

    public function edit(Role $role): Response
    {
        if (! auth()->user()->can('permissions.edit')) {
            abort(403, 'Unauthorized');
        }

        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('Roles/Edit', [
            'role' => $role->load('permissions'),
            'permissions' => $permissions,
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        if (! auth()->user()->can('permissions.edit')) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validated();

        $role->update([
            'name' => $data['name'],
            'display_name' => $data['display_name'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "تحديث بيانات الدور",
                'message' => "تم تحديث بيانات الدور {$role->name} بنجاح.",
                'type' => 'success',
                'user_id' => auth()->id(),
                'data' => [
                    'role_id' => $role->id,
                    'action' => 'update'
                ]
            ]);
        }

        return redirect()->route('roles.index')
            ->with('success', 'تم تحديث الدور بنجاح');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (! auth()->user()->can('permissions.delete')) {
            abort(403, 'Unauthorized');
        }

        // Prevent deleting roles that have users
        if ($role->users()->count() > 0) {
            return back()->withErrors(['error' => 'لا يمكن حذف الدور لأنه مرتبط بمستخدمين']);
        }

        $roleId = $role->id;
        $roleName = $role->name;

        $role->delete();

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "حذف دور",
                'message' => "تم حذف الدور {$roleName}",
                'type' => 'warning',
                'user_id' => auth()->id(),
                'data' => [
                    'role_id' => $roleId,
                    'action' => 'delete'
                ]
            ]);
        }

        return redirect()->route('roles.index')
            ->with('success', 'تم حذف الدور بنجاح');
    }
}
