<?php

use App\Models\Martyr;
use App\Models\Promotion;
use App\Models\MilitaryRank;
use App\Models\JobGrade;
use App\Models\EmploymentStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('displays promotions index page', function () {
    $user = \App\Models\User::factory()->create();
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'promotions.view']);
    $user->givePermissionTo('promotions.view');

    $this->actingAs($user);

    $martyr = Martyr::factory()->create();
    $militaryRank = MilitaryRank::factory()->create();
    $promotionRank = MilitaryRank::factory()->create();

    Promotion::factory()->create([
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_rank_date' => '2023-01-15',
        'promotion_years' => 3,
        'next_due_date' => '2026-01-15',
    ]);

    $response = $this->get('/promotions');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Promotions/Index')
        ->has('promotions.data', 1)
        ->where('promotions.data.0.current_rank_date', '2023-01-15')
        ->where('promotions.data.0.next_due_date_formatted', '15/01/2026')
    );
});

it('formats current_rank_date correctly in the UI', function () {
    $user = \App\Models\User::factory()->create();
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'promotions.view']);
    $user->givePermissionTo('promotions.view');

    $this->actingAs($user);

    $martyr = Martyr::factory()->create();
    $militaryRank = MilitaryRank::factory()->create();
    $promotionRank = MilitaryRank::factory()->create();

    Promotion::factory()->create([
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_rank_date' => '2023-01-15',
        'promotion_years' => 3,
        'next_due_date' => '2026-01-15',
    ]);

    $response = $this->get('/promotions');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Promotions/Index')
        ->has('promotions.data', 1)
        ->where('promotions.data.0.current_rank_date', '2023-01-15')
    );
});

it('displays formatted dates correctly', function () {
    $user = \App\Models\User::factory()->create();
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'promotions.view']);
    $user->givePermissionTo('promotions.view');

    $this->actingAs($user);

    $martyr = Martyr::factory()->create();
    $militaryRank = MilitaryRank::factory()->create();
    $promotionRank = MilitaryRank::factory()->create();

    Promotion::factory()->create([
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_rank_date' => '2023-01-15',
        'promotion_years' => 3,
        'next_due_date' => '2026-01-15',
    ]);

    $response = $this->get('/promotions');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Promotions/Index')
        ->has('promotions.data', 1)
        ->where('promotions.data.0.next_due_date_formatted', '15/01/2026')
    );
});

it('can confirm a promotion when due date is reached', function () {
    $user = \App\Models\User::factory()->create();
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'promotions.edit']);
    $user->givePermissionTo('promotions.edit');

    $this->actingAs($user);

    $martyr = Martyr::factory()->create(['military_rank_id' => 1]);
    $militaryRank = MilitaryRank::factory()->create();
    $promotionRank = MilitaryRank::factory()->create();

    $promotion = Promotion::factory()->create([
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_rank_date' => '2020-01-15',
        'promotion_years' => 3,
        'next_due_date' => now()->subDay()->toDateString(), // Due yesterday
    ]);

    $response = $this->post("/promotions/{$promotion->id}/confirm");

    $response->assertRedirect('/promotions');
    $response->assertSessionHas('success', 'تم تأكيد الترقية وتحديث بيانات الشهيد بنجاح');

    $promotion->refresh();
    $martyr->refresh();

    expect($promotion->current_rank_date->toDateString())->toBe(now()->toDateString());
    expect($promotion->next_due_date->toDateString())->toBe(now()->addYears(3)->toDateString());
    expect($martyr->military_rank_id)->toBe($promotionRank->id);
});

it('updates promotion status based on due date', function () {
    $user = \App\Models\User::factory()->create();
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'promotions.view']);
    $user->givePermissionTo('promotions.view');

    $this->actingAs($user);

    $martyr = Martyr::factory()->create();
    $militaryRank = MilitaryRank::factory()->create();
    $promotionRank = MilitaryRank::factory()->create();

    // Create a promotion that is overdue (due date in the past)
    $overduePromotion = Promotion::factory()->create([
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_rank_date' => '2020-01-15',
        'promotion_years' => 3,
        'next_due_date' => now()->subDays(30), // 30 days ago
        'status' => 'pending', // Initially pending
    ]);

    // Create a promotion that is still pending (due date in the future)
    $pendingPromotion = Promotion::factory()->create([
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_rank_date' => '2020-01-15',
        'promotion_years' => 3,
        'next_due_date' => now()->addDays(30), // 30 days from now
        'status' => 'pending', // Initially pending
    ]);

    $response = $this->get('/promotions');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Promotions/Index')
        ->has('promotions.data', 2)
        ->where('promotions.data.0.status', 'overdue') // First promotion should be overdue
        ->where('promotions.data.1.status', 'pending') // Second promotion should still be pending
    );
});

it('updates promotion with job grades correctly', function () {
    $user = \App\Models\User::factory()->create();
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'promotions.edit']);
    $user->givePermissionTo('promotions.edit');

    $this->actingAs($user);

    $martyr = Martyr::factory()->create();
    $militaryRank = MilitaryRank::factory()->create();
    $promotionRank = MilitaryRank::factory()->create();
    $currentJobGrade = JobGrade::factory()->create(['name_ar' => 'درجة أولى', 'name_en' => 'First Grade']);
    $promotionJobGrade = JobGrade::factory()->create(['name_ar' => 'درجة ثانية', 'name_en' => 'Second Grade']);

    $promotion = Promotion::factory()->create([
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_rank_date' => '2023-01-15',
        'promotion_years' => 3,
        'next_due_date' => '2026-01-15',
    ]);

    $response = $this->put("/promotions/{$promotion->id}", [
        'martyr_id' => $martyr->id,
        'current_rank' => $militaryRank->id,
        'promotion_rank' => $promotionRank->id,
        'current_job_grade' => 'درجة أولى',
        'promotion_job_grade' => 'درجة ثانية',
        'current_rank_date' => '2023-01-15',
        'promotion_years' => 3,
        'next_due_date' => '2026-01-15',
        'description' => 'Updated description',
    ]);

    $response->assertRedirect('/promotions');
    $response->assertSessionHas('success', 'تم تحديث الترقية بنجاح');

    $promotion->refresh();

    expect($promotion->current_job_grade_id)->toBe($currentJobGrade->id);
    expect($promotion->promotion_job_grade_id)->toBe($promotionJobGrade->id);
});