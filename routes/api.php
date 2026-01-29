<?php

use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\Api\EmploymentStatusController;
use App\Http\Controllers\Api\EmployerController;
use App\Http\Controllers\Api\MilitaryRankController;
use App\Http\Controllers\Api\ParentsStatusController;
use App\Http\Controllers\MartyrController;
use App\Models\Attachment;
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/employment-statuses', [EmploymentStatusController::class, 'index']);
Route::get('/military-ranks', [MilitaryRankController::class, 'index']);
Route::get('/banks', [BankController::class, 'index']);
Route::get('/banks/{bank}/branches', [BankController::class, 'branches']);
Route::get('/employers', [EmployerController::class, 'index']);
Route::get('/employers/{employer}/locations', [EmployerController::class, 'locations']);
Route::get('/parents-statuses', [ParentsStatusController::class, 'index']);
Route::get('/marital-statuses', [MaritalStatusController::class, 'index']);

Route::get('/attachment-types', function (Request $request) {
    $search = (string) $request->query('search', '');
    $query = \App\Models\AttachmentType::query();

    \Log::info('Attachment types search:', ['search' => $search]);

    if ($search !== '') {
        $query->where('label', 'ILIKE', '%' . $search . '%');
    }

    $types = $query->get()->pluck('label', 'id')->toArray();

    \Log::info('Results:', $types);

    return response()->json($types);
});

Route::get('/martyrs/search', [MartyrController::class, 'search'])->middleware('throttle:10,1')->name('api.martyrs.search');
Route::get('/martyrs', [MartyrController::class, 'apiIndex'])->middleware('throttle:20,1')->name('api.martyrs.index');

Route::middleware('auth')->group(function () {
    Route::get('/notifications', function () {
        return auth()->user()->unreadNotifications;
    });
    Route::post('/notifications/{notification}/mark-as-read', function ($notificationId) {
        auth()->user()->notifications()->where('id', $notificationId)->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    });
});
