<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Martyr;
use App\Models\Compensation;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Ensure permission exists
    Permission::firstOrCreate(['name' => 'compensations.view']);
});

it('returns a PDF from the compensation pdf route', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('compensations.view');

    $martyr = Martyr::factory()->create();

    $compensation = Compensation::factory()->create([
        'martyr_id' => $martyr->id,
    ]);

    $response = $this->actingAs($user)->get(route('compensations.pdf', $compensation));

    $response->assertSuccessful();
    $response->assertHeader('Content-Type', 'application/pdf');
    // Ensure response body is not empty
    expect($response->getContent())->not->toBeEmpty();
});
