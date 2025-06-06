<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengiriman extends Model
{
    use HasFactory;

    protected $primaryKey = 'pengiriman_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'pesanan_id',
        'alamat_pelanggan_id',
        'kode_kurir',
        'nama_kurir',
        'kode_layanan',
        'nama_layanan',
        'keterangan_layanan',
        'berat_gram',
        'biaya',
        'estimasi',
        'no_resi',
        'status',
        'dikemas_pada',
        'dikirim_pada',
        'diterima_pada',
    ];

    protected $casts = [
        'berat_gram' => 'integer',
        'biaya' => 'decimal:2',
        'dikemas_pada' => 'datetime',
        'dikirim_pada' => 'datetime',
        'diterima_pada' => 'datetime',
    ];

    // Relasi ke Pesanan
    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id', 'pesanan_id');
    }

    // Relasi ke AlamatPelanggan
    public function alamat(): BelongsTo
    {
        return $this->belongsTo(AlamatPelanggan::class, 'alamat_pelanggan_id', 'alamat_id');
    }

    // Method untuk update status pengiriman
    public function updateStatus(string $status, array $options = []): bool
    {
        $this->status = $status;
        
        // Update timestamp sesuai status
        switch ($status) {
            case 'dikemas':
                $this->dikemas_pada = now();
                break;
                
            case 'dikirim':
                $this->dikirim_pada = now();
                // Update nomor resi jika disediakan
                if (isset($options['no_resi'])) {
                    $this->no_resi = $options['no_resi'];
                }
                break;
                
            case 'diterima':
                $this->diterima_pada = now();
                break;
        }
        
        return $this->save();
    }
}
