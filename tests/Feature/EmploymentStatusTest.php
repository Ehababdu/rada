<?php

use App\Models\EmploymentStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('user can view employment statuses list', function () {
    $user = User::factory()->create();
    EmploymentStatus::factory()->count(3)->create();

    $response = $this->actingAs($user)->get('/employment-statuses');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('EmploymentStatuses/Index')
            ->has('employmentStatuses.data', 3),
        );
});

it('user can create employment status', function () {
    $user = User::factory()->create();
    $employmentStatusData = [
        'name' => 'موظف',
    ];

    $response = $this->actingAs($user)->withoutMiddleware()->post('/employment-statuses', $employmentStatusData);

    $response->assertRedirect('/employment-statuses');
    $this->assertDatabaseHas('employment_statuses', $employmentStatusData);
});

it('user can view employment status', function () {
    $user = User::factory()->create();
    $employmentStatus = EmploymentStatus::factory()->create();

    $response = $this->actingAs($user)->get("/employment-statuses/{$employmentStatus->id}");

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('EmploymentStatuses/Show')
            ->has('employmentStatus'),
        );
});

it('user can update employment status', function () {
    $user = User::factory()->create();
    $employmentStatus = EmploymentStatus::factory()->create();

    $updatedData = [
        'name' => 'عاطل عن العمل',
    ];

    $response = $this->actingAs($user)->withoutMiddleware()->put("/employment-statuses/{$employmentStatus->id}", $updatedData);

    $response->assertRedirect('/employment-statuses');

    // Refresh the employment status from database
    $employmentStatus = EmploymentStatus::find($employmentStatus->id);

    expect($employmentStatus->name)->toBe('عاطل عن العمل');
});

it('user can delete employment status', function () {
    $user = User::factory()->create();
    $employmentStatus = EmploymentStatus::factory()->create();

    $response = $this->actingAs($user)->withoutMiddleware()->delete("/employment-statuses/{$employmentStatus->id}");

    $response->assertRedirect('/employment-statuses');
    $this->assertDatabaseMissing('employment_statuses', ['id' => $employmentStatus->id]);
});

it('user can view create employment status form', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/employment-statuses/create');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('EmploymentStatuses/Create'),
        );
});

it('user can view edit employment status form', function () {
    $user = User::factory()->create();
    $employmentStatus = EmploymentStatus::factory()->create();

    $response = $this->actingAs($user)->get("/employment-statuses/{$employmentStatus->id}/edit");

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('EmploymentStatuses/Edit')
            ->has('employmentStatus'),
        );
});
