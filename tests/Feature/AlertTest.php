<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AlertTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_user_can_view_alerts_index()
    {
        $user = $this->createUser();

        $response = $this->actingAs($user)->get('/alerts');

        $response->assertStatus(200);
    }

    public function test_user_can_view_specific_alert()
    {
        $user = $this->createUser();
        $alert = Alert::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get("/alerts/{$alert->id}");

        $response->assertStatus(200);
    }

    public function test_user_can_mark_alert_as_read()
    {
        $user = $this->createUser();
        $alert = Alert::factory()->create(['user_id' => $user->id, 'read_at' => null]);

        $response = $this->actingAs($user)->withoutMiddleware()->post("/alerts/{$alert->id}/mark-as-read");

        $response->assertRedirect();
        $this->assertNotNull($alert->fresh()->read_at);
    }

    public function test_user_can_mark_alert_as_unread()
    {
        $user = $this->createUser();
        $alert = Alert::factory()->create(['user_id' => $user->id, 'read_at' => now()]);

        $response = $this->actingAs($user)->withoutMiddleware()->post("/alerts/{$alert->id}/mark-as-unread");

        $response->assertRedirect();
        $this->assertNull($alert->fresh()->read_at);
    }

    public function test_user_can_delete_alert()
    {
        $user = $this->createUser();
        $alert = Alert::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->withoutMiddleware()->delete("/alerts/{$alert->id}");

        $response->assertRedirect();
        $this->assertNull(Alert::find($alert->id));
    }

    protected function createUser()
    {
        return User::factory()->create();
    }
}
