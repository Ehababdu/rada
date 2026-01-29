<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user()?->loadMissing(['roles', 'permissions']);

        $roleNames = $user?->roles->pluck('name')->toArray();
        $permissionNames = $user?->getAllPermissions()->pluck('name')->toArray();

        $resources = [
            'martyrs',
            'promotions',
            'banks',
            'military-ranks',
            'compensations',
            'employment-statuses',
            'job-grades',
            'attachment-types',
            'users',
            'permissions',
            'roles',
        ];

        $navAccess = [];
        $isSuperAdmin = in_array('Super Admin', $roleNames ?? [], true);

        foreach ($resources as $resource) {
            // Special handling for roles: it uses permissions.view permission
            if ($resource === 'roles') {
                $navAccess[$resource] = $isSuperAdmin || collect($permissionNames)
                    ->contains(fn(string $permission) => 
                        $permission === 'permissions.view' || 
                        $permission === 'permissions.edit' || 
                        $permission === 'permissions.create' ||
                        $permission === 'roles' || 
                        Str::startsWith($permission, 'roles.')
                    );
            } else {
                $navAccess[$resource] = $isSuperAdmin || collect($permissionNames)
                    ->contains(fn(string $permission) => $permission === $resource || Str::startsWith($permission, $resource . '.'));
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
                'permissions' => $permissionNames,
                'roles' => $roleNames,
            ],
            'navAccess' => $navAccess,
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
            ],
            'csp_nonce' => $request->attributes->get('csp_nonce'),
        ];
    }
}
