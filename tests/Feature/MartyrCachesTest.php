<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class MartyrCachesTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_caches_reference_data()
    {
        Cache::flush();

        $user = \App\Models\User::factory()->create();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'martyrs.view']);
        $user->givePermissionTo('martyrs.view');

        $this->actingAs($user)->get('/martyrs')->assertStatus(200);

        $this->assertTrue(Cache::has('martyrs.marital_statuses'));
        $this->assertTrue(Cache::has('martyrs.employment_statuses'));
        $this->assertTrue(Cache::has('martyrs.banks'));
        $this->assertTrue(Cache::has('martyrs.parents_statuses'));
    }
}
