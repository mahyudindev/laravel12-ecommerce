<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\AlamatPelanggan; // Tambahkan ini
use App\Models\Keranjang; // Tambahkan ini
use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Pastikan ini ada
use Illuminate\Support\Facades\Log; // Tambahkan ini
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected RajaOngkirService $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    /**
     * Menampilkan halaman checkout.
     */
    public function index()
    {
        try {
            if (!Auth::check()) {
                Log::warning('Checkout attempt by unauthenticated user.');
                return redirect()->route('login')->with('error', 'Silakan login untuk melanjutkan ke checkout.');
            }

            $user = Auth::user();
            $pelanggan = $user->pelanggan;

            if (!$pelanggan) {
                Log::error('Data pelanggan tidak ditemukan untuk user ID: ' . $user->id);
                return back()->with('error', 'Data pelanggan tidak ditemukan. Silakan lengkapi profil Anda.');
            }

            // Ambil semua alamat pelanggan
            $alamatPelanggan = AlamatPelanggan::where('pelanggan_id', $pelanggan->id_pelanggan)->orderBy('is_utama', 'desc')->get();
            
            // Tentukan alamat utama
            $alamatUtama = $alamatPelanggan->firstWhere('is_utama', true) ?? $alamatPelanggan->first();

            // Ambil data keranjang
            $keranjangData = $this->getCartData($pelanggan->id_pelanggan);

            if (empty($keranjangData['data'])) {
                Log::info('Keranjang kosong untuk pelanggan ID: ' . $pelanggan->id_pelanggan . '. Redirecting ke halaman keranjang.');
                return redirect()->route('keranjang.index')->with('info', 'Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.');
            }

            // Ambil daftar provinsi untuk dropdown (jika diperlukan untuk menambah/mengubah alamat)
            $provincesResponse = $this->rajaOngkir->getProvinces();
            $provinces = $provincesResponse['rajaongkir']['results'] ?? [];
            
            Log::info('Checkout page loaded for user ID: ' . $user->id, [
                'alamat_count' => $alamatPelanggan->count(),
                'keranjang_items' => count($keranjangData['data']),
                'province_count' => count($provinces)
            ]);

            return Inertia::render('pelanggan/checkout/index', [
                'alamatPelanggan' => $alamatPelanggan,
                'alamatUtama' => $alamatUtama,
                'keranjang' => $keranjangData,
                'provinces' => $provinces,
                'auth' => [
                    'user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        // tambahkan field lain jika perlu
                    ] : null,
                ],
                'rajaOngkirBaseUrl' => config('services.rajaongkir.base_url'), // Jika perlu base URL di frontend
                'rajaOngkirApiKey' => config('services.rajaongkir.key'), // Hati-hati mengirim API Key ke frontend, lebih baik tidak
                'kotaAsalId' => config('app.kota_asal_id_pengiriman', 152), // Default Cilegon, atau ambil dari config
            ]);

        } catch (\Exception $e) {
            Log::error('Error in CheckoutController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Terjadi kesalahan saat memuat halaman checkout. Silakan coba lagi nanti.');
        }
    }

    /**
     * Helper untuk mengambil data keranjang.
     */
    private function getCartData($pelangganId)
    {
        $keranjangItems = Keranjang::where('id_pelanggan', $pelangganId)
                            ->with(['produk' => function ($query) {
                                $query->with('gambar'); // Eager load gambar produk
                            }])
                            ->get();

        $totalProduk = $keranjangItems->sum(function ($item) {
            return $item->jumlah * $item->produk->harga;
        });
        
        // Transformasi data keranjang agar sesuai dengan yang diharapkan frontend
        // Terutama path gambar
        $transformedItems = $keranjangItems->map(function ($item) {
            $gambarUrl = null;
            if ($item->produk->gambar && $item->produk->gambar->first()) {
                // Menggunakan MEMORY untuk path gambar
                $gambarUrl = asset('storage/' . $item->produk->gambar->first()->path);
            }

            return [
                'id_keranjang' => $item->id_keranjang,
                'jumlah' => $item->jumlah,
                'harga_satuan' => $item->produk->harga,
                'subtotal' => $item->jumlah * $item->produk->harga,
                'produk' => [
                    'produk_id' => $item->produk->produk_id,
                    'nama_produk' => $item->produk->nama_produk,
                    'harga' => $item->produk->harga,
                    'stok' => $item->produk->stok,
                    'berat' => $item->produk->berat ?? 1000, // Asumsi berat default 1000gr jika tidak ada
                    'gambar' => $item->produk->gambar->map(function ($g) {
                        return [
                            'path' => $g->path,
                            'url' => asset('storage/' . $g->path) // Sesuai MEMORY
                        ];
                    }),
                    'gambar_utama_url' => $gambarUrl // Untuk kemudahan akses gambar utama
                ],
            ];
        });


        return [
            'data' => $transformedItems,
            'total' => $totalProduk, // Ini adalah subtotal produk saja
        ];
    }

    /**
     * Menghitung ongkos kirim.
     * Akan diakses via API.
     */
    public function calculateShippingCost(Request $request)
    {
        $request->validate([
            'destination_city_id' => 'required|integer',
            'weight' => 'required|integer|min:1', // dalam gram
            'courier' => 'required|string|in:jne,pos,tiki', // Sesuaikan dengan kurir yang didukung
        ]);

        try {
            // Ambil ID kota asal dari konfigurasi atau database
            $originCityId = config('app.kota_asal_id_pengiriman', 114); // Contoh: Jakarta Pusat, atau ambil dari .env/config

            $cost = $this->rajaOngkir->getShippingCost(
                $originCityId,
                $request->destination_city_id,
                $request->weight,
                $request->courier
            );
            
            Log::info('Shipping cost calculated:', $request->all());

            if (isset($cost['rajaongkir']['status']['code']) && $cost['rajaongkir']['status']['code'] == 200) {
                return response()->json($cost['rajaongkir']['results'] ?? []);
            } else {
                Log::error('RajaOngkir API error:', $cost['rajaongkir']['status'] ?? ['description' => 'Unknown error']);
                return response()->json(['error' => 'Gagal menghitung ongkir: ' . ($cost['rajaongkir']['status']['description'] ?? 'Layanan tidak tersedia')], 400);
            }

        } catch (\Exception $e) {
            Log::error('Error in calculateShippingCost: ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan internal saat menghitung ongkir.'], 500);
        }
    }

    /**
     * Menyimpan pesanan baru.
     */
    public function store(Request $request)
    {
        Log::info('Attempting to store order with data:', $request->all());

        // Validasi data yang diterima dari frontend
        // (alamat_pelanggan_id, courier, service, shipping_cost, payment_method, dll.)
        // ... Logika validasi ...

        // ... Logika untuk membuat pesanan, item pesanan, pengiriman ...
        // ... Kosongkan keranjang ...
        
        // Contoh response (sesuaikan)
        // return redirect()->route('pesanan.sukses', ['order_id' => $newOrder->id_pesanan])->with('success', 'Pesanan berhasil dibuat!');
        
        // Untuk sekarang, kita redirect kembali dengan pesan sukses dummy
        return redirect()->route('home')->with('success', 'Pesanan (dummy) berhasil diproses!');
    }
}