<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Alert;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (! auth()->user()->can('users.view')) {
            abort(403, 'Unauthorized');
        }
        $users = User::with('roles')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            })
            ->when($request->role, function ($query) use ($request) {
                $query->whereHas('roles', function ($q) use ($request) {
                    $q->where('name', $request->role);
                });
            })
            ->when($request->sort, function ($query) use ($request) {
                $direction = str_starts_with($request->sort, '-') ? 'desc' : 'asc';
                $column = ltrim($request->sort, '-');
                $query->orderBy($column, $direction);
            })
            ->paginate($request->per_page ?? 15);

        $roles = Role::all();

        return Inertia::render('Users/Index', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search', 'role', 'sort']),
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (! auth()->user()->can('users.create')) {
            abort(403, 'Unauthorized');
        }
        $roles = Role::all();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        if (! auth()->user()->can('users.create')) {
            abort(403, 'Unauthorized');
        }
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "تمت إضافة مستخدم جديد",
                'message' => "تمت إضافة المستخدم {$user->name} بنجاح.",
                'type' => 'success',
                'user_id' => auth()->id(),
                'data' => [
                    'user_id' => $user->id,
                    'action' => 'create'
                ]
            ]);
        }

        return redirect()->route('users.index')
            ->with('success', 'تم إنشاء المستخدم بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        if (! auth()->user()->can('users.view')) {
            abort(403, 'Unauthorized');
        }
        $user->load(['roles', 'permissions']);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        if (! auth()->user()->can('users.edit')) {
            abort(403, 'Unauthorized');
        }
        $user->load('roles');
        $roles = Role::all();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        if (! auth()->user()->can('users.edit')) {
            abort(403, 'Unauthorized');
        }
        $data = $request->validated();

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if (isset($data['password']) && ! empty($data['password'])) {
            $user->update([
                'password' => Hash::make($data['password']),
            ]);
        }

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "تحديث بيانات المستخدم",
                'message' => "تم تحديث بيانات المستخدم {$user->name} بنجاح.",
                'type' => 'success',
                'user_id' => auth()->id(),
                'data' => [
                    'user_id' => $user->id,
                    'action' => 'update'
                ]
            ]);
        }

        return redirect()->route('users.index')
            ->with('success', 'تم تحديث المستخدم بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if (! auth()->user()->can('users.delete')) {
            abort(403, 'Unauthorized');
        }
        // Prevent deleting the current authenticated user
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'لا يمكنك حذف حسابك الخاص']);
        }

        $userId = $user->id;
        $userName = $user->name;

        $user->delete();

        // Create alert
        if (auth()->check()) {
            Alert::create([
                'title' => "حذف مستخدم",
                'message' => "تم حذف المستخدم {$userName}",
                'type' => 'warning',
                'user_id' => auth()->id(),
                'data' => [
                    'user_id' => $userId,
                    'action' => 'delete'
                ]
            ]);
        }

        return redirect()->route('users.index')
            ->with('success', 'تم حذف المستخدم بنجاح');
    }
}
