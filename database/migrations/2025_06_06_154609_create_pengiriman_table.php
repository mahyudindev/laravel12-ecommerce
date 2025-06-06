<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengiriman', function (Blueprint $table) {
            $table->id('pengiriman_id');
            $table->foreignId('pesanan_id')->constrained('pesanan', 'pesanan_id')->onDelete('cascade');
            $table->foreignId('alamat_pelanggan_id')->constrained('alamat_pelanggan', 'alamat_id');
            
            // Informasi kurir
            $table->string('kode_kurir'); // jne, pos, tiki
            $table->string('nama_kurir'); // JNE, POS, TIKI
            $table->string('kode_layanan'); // REG, OKE, dll
            $table->string('nama_layanan'); // Reguler, OKE, dll
            $table->string('keterangan_layanan')->nullable();
            
            // Informasi pengiriman
            $table->integer('berat_gram');
            $table->decimal('biaya', 15, 2);
            $table->string('estimasi'); // Contoh: '1-2 hari'
            $table->string('no_resi')->nullable();
            
            // Status pengiriman
            $table->enum('status', [
                'menunggu_pengiriman',
                'dikemas',
                'dikirim',
                'dalam_perjalanan',
                'diterima',
                'gagal'
            ])->default('menunggu_pengiriman');
            
            // Tanggal penting
            $table->timestamp('dikemas_pada')->nullable();
            $table->timestamp('dikirim_pada')->nullable();
            $table->timestamp('diterima_pada')->nullable();
            
            $table->timestamps();
            
            // Index untuk pencarian
            $table->index('pesanan_id');
            $table->index('no_resi');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengiriman');
    }
};
