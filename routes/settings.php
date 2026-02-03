<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/language', function () {
        return Inertia::render('settings/language');
    })->name('language.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    // Fortify two-factor routes (manually registered since Fortify::ignoreRoutes() is enabled)
    Route::get('user/two-factor-qr-code', [\Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::class, 'show'])
        ->name('two-factor.qr-code');
    Route::get('user/two-factor-secret-key', [\Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::class, 'show'])
        ->name('two-factor.secret-key');
    Route::get('user/two-factor-recovery-codes', [\Laravel\Fortify\Http\Controllers\RecoveryCodeController::class, 'index'])
        ->name('two-factor.recovery-codes');
    Route::post('user/two-factor-recovery-codes', [\Laravel\Fortify\Http\Controllers\RecoveryCodeController::class, 'store'])
        ->name('two-factor.regenerate-recovery-codes');
    Route::post('user/confirmed-two-factor-authentication', [\Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController::class, 'store'])
        ->name('two-factor.confirm');
    Route::post('user/two-factor-authentication', [\Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::class, 'store'])
        ->name('two-factor.enable');
    Route::delete('user/two-factor-authentication', [\Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::class, 'destroy'])
        ->name('two-factor.disable');
});
