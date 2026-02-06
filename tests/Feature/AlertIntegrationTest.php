<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\Martyr;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class AlertIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        
        // Setup permissions
        Permission::firstOrCreate(['name' => 'martyrs.create']);
        Permission::firstOrCreate(['name' => 'martyrs.delete']);
        Permission::firstOrCreate(['name' => 'users.create']);
        Permission::firstOrCreate(['name' => 'users.edit']);
        Permission::firstOrCreate(['name' => 'users.delete']);
        Permission::firstOrCreate(['name' => 'permissions.create']);
        Permission::firstOrCreate(['name' => 'permissions.edit']);
        Permission::firstOrCreate(['name' => 'permissions.delete']);
        
        $this->user->givePermissionTo([
            'martyrs.create', 'martyrs.delete',
            'users.create', 'users.edit', 'users.delete',
            'permissions.create', 'permissions.edit', 'permissions.delete'
        ]);

        $this->actingAs($this->user);

        // Seed basic data for martyr creation
        $this->seed([
            \Database\Seeders\EmploymentStatusSeeder::class,
            \Database\Seeders\ParentsStatusesSeeder::class,
            \Database\Seeders\MaritalStatusesSeeder::class,
            \Database\Seeders\MilitaryRankSeeder::class,
            \Database\Seeders\BankSeeder::class,
            \Database\Seeders\BranchSeeder::class,
        ]);
    }

    /** @test */
    public function it_creates_alert_when_martyr_is_created()
    {
        $data = Martyr::factory()->raw([
            'parents_status_id' => \App\Models\ParentsStatus::first()->id,
            'marital_status_id' => \App\Models\MaritalStatus::first()->id,
            'employment_status_id' => \App\Models\EmploymentStatus::first()->id,
            'military_rank_id' => \App\Models\MilitaryRank::first()->id,
            'bank_id' => \App\Models\Bank::first()->id,
            'branch_id' => \App\Models\Branch::first()->id,
        ]);

        $response = $this->post(route('martyrs.store'), $data);
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'تمت إضافة شهيد جديد',
            'type' => 'success',
        ]);
    }

    /** @test */
    public function it_creates_alert_when_martyr_is_deleted()
    {
        $martyr = Martyr::factory()->create([
             'parents_status_id' => \App\Models\ParentsStatus::first()->id,
            'marital_status_id' => \App\Models\MaritalStatus::first()->id,
            'employment_status_id' => \App\Models\EmploymentStatus::first()->id,
            'military_rank_id' => \App\Models\MilitaryRank::first()->id,
            'bank_id' => \App\Models\Bank::first()->id,
            'branch_id' => \App\Models\Branch::first()->id,
        ]);

        $response = $this->delete(route('martyrs.destroy', $martyr));
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'حذف شهيد',
            'type' => 'warning',
        ]);
    }

    /** @test */
    public function it_creates_alert_when_user_is_created()
    {
        $data = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $response = $this->post(route('users.store'), $data);
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'تمت إضافة مستخدم جديد',
            'type' => 'success',
        ]);
    }

    /** @test */
    public function it_creates_alert_when_user_is_updated()
    {
        $otherUser = User::factory()->create();

        $data = [
            'name' => 'Updated Name',
            'email' => $otherUser->email,
        ];

        $response = $this->put(route('users.update', $otherUser), $data);
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'تحديث بيانات المستخدم',
            'type' => 'success',
        ]);
    }

    /** @test */
    public function it_creates_alert_when_user_is_deleted()
    {
        $otherUser = User::factory()->create();

        $response = $this->delete(route('users.destroy', $otherUser));
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'حذف مستخدم',
            'type' => 'warning',
        ]);
    }

    /** @test */
    public function it_creates_alert_when_role_is_created()
    {
        $data = [
            'name' => 'new_role',
            'display_name' => 'New Role',
            'guard_name' => 'web',
        ];

        $response = $this->post(route('roles.store'), $data);
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'تمت إضافة دور جديد',
            'type' => 'success',
        ]);
    }

    /** @test */
    public function it_creates_alert_when_role_is_updated()
    {
        $role = Role::create(['name' => 'test_role', 'guard_name' => 'web']);

        $data = [
            'name' => 'updated_role',
            'display_name' => 'Updated Role',
        ];

        $response = $this->put(route('roles.update', $role), $data);
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'تحديث بيانات الدور',
            'type' => 'success',
        ]);
    }

    /** @test */
    public function it_creates_alert_when_role_is_deleted()
    {
        $role = Role::create(['name' => 'delete_role', 'guard_name' => 'web']);

        $response = $this->delete(route('roles.destroy', $role));
        $response->assertRedirect();

        $this->assertDatabaseHas('alerts', [
            'user_id' => $this->user->id,
            'title' => 'حذف دور',
            'type' => 'warning',
        ]);
    }
}
