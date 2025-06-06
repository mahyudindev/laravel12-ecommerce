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
        Schema::create('alamat_pelanggan', function (Blueprint $table) {
            $table->id('alamat_id');
            $table->foreignId('pelanggan_id')->constrained('pelanggan', 'pelanggan_id')->onDelete('cascade');
            $table->string('label_alamat'); // Contoh: Rumah, Kantor, Kos
            $table->string('nama_penerima');
            $table->string('no_telepon', 20);
            $table->integer('provinsi_id');
            $table->string('provinsi');
            $table->integer('kota_id');
            $table->string('kota');
            $table->integer('kecamatan_id')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kode_pos', 10);
            $table->text('alamat_lengkap');
            $table->boolean('is_utama')->default(false);
            $table->enum('tipe_alamat', ['Rumah', 'Kantor', 'Kos']);
            $table->timestamps();
            
            // Add index for better performance
            $table->index('pelanggan_id');
            $table->index('is_utama');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alamat_pelanggan');
    }
};
