<?php

use App\Models\Employer;
use App\Models\EmployerLocation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can view employer locations index', function () {
    $user = User::factory()->create();
    $employer = Employer::factory()->create();

    $response = $this->actingAs($user)->get(route('employers.locations.index', $employer));

    $response->assertStatus(200);
});

test('user can create employer location', function () {
    $user = User::factory()->create();
    $employer = Employer::factory()->create();

    $locationData = [
        'name_ar' => 'مكان تجريبي',
        'name_en' => 'Test Location',
        'is_active' => true,
    ];

    $response = $this->actingAs($user)->post(route('employers.locations.store', $employer), $locationData);

    $response->assertRedirect(route('employers.locations.index', $employer));
    $this->assertDatabaseHas('employer_locations', array_merge($locationData, ['employer_id' => $employer->id]));
});

test('user can update employer location', function () {
    $user = User::factory()->create();
    $employer = Employer::factory()->create();
    $location = EmployerLocation::factory()->create(['employer_id' => $employer->id]);

    $updatedData = [
        'name_ar' => 'مكان محدث',
        'name_en' => 'Updated Location',
        'is_active' => 0, // Use 0 instead of false for form data
    ];

    $response = $this->actingAs($user)->put(route('employers.locations.update', [$employer, $location]), $updatedData);

    $response->assertRedirect(route('employers.locations.index', $employer));
    $this->assertDatabaseHas('employer_locations', [
        'id' => $location->id,
        'name_ar' => 'مكان محدث',
        'name_en' => 'Updated Location',
        'is_active' => 0,
    ]);
});

test('user can delete employer location', function () {
    $user = User::factory()->create();
    $employer = Employer::factory()->create();
    $location = EmployerLocation::factory()->create(['employer_id' => $employer->id]);

    $response = $this->actingAs($user)->delete(route('employers.locations.destroy', [$employer, $location]));

    $response->assertRedirect(route('employers.locations.index', $employer));
    $this->assertDatabaseMissing('employer_locations', ['id' => $location->id]);
});

test('employer location belongs to employer relationship', function () {
    $employer = Employer::factory()->create();
    $location = EmployerLocation::factory()->create(['employer_id' => $employer->id]);

    // Test that the relationship exists
    expect($location->employer())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($location->employer->id)->toBe($employer->id);
});
