<?php

use App\Models\User;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('logs user creation', function () {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $activities = Activity::where('subject_type', User::class)
                         ->where('subject_id', $user->id)
                         ->where('event', 'created')
                         ->get();

    expect($activities)->toHaveCount(1);
    expect($activities->first()->description)->toBe('created');
    expect($activities->first()->changes)->toHaveKey('attributes');
});

it('logs user update', function () {
    $user = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
    ]);

    $user->update(['name' => 'Updated Name']);

    $activities = Activity::where('subject_type', User::class)
                         ->where('subject_id', $user->id)
                         ->where('event', 'updated')
                         ->get();

    expect($activities)->toHaveCount(1);
    expect($activities->first()->changes)->toHaveKey('attributes');
    expect($activities->first()->changes)->toHaveKey('old');
});