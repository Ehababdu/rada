<?php

use App\Http\Controllers\CompensationController;
use App\Models\Compensation;
use App\Models\Martyr;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

uses(Tests\TestCase::class, RefreshDatabase::class);

test('update method updates compensation', function () {
    $controller = new CompensationController;
    $martyr = Martyr::factory()->create();
    $compensation = Compensation::factory()->forMartyr($martyr)->create();

    $request = Request::create('/compensations/' . $compensation->id, 'PUT', [
        'martyr_id' => $martyr->id,
        'recipient_name' => 'Jane Doe',
        'recipient_passport_number' => 'B987654321',
        'amount' => '7500.00',
        'receipt_date' => '2024-02-20',
    ]);

    $response = $controller->update($request, $compensation);

    $compensation->refresh();

    expect($compensation->recipient_name)->toBe('Jane Doe');
    expect($compensation->recipient_passport_number)->toBe('B987654321');
    expect($compensation->amount)->toBe('7500.00');
    expect($compensation->receipt_date->format('Y-m-d'))->toBe('2024-02-20');
});

test('destroy method deletes compensation', function () {
    $controller = new CompensationController;
    $martyr = Martyr::factory()->create();
    $compensation = Compensation::factory()->forMartyr($martyr)->create();

    $request = Request::create('/compensations/' . $compensation->id, 'DELETE');

    $response = $controller->destroy($compensation);

    expect(Compensation::find($compensation->id))->toBeNull();
});
