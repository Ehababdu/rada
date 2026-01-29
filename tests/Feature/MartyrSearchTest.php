<?php

namespace Tests\Feature;

use App\Models\Martyr;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MartyrSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_search_returns_matching_martyrs()
    {
        // Seed minimal data needed by factory
        $user = \App\Models\User::factory()->create();

        // Create martyrs with predictable names
        Martyr::factory()->create(['full_name' => 'محمد أحمد', 'national_id' => '111111111111']);
        Martyr::factory()->create(['full_name' => 'علي حسن', 'national_id' => '222222222222']);

        $response = $this->getJson('/api/martyrs/search?q=محمد');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['full_name' => 'محمد أحمد']);
    }

    public function test_api_search_with_empty_query_returns_empty()
    {
        $response = $this->getJson('/api/martyrs/search?q=');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }
}
