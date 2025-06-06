<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    /**
     * Menampilkan halaman checkout
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $keranjang = $this->getFormattedKeranjang();
        
        return Inertia::render('pelanggan/checkout/index', [
            'keranjang' => $keranjang
        ]);
    }
    
    /**
     * Mendapatkan data keranjang yang sudah diformat
     *
     * @return array
     */
    private function getFormattedKeranjang()
    {
        $keranjang = \App\Models\Keranjang::with(['produk', 'produk.gambar'])
            ->where('user_id', Auth::id())
            ->get()
            ->map(function($item) {
                if (!$item->produk) {
                    return null;
                }
                return [
                    'id_keranjang' => $item->id_keranjang,
                    'jumlah' => (int) $item->jumlah,
                    'subtotal' => (float) $item->subtotal,
                    'harga_satuan' => (float) $item->harga_satuan,
                    'produk' => [
                        'produk_id' => $item->produk->produk_id,
                        'nama_produk' => $item->produk->nama_produk,
                        'harga' => (float) $item->produk->harga,
                        'stok' => (int) $item->produk->stok,
                        'gambar' => $item->produk->gambar ? $item->produk->gambar->map(function($gambar) {
                            return [
                                'path' => $gambar->path,
                                'url' => asset('storage/' . $gambar->path)
                            ];
                        })->toArray() : []
                    ]
                ];
            })
            ->filter()
            ->values();

        $total = $keranjang->sum(function($item) {
            return $item['subtotal'];
        });

        return [
            'data' => $keranjang,
            'total' => (float) $total
        ];
    }
}
