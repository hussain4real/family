<?php

use App\Http\Controllers\ContributionController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Contribution routes for contributors (view own contributions)
    Route::get('/contributions', [ContributionController::class, 'index'])
        ->name('contributions.index');

    Route::get('/contributions/{contribution}', [ContributionController::class, 'show'])
        ->name('contributions.show');

    // Admin routes for financial secretary
    Route::middleware(['role:financial-secretary'])->prefix('admin')->group(function () {
        Route::get('/contributions', [ContributionController::class, 'adminIndex'])
            ->name('contributions.admin');

        Route::get('/contributions/create', [ContributionController::class, 'create'])
            ->name('contributions.create');

        Route::post('/contributions', [ContributionController::class, 'store'])
            ->name('contributions.store');

        Route::delete('/contributions/{contribution}', [ContributionController::class, 'destroy'])
            ->name('contributions.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
