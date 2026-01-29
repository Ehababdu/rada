<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MartyrRateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_api_is_rate_limited()
    {
        // Make a number of requests greater than throttle limit (10 per minute)
        for ($i = 0; $i < 12; $i++) {
            $response = $this->getJson('/api/martyrs/search?q=test');
            // After limit exceeded, expect 429
            if ($i >= 10) {
                $this->assertEquals(429, $response->getStatusCode());

                return;
            }
        }

        $this->fail('Rate limiting did not trigger as expected.');
    }

    public function test_export_route_is_rate_limited()
    {
        $user = \App\Models\User::factory()->create();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'martyrs.export']);
        $user->givePermissionTo('martyrs.export');

        $this->actingAs($user);

        for ($i = 0; $i < 7; $i++) {
            $response = $this->post('/martyrs/export', ['search' => 'x']);
            if ($i >= 5) {
                $this->assertEquals(429, $response->getStatusCode());

                return;
            }
        }

        $this->fail('Export rate limiting did not trigger as expected.');
    }
}
