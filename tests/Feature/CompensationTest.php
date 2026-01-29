<?php

use App\Models\Compensation;
use App\Models\Martyr;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('user can view compensations list', function () {
    $user = User::factory()->create();
    \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'compensations.view']);
    $user->givePermissionTo('compensations.view');
    $this->seed([
        \Database\Seeders\EmploymentStatusSeeder::class,
        \Database\Seeders\ParentsStatusesSeeder::class,
        \Database\Seeders\MaritalStatusesSeeder::class,
        \Database\Seeders\MilitaryRankSeeder::class,
        \Database\Seeders\BankSeeder::class,
        \Database\Seeders\BranchSeeder::class,
    ]);
    $martyr = Martyr::factory()->create(['marital_status_id' => \App\Models\MaritalStatus::first()->id]);
    Compensation::factory()->forMartyr($martyr)->create();

    $response = $this->actingAs($user)->withoutMiddleware()->get('/compensations');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Compensations/Index')
        ->has('compensations.data', 1)
    );
});

it('user can create compensation', function () {
    $user = User::factory()->create();
    $this->seed([
        \Database\Seeders\EmploymentStatusSeeder::class,
        \Database\Seeders\ParentsStatusesSeeder::class,
        \Database\Seeders\MaritalStatusesSeeder::class,
        \Database\Seeders\MilitaryRankSeeder::class,
        \Database\Seeders\BankSeeder::class,
        \Database\Seeders\BranchSeeder::class,
    ]);
    $user = User::factory()->create();
    $martyr = Martyr::factory()->create(['marital_status_id' => \App\Models\MaritalStatus::first()->id]);

    $compensationData = [
        'martyr_id' => $martyr->id,
        'recipient_name' => 'John Doe',
        'recipient_passport_number' => 'A123456789',
        'amount' => '5000.00',
        'receipt_date' => '2024-01-15',
        'months' => [1, 2, 3], // Add months field
    ];

    $response = $this->actingAs($user)->withoutMiddleware()->post('/compensations', $compensationData);

    $response->assertRedirect('/compensations');
    $this->assertDatabaseHas('compensations', [
        'martyr_id' => $martyr->id,
        'recipient_name' => 'John Doe',
        'recipient_passport_number' => 'A123456789',
        'amount' => 5000.00, // Cast to decimal
        'receipt_date' => '2024-01-15 00:00:00', // DateTime format
    ]);
});

it('user can view compensation details', function () {
    $user = User::factory()->create();
    $this->seed([
        \Database\Seeders\EmploymentStatusSeeder::class,
        \Database\Seeders\ParentsStatusesSeeder::class,
        \Database\Seeders\MaritalStatusesSeeder::class,
        \Database\Seeders\MilitaryRankSeeder::class,
        \Database\Seeders\BankSeeder::class,
        \Database\Seeders\BranchSeeder::class,
    ]);
    $user = User::factory()->create();
    $martyr = Martyr::factory()->create(['marital_status_id' => \App\Models\MaritalStatus::first()->id]);
    $compensation = Compensation::factory()->forMartyr($martyr)->create();

    $response = $this->actingAs($user)->get("/compensations/{$compensation->id}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Compensations/Show')
        ->has('compensation')
    );
});

it('user can update compensation', function () {
    $user = User::factory()->create();
    $this->seed([
        \Database\Seeders\EmploymentStatusSeeder::class,
        \Database\Seeders\ParentsStatusesSeeder::class,
        \Database\Seeders\MaritalStatusesSeeder::class,
        \Database\Seeders\MilitaryRankSeeder::class,
        \Database\Seeders\BankSeeder::class,
        \Database\Seeders\BranchSeeder::class,
    ]);
    $user = User::factory()->create();
    $martyr = Martyr::factory()->create(['marital_status_id' => \App\Models\MaritalStatus::first()->id]);
    $compensation = Compensation::factory()->forMartyr($martyr)->create();

    $updatedData = [
        'martyr_id' => $martyr->id,
        'recipient_name' => 'Jane Doe',
        'recipient_passport_number' => 'B987654321',
        'amount' => '7500.00',
        'receipt_date' => '2024-02-20',
    ];

    // Store original values
    $originalName = $compensation->recipient_name;
    $originalPassport = $compensation->recipient_passport_number;
    $originalAmount = $compensation->amount;
    $originalDate = $compensation->receipt_date->format('Y-m-d');

    $response = $this->actingAs($user)->put("/compensations/{$compensation->id}", $updatedData);

    // Refresh the compensation from database
    $compensation = Compensation::find($compensation->id);

    expect($compensation->recipient_name)->not->toBe($originalName);
    expect($compensation->recipient_passport_number)->not->toBe($originalPassport);
    expect($compensation->amount)->not->toBe($originalAmount);
    expect($compensation->receipt_date->format('Y-m-d'))->not->toBe($originalDate);
});

it('user can delete compensation', function () {
    $user = User::factory()->create();
    $this->seed([
        \Database\Seeders\EmploymentStatusSeeder::class,
        \Database\Seeders\ParentsStatusesSeeder::class,
        \Database\Seeders\MaritalStatusesSeeder::class,
        \Database\Seeders\MilitaryRankSeeder::class,
        \Database\Seeders\BankSeeder::class,
        \Database\Seeders\BranchSeeder::class,
    ]);
    $user = User::factory()->create();
    $martyr = Martyr::factory()->create(['marital_status_id' => \App\Models\MaritalStatus::first()->id]);
    $compensation = Compensation::factory()->forMartyr($martyr)->create();

    $response = $this->actingAs($user)->delete("/compensations/{$compensation->id}");

    $response->assertRedirect('/compensations');
    $this->assertDatabaseMissing('compensations', ['id' => $compensation->id]);
});

it('only shows married martyrs in compensation creation', function () {
    $user = User::factory()->create();
    $this->seed([
        \Database\Seeders\EmploymentStatusSeeder::class,
        \Database\Seeders\ParentsStatusesSeeder::class,
        \Database\Seeders\MaritalStatusesSeeder::class,
        \Database\Seeders\MilitaryRankSeeder::class,
        \Database\Seeders\BankSeeder::class,
        \Database\Seeders\BranchSeeder::class,
    ]);
    $marriedMartyr = Martyr::factory()->create(['marital_status_id' => \App\Models\MaritalStatus::first()->id]);
    $singleMartyr = Martyr::factory()->create(['marital_status_id' => \App\Models\MaritalStatus::skip(1)->first()->id]);

    $response = $this->actingAs($user)->withoutMiddleware()->get('/compensations/create');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Compensations/Create')
        ->has('martyrs', 1) // Only married martyr should be included
        ->where('martyrs.0.id', $marriedMartyr->id)
    );
});
