<?php

use App\Http\Controllers\Admin\ProdukController;
use App\Http\Controllers\Admin\ProdukGambarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin routes
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'role:admin'])
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');
        
        // Produk management
        Route::resource('produk', ProdukController::class);
        
        // Produk image management
        Route::prefix('produk/{produk}')->group(function () {
            Route::post('/upload', [ProdukGambarController::class, 'store'])->name('produk.upload');
            Route::put('/gambar', [ProdukController::class, 'uploadGambar'])->name('produk.upload-gambar');
            Route::post('/reorder-images', [ProdukGambarController::class, 'reorder'])->name('produk.reorder');
            Route::post('/set-thumbnail/{gambar}', [ProdukGambarController::class, 'setThumbnail'])->name('produk.set-thumbnail');
            Route::delete('/gambar/{gambar}', [ProdukGambarController::class, 'destroy'])->name('produk.delete-image');
        });
    });
