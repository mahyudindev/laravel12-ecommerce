<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pelanggan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pelanggan';
    
    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'pelanggan_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'no_telepon',
    ];
    
    /**
     * Get all of the alamat for the Pelanggan
     */
    public function alamat()
    {
        return $this->hasMany(AlamatPelanggan::class, 'pelanggan_id', 'pelanggan_id');
    }
    
    /**
     * Get the user's default alamat
     */
    public function alamatUtama()
    {
        return $this->hasOne(AlamatPelanggan::class, 'pelanggan_id', 'pelanggan_id')
            ->where('is_utama', true);
    }
    
    /**
     * The attributes that should be guarded.
     *
     * @var array<string>
     */
    protected $guarded = [];
    
    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($pelanggan) {
            // Set alamat utama jika belum ada
            if (!$pelanggan->alamat()->where('is_utama', true)->exists()) {
                $pelanggan->alamat()->update(['is_utama' => false]);
            }
        });
    }

    /**
     * Get the user that owns the pelanggan.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
