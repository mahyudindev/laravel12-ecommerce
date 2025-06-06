<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\CheckRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Welcome page (public)
Route::get('/', function () {
    $products = \App\Models\Produk::with(['gambar' => function($query) {
        $query->orderBy('urutan', 'asc');
    }])
    ->where('status_aktif', true)
    ->orderBy('created_at', 'desc')
    ->paginate(12);

    // Format the products data
    $formattedProducts = $products->getCollection()->map(function ($product) {
        return [
            'produk_id' => $product->produk_id,
            'kode_produk' => $product->kode_produk,
            'nama_produk' => $product->nama_produk,
            'deskripsi' => $product->deskripsi,
            'harga' => (float)$product->harga,
            'stok' => (int)$product->stok,
            'berat' => (float)$product->berat,
            'kategori' => $product->kategori,
            'status_aktif' => (bool)$product->status_aktif,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'gambar' => $product->gambar->map(function ($gambar) {
                return [
                    'gambar_id' => $gambar->gambar_id,
                    'produk_id' => $gambar->produk_id,
                    'nama_file' => $gambar->nama_file,
                    'path' => $gambar->path,
                    'url' => asset('storage/' . $gambar->path),
                    'is_thumbnail' => (bool)$gambar->is_thumbnail,
                    'urutan' => $gambar->urutan,
                ];
            })->toArray()
        ];
    });

    return Inertia::render('welcome', [
        'products' => [
            'data' => $formattedProducts,
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'total' => $products->total(),
        ]
    ]);
})->name('welcome');

// Home page (authenticated users)
Route::get('/home', [HomeController::class, 'index'])
    ->name('home')
    ->middleware('auth');

// Product routes (public)
Route::get('/produk/{product:slug}', [ProductController::class, 'show'])->name('produk.show');

// Serve product images directly
Route::get('/storage/produk/{filename}', function ($filename) {
    $path = 'produk/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    
    return response()->file(Storage::disk('public')->path($path), [
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('filename', '.*');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard redirection based on user role
    Route::get('/dashboard', function (Request $request) {
        return match($request->user()->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'owner' => redirect()->route('owner.dashboard'),
            'pelanggan' => redirect()->route('pelanggan.dashboard'),
            default => redirect()->route('home'),
        };
    })->name('dashboard');

    // Owner routes
    Route::prefix('owner')
        ->middleware('role:owner')
        ->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('owner/dashboard');
            })->name('owner.dashboard');
            
            // Add more owner routes here
        });

    // Customer routes
    Route::prefix('pelanggan')
        ->middleware('role:pelanggan')
        ->group(function () {
            Route::get('/dashboard', [HomeController::class, 'index'])
                ->name('pelanggan.dashboard');
            
            // Cart routes
            Route::prefix('keranjang')->group(function () {
                Route::get('/', [\App\Http\Controllers\KeranjangController::class, 'index'])->name('keranjang.index');
                Route::post('/', [\App\Http\Controllers\KeranjangController::class, 'store'])->name('keranjang.store');
                Route::put('/{id}', [\App\Http\Controllers\KeranjangController::class, 'update'])->name('keranjang.update');
                Route::delete('/{id}', [\App\Http\Controllers\KeranjangController::class, 'destroy'])->name('keranjang.destroy');
            });
            
            // Checkout routes
            Route::prefix('checkout')->group(function () {
                Route::get('/', [\App\Http\Controllers\Checkout\CheckoutController::class, 'index'])
                    ->name('checkout');
                
                // Alamat routes
                Route::get('/provinces', [\App\Http\Controllers\Checkout\CheckoutController::class, 'getProvinces']);
                Route::get('/cities', [\App\Http\Controllers\Checkout\CheckoutController::class, 'getCities']);
                Route::get('/subdistricts', [\App\Http\Controllers\Checkout\CheckoutController::class, 'getSubdistricts']);
                
                // Ongkos kirim
                Route::post('/calculate-shipping', [\App\Http\Controllers\Checkout\CheckoutController::class, 'calculateShippingCost']);
                
                // Simpan alamat
                Route::post('/save-address', [\App\Http\Controllers\Checkout\CheckoutController::class, 'saveAddress']);
            });
            
            // Add more customer routes here
        });
});

/*
|--------------------------------------------------------------------------
| Additional Route Files
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/settings.php';