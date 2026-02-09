<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\Api\MaritalStatusesController;
use App\Http\Controllers\Api\ParentsStatusesController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\AttachmentTypeController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CompensationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\EmployerLocationController;
use App\Http\Controllers\EmploymentStatusController;
use App\Http\Controllers\JobGradeController;
use App\Http\Controllers\MartyrController;
use App\Http\Controllers\MilitaryRankController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'app_name' => config('app.name'),
        'app_title' => config('app.title', 'Rada'),
        'app_description' => config('app.description', 'Martyr Management System'),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('reports', [ReportsController::class, 'index'])->name('reports.index');

    Route::resource('martyrs', MartyrController::class);
    Route::get('martyrs/{martyr}/print', [MartyrController::class, 'print'])->name('martyrs.print');
    Route::match(['GET', 'POST'], 'martyrs/export', [MartyrController::class, 'export'])->middleware('throttle:5,1')->name('martyrs.export');
    Route::patch('martyrs/{martyr}/status', [MartyrController::class, 'updateStatus'])->name('martyrs.update-status');
    Route::resource('martyrs.attachments', AttachmentController::class);
    Route::resource('attachment-types', AttachmentTypeController::class);
    Route::resource('promotions', PromotionController::class);
    Route::post('promotions/{promotion}/confirm', [PromotionController::class, 'confirm'])->name('promotions.confirm');
    Route::get('promotions/export', [PromotionController::class, 'export'])->name('promotions.export');
    Route::get('promotions/export/latest', [PromotionController::class, 'latestExport'])->name('promotions.export.latest');
    Route::resource('compensations', CompensationController::class);
    Route::get('compensations/{compensation}/pdf', [CompensationController::class, 'pdf'])->name('compensations.pdf');
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
    Route::resource('alerts', AlertController::class)->only(['index', 'show', 'destroy']);
    Route::post('alerts/{alert}/mark-as-read', [AlertController::class, 'markAsRead'])->name('alerts.mark-as-read');
    Route::post('alerts/{alert}/mark-as-unread', [AlertController::class, 'markAsUnread'])->name('alerts.mark-as-unread');
    Route::post('alerts/mark-all-as-read', [AlertController::class, 'markAllAsRead'])->name('alerts.mark-all-as-read');
    Route::resource('activity-log', ActivityLogController::class)->only(['index', 'show', 'destroy']);
    Route::get('api/search', [\App\Http\Controllers\Api\SearchController::class, 'search'])->name('api.search');
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

// Health check for production monitoring
Route::get('/health', function () {
    return response('OK', 200);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
