<?php

use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Redirect authenticated users to their respective dashboards
Route::get('/dashboard', function (Request $request) {
    $user = $request->user();
    
    if (!$user) {
        return redirect()->route('login');
    }
    
    return match($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'owner' => redirect()->route('owner.dashboard'),
        'pelanggan' => redirect()->route('pelanggan.dashboard'),
        default => redirect()->route('home'),
    };
})->middleware(['auth', 'verified']);

// Admin routes
Route::prefix('admin')->middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');
    
    // Add more admin routes here
});

// Owner routes
Route::prefix('owner')->middleware(['auth', 'verified', 'role:owner'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('owner/dashboard');
    })->name('owner.dashboard');
    
    // Add more owner routes here
});

// Pelanggan routes
Route::prefix('pelanggan')->middleware(['auth', 'verified', 'role:pelanggan'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('pelanggan/dashboard');
    })->name('pelanggan.dashboard');
    
    // Add more pelanggan routes here
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
