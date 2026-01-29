<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('permissions index page loads', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'permissions.view']);
    $role->givePermissionTo('permissions.view');
    $user->assignRole($role);

    $response = $this->actingAs($user)->get('/permissions');

    $response->assertStatus(200);
});

test('can create permission', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'permissions.create']);
    $role->givePermissionTo('permissions.create');
    $user->assignRole($role);

    $response = $this->actingAs($user)->post('/permissions', [
        'name' => 'test permission',
        'guard_name' => 'web',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('permissions', [
        'name' => 'test permission',
        'guard_name' => 'web',
    ]);
});
