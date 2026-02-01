<?php

use App\Http\Controllers\Api\MaritalStatusesController;
use App\Http\Controllers\Api\ParentsStatusesController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\AttachmentTypeController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CompensationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmploymentStatusController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\EmployerLocationController;
use App\Http\Controllers\JobGradeController;
use App\Http\Controllers\MartyrController;
use App\Http\Controllers\MilitaryRankController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'app_name' => env('APP_NAME'),
        'app_title' => env('app_title'),
        'app_description' => env('APP_DESCRIPTION'),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('martyrs', MartyrController::class);
    Route::post('martyrs/export', [MartyrController::class, 'export'])->middleware('throttle:5,1')->name('martyrs.export');
    Route::get('martyrs/export', [MartyrController::class, 'export'])->middleware('throttle:5,1')->name('martyrs.export.get');
    Route::get('martyrs/export/latest', [MartyrController::class, 'latestExport'])->name('martyrs.export.latest');
    Route::get('martyrs/export/status', [MartyrController::class, 'exportStatus'])->name('martyrs.export.status');
    Route::patch('martyrs/{martyr}/status', [MartyrController::class, 'updateStatus'])->name('martyrs.update-status');
    Route::resource('martyrs.attachments', AttachmentController::class);
    Route::resource('attachment-types', AttachmentTypeController::class);
    Route::resource('promotions', PromotionController::class);
    Route::post('promotions/{promotion}/confirm', [PromotionController::class, 'confirm'])->name('promotions.confirm');
    Route::resource('compensations', CompensationController::class);
    Route::resource('employment-statuses', EmploymentStatusController::class);
    Route::resource('banks', BankController::class);
    Route::resource('banks.branches', BranchController::class);
    Route::resource('employers', EmployerController::class);
    Route::get('employers/{employer}/edit-location', [EmployerController::class, 'editLocation'])->name('employers.edit-location');
    Route::put('employers/{employer}/update-location', [EmployerController::class, 'updateLocation'])->name('employers.update-location');
    Route::resource('employers.locations', EmployerLocationController::class);
    Route::resource('military-ranks', MilitaryRankController::class);
    Route::resource('job-grades', JobGradeController::class);
    Route::resource('users', UserController::class);
    Route::resource('permissions', PermissionController::class);
    Route::resource('roles', RoleController::class);
});

Route::get('api/military-ranks', [MilitaryRankController::class, 'apiIndex'])->name('api.military-ranks.index');
Route::get('api/banks', [BankController::class, 'apiIndex'])->name('api.banks.index');
Route::get('api/employers', [EmployerController::class, 'apiIndex'])->name('api.employers.index');
Route::get('api/employers/{employer}/locations', [EmployerLocationController::class, 'apiIndex'])->name('api.employers.locations.index');
Route::get('api/banks/{bank}/branches', [BranchController::class, 'apiIndex'])->name('api.banks.branches.index');
Route::get('api/employment-statuses', [EmploymentStatusController::class, 'apiIndex'])->name('api.employment-statuses.index');
Route::get('api/job-grades', [JobGradeController::class, 'apiIndex'])->name('api.job-grades.index');
Route::get('api/parents-statuses', [ParentsStatusesController::class, 'index'])->name('api.parents-statuses.index');
Route::get('api/marital-statuses', [MaritalStatusesController::class, 'index'])->name('api.marital-statuses.index');
Route::get('api/permissions', [PermissionController::class, 'apiIndex'])->name('api.permissions.index');

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
