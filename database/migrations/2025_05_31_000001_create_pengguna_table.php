<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePenggunaTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengguna', function (Blueprint $table) {
            $table->id('pengguna_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->string('nama_lengkap');
            $table->string('no_telepon', 20);
            $table->string('foto_profil')->nullable();
            $table->text('alamat');
            $table->enum('tipe_alamat', ['Rumah', 'Kantor', 'Kos']);
            $table->string('kota')->nullable();
            $table->string('kode_pos', 10)->nullable();
            $table->timestamps();
            
            // Add index for better performance
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengguna');
    }
}
