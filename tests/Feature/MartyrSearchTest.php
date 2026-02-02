<?php

namespace Tests\Feature;

use App\Models\Martyr;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class MartyrSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_search_returns_matching_martyrs()
    {
        // Clear the search index to ensure test isolation
        try {
            \App\Models\Martyr::query()->unsearchable();
        } catch (\Exception $e) {
            // Ignore if clearing fails
        }

        // Seed minimal data needed by factory
        $user = \App\Models\User::factory()->create();

        // Create martyrs with predictable names
        $martyr = Martyr::factory()->create(['full_name' => 'Test Search User Unique', 'national_id' => '999999999999']);
        $martyr->searchable(); // Make sure it's indexed immediately

        $response = $this->getJson('/api/martyrs/search?q=Unique');

        $response->assertStatus(200)
            ->assertJsonFragment(['full_name' => 'Test Search User Unique']);
    }

    public function test_api_search_with_empty_query_returns_empty()
    {
        $response = $this->getJson('/api/martyrs/search?q=');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }
}
