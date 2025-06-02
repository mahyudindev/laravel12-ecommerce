<?php

use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Serve product images directly
Route::get('/storage/produk/{filename}', function ($filename) {
    $path = 'produk/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    
    return response()->file(Storage::disk('public')->path($path), [
        'Cache-Control' => 'public, max-age=86400',
    ]);
});

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

Route::prefix('owner')->middleware(['auth', 'verified', 'role:owner'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('owner/dashboard');
    })->name('owner.dashboard');
    
    // Add more owner routes here
});

Route::prefix('pelanggan')->middleware(['auth', 'verified', 'role:pelanggan'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('pelanggan/dashboard');
    })->name('pelanggan.dashboard');
    
    // Add more pelanggan routes here
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';