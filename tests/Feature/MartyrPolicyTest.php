<?php

namespace Tests\Feature;

use App\Models\EmploymentStatus;
use App\Models\MaritalStatus;
use App\Models\Martyr;
use App\Models\ParentsStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MartyrPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_permission_cannot_view_index()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->get('/martyrs');

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_view_index()
    {
        $user = User::factory()->create();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'martyrs.view']);
        $user->givePermissionTo('martyrs.view');

        $this->actingAs($user);

        $response = $this->get('/martyrs');

        $response->assertStatus(200);
    }

    public function test_user_without_permission_cannot_update_martyr()
    {
        $user = User::factory()->create();
        $parents = ParentsStatus::create(['name_ar' => 'على قيد الحياة', 'name_en' => 'Alive']);
        $marital = MaritalStatus::factory()->create();
        $employment = EmploymentStatus::factory()->create();

        $martyr = Martyr::factory()->create();

        $this->actingAs($user);

        $data = [
            'file_number' => 'FILE-003',
            'full_name' => 'محمد علي',
            'national_id' => '123456789012',
            'address' => 'عنوان',
            'death_date' => now()->subDays(1)->format('Y-m-d'),
            'parents_status_id' => $parents->id,
            'marital_status_id' => $marital->id,
            'employment_status_id' => $employment->id,
        ];

        $response = $this->put("/martyrs/{$martyr->id}", $data);

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_update_martyr()
    {
        $user = User::factory()->create();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'martyrs.edit']);
        $user->givePermissionTo('martyrs.edit');

        $parents = ParentsStatus::create(['name_ar' => 'على قيد الحياة', 'name_en' => 'Alive']);
        $marital = MaritalStatus::factory()->create();
        $employment = EmploymentStatus::factory()->create();

        $martyr = Martyr::factory()->create();

        $this->actingAs($user);

        $data = [
            'full_name' => 'محمد علي',
            'national_id' => '333333333333',
            'address' => 'عنوان',
            'death_date' => now()->subDays(1)->format('Y-m-d'),
            'parents_status_id' => $parents->id,
            'marital_status_id' => $marital->id,
            'employment_status_id' => $employment->id,
        ];

        $response = $this->put("/martyrs/{$martyr->id}", $data);

        $response->assertStatus(302);
    }
}
