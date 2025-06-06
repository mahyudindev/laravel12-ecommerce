<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemPesanan extends Model
{
    use HasFactory;

    protected $primaryKey = 'item_pesanan_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'pesanan_id',
        'produk_id',
        'nama_produk',
        'kode_produk',
        'gambar',
        'deskripsi_singkat',
        'jumlah',
        'harga_awal',
        'harga_diskon',
        'harga_satuan',
        'subtotal',
        'diskon_persen',
        'diskon_nominal',
        'varian',
    ];

    protected $casts = [
        'harga_awal' => 'decimal:2',
        'harga_diskon' => 'decimal:2',
        'harga_satuan' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'diskon_persen' => 'decimal:2',
        'diskon_nominal' => 'decimal:2',
        'varian' => 'array',
    ];

    // Relasi ke Pesanan
    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id', 'pesanan_id');
    }

    // Relasi ke Produk
    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'produk_id');
    }

    // Method untuk menghitung subtotal
    public static function hitungSubtotal(float $hargaSatuan, int $jumlah, float $diskonPersen = 0, float $diskonNominal = 0): array
    {
        $hargaAwal = $hargaSatuan * $jumlah;
        
        // Hitung diskon
        $diskon = 0;
        if ($diskonPersen > 0) {
            $diskon = $hargaAwal * ($diskonPersen / 100);
        } elseif ($diskonNominal > 0) {
            $diskon = $diskonNominal;
        }
        
        // Pastikan diskon tidak melebihi harga awal
        $diskon = min($diskon, $hargaAwal);
        
        $subtotal = $hargaAwal - $diskon;
        
        return [
            'harga_awal' => $hargaAwal,
            'harga_diskon' => $diskon,
            'harga_satuan' => $hargaSatuan,
            'subtotal' => $subtotal,
        ];
    }
}
