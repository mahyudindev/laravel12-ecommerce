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
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id('pesanan_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('pelanggan_id')->constrained('pelanggan', 'pelanggan_id')->onDelete('cascade');
            $table->foreignId('alamat_pengiriman_id')->constrained('alamat_pelanggan', 'alamat_id');
            
            $table->string('no_pesanan')->unique();
            $table->date('tanggal_pesanan');
            
            // Informasi pembayaran
            $table->decimal('total_harga', 15, 2);
            $table->decimal('ongkos_kirim', 15, 2)->default(0);
            $table->decimal('total_akhir', 15, 2);
            
            // Status pesanan
            $table->enum('status', [
                'menunggu_pembayaran', 
                'diproses', 
                'dikirim', 
                'selesai', 
                'dibatalkan'
            ])->default('menunggu_pembayaran');
            
            // Informasi pembayaran
            $table->string('metode_pembayaran')->nullable(); // midtrans, transfer_manual, dll
            $table->string('status_pembayaran')->default('pending'); // pending, paid, failed, expired
            $table->string('snap_token')->nullable(); // Untuk Midtrans
            $table->json('metadata')->nullable(); // Menyimpan data tambahan
            
            // Informasi tambahan
            $table->text('catatan')->nullable();
            
            $table->timestamps();
            
            // Index untuk pencarian
            $table->index('no_pesanan');
            $table->index('status');
            $table->index('status_pembayaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
