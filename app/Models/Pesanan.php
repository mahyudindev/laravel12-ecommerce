<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pesanan extends Model
{
    use HasFactory;

    protected $primaryKey = 'pesanan_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'pelanggan_id',
        'alamat_pengiriman_id',
        'no_pesanan',
        'tanggal_pesanan',
        'total_harga',
        'ongkos_kirim',
        'total_akhir',
        'status',
        'metode_pembayaran',
        'status_pembayaran',
        'snap_token',
        'metadata',
        'catatan',
    ];

    protected $casts = [
        'tanggal_pesanan' => 'date',
        'total_harga' => 'decimal:2',
        'ongkos_kirim' => 'decimal:2',
        'total_akhir' => 'decimal:2',
        'metadata' => 'array',
    ];

    // Relasi ke User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relasi ke Pelanggan
    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id', 'pelanggan_id');
    }

    // Relasi ke AlamatPengiriman
    public function alamatPengiriman(): BelongsTo
    {
        return $this->belongsTo(AlamatPelanggan::class, 'alamat_pengiriman_id', 'alamat_id');
    }

    // Relasi ke ItemPesanan
    public function items(): HasMany
    {
        return $this->hasMany(ItemPesanan::class, 'pesanan_id', 'pesanan_id');
    }

    // Relasi ke Pengiriman (One-to-One)
    public function pengiriman(): HasOne
    {
        return $this->hasOne(Pengiriman::class, 'pesanan_id', 'pesanan_id');
    }

    // Scope untuk status pesanan
    public function scopeMenungguPembayaran($query)
    {
        return $query->where('status', 'menunggu_pembayaran');
    }

    public function scopeDiproses($query)
    {
        return $query->where('status', 'diproses');
    }

    public function scopeDikirim($query)
    {
        return $query->where('status', 'dikirim');
    }

    public function scopeSelesai($query)
    {
        return $query->where('status', 'selesai');
    }

    public function scopeDibatalkan($query)
    {
        return $query->where('status', 'dibatalkan');
    }

    // Method untuk generate nomor pesanan
    public static function generateNoPesanan(): string
    {
        $prefix = 'INV' . date('Ymd');
        $lastOrder = self::where('no_pesanan', 'like', $prefix . '%')
            ->orderBy('pesanan_id', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->no_pesanan, -4);
            $number = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $number = '0001';
        }

        return $prefix . $number;
    }
}
