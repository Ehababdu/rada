<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class AttachmentTypePermissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_permission_cannot_access_attachment_types_index()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/attachment-types');

        $response->assertForbidden();
    }

    public function test_user_with_permission_can_access_attachment_types_index()
    {
        $user = User::factory()->create();
        $permission = Permission::firstOrCreate(['name' => 'attachment-types.view']);
        $user->givePermissionTo($permission);

        $response = $this->actingAs($user)->get('/attachment-types');

        $response->assertSuccessful();
    }
}
