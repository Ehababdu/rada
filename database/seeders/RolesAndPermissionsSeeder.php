<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define resources
        $resources = [
            'martyrs',
            'promotions',
            'compensations',
            'employment-statuses',
            'banks',
            'branches',
            'military-ranks',
            'job-grades',
            'employers',
            'users',
            'permissions',
            'attachments',
            'attachment-types',
        ];

        // Define actions
        $actions = ['view', 'create', 'edit', 'delete'];

        // Create permissions for each resource and action
        $permissions = [];
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                $permissionName = $resource . '.' . $action;
                Permission::firstOrCreate(['name' => $permissionName]);
                $permissions[] = $permissionName;
            }
        }

        // Additional permissions
        $additionalPermissions = [
            'martyrs.export',
            'manage job grades',
            'dashboard.view',
            'settings.view',
            'settings.edit',
        ];

        foreach ($additionalPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
            $permissions[] = $permission;
        }

        // Create roles and assign permissions
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->syncPermissions($permissions);

        $admin = Role::firstOrCreate(['name' => 'Admin']);

        $adminPermissions = array_filter($permissions, function ($permission) {
            return !str_contains($permission, 'permissions.') && !str_contains($permission, 'users.delete');
        });
        $admin->syncPermissions($adminPermissions);

        $manager = Role::firstOrCreate(['name' => 'Manager']);
        $managerPermissions = [
            'martyrs.view',
            'martyrs.create',
            'martyrs.edit',
            'promotions.view',
            'promotions.create',
            'promotions.edit',
            'compensations.view',
            'compensations.create',
            'compensations.edit',
            'employment-statuses.view',
            'banks.view',
            'branches.view',
            'military-ranks.view',
            'dashboard.view',
        ];
        $manager->syncPermissions($managerPermissions);

        $user = Role::firstOrCreate(['name' => 'User']);
        $userPermissions = [
            'martyrs.view',
            'promotions.view',
            'compensations.view',
            'employment-statuses.view',
            'banks.view',
            'branches.view',
            'military-ranks.view',
            'dashboard.view',
        ];
        $user->syncPermissions($userPermissions);
    }
}
