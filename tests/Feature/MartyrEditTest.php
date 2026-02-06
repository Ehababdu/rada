<?php

use App\Models\Martyr;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

uses(RefreshDatabase::class);

describe('Martyrs Edit Page', function () {

    beforeEach(function () {
        $this->user = User::factory()->create();
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'martyrs.edit']);
        $this->user->givePermissionTo('martyrs.edit');
        actingAs($this->user);
    });

    it('user can view edit martyr form', function () {
        // Seed required data
        $this->seed([
            \Database\Seeders\EmploymentStatusSeeder::class,
            \Database\Seeders\ParentsStatusesSeeder::class,
            \Database\Seeders\MaritalStatusesSeeder::class,
            \Database\Seeders\MilitaryRankSeeder::class,
            \Database\Seeders\BankSeeder::class,
            \Database\Seeders\BranchSeeder::class,
        ]);

        $martyr = Martyr::factory()->create();

        $response = get("/martyrs/{$martyr->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Martyrs/Edit')
            ->has('martyr')
            ->has('employmentStatuses')
            ->has('militaryRanks')
            ->has('banks')
            ->has('parentsStatuses')
        );
    });

    it('user cannot view edit martyr form without permission', function () {
        $user = User::factory()->create();
        actingAs($user);

        $martyr = Martyr::factory()->create();

        $response = get("/martyrs/{$martyr->id}/edit");

        $response->assertStatus(403);
    });
});