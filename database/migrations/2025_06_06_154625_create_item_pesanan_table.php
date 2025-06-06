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
        Schema::create('item_pesanan', function (Blueprint $table) {
            $table->id('item_pesanan_id');
            $table->foreignId('pesanan_id')->constrained('pesanan', 'pesanan_id')->onDelete('cascade');
            $table->foreignId('produk_id')->constrained('produk', 'produk_id');
            
            // Informasi produk
            $table->string('nama_produk');
            $table->string('kode_produk');
            $table->string('gambar')->nullable();
            $table->text('deskripsi_singkat')->nullable();
            
            // Harga dan kuantitas
            $table->integer('jumlah');
            $table->decimal('harga_awal', 15, 2); // Harga asli produk
            $table->decimal('harga_diskon', 15, 2)->default(0); // Jika ada diskon
            $table->decimal('harga_satuan', 15, 2); // Harga setelah diskon
            $table->decimal('subtotal', 15, 2);
            
            // Informasi diskon
            $table->decimal('diskon_persen', 5, 2)->default(0);
            $table->decimal('diskon_nominal', 15, 2)->default(0);
            
            // Informasi varian
            $table->json('varian')->nullable(); // Menyimpan informasi varian jika ada
            
            $table->timestamps();
            
            // Index untuk pencarian
            $table->index('pesanan_id');
            $table->index('produk_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_pesanan');
    }
};
