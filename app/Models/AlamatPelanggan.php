<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlamatPelanggan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'alamat_pelanggan';
    
    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'alamat_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'pelanggan_id',
        'label_alamat',
        'nama_penerima',
        'no_telepon',
        'provinsi_id',
        'provinsi',
        'kota_id',
        'kota',
        'kecamatan_id',
        'kecamatan',
        'kode_pos',
        'alamat_lengkap',
        'is_utama',
        'tipe_alamat',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_utama' => 'boolean',
    ];

    /**
     * Get the pelanggan that owns the alamat.
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id', 'pelanggan_id');
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::saving(function ($alamat) {
            // Jika alamat ini dijadikan utama, nonaktifkan alamat utama lainnya
            if ($alamat->is_utama) {
                $alamat->pelanggan->alamat()
                    ->where('alamat_id', '!=', $alamat->getKey())
                    ->update(['is_utama' => false]);
            }
        });
    }
}
