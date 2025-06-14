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
        Schema::create('produk_gambar', function (Blueprint $table) {
            $table->id('gambar_id');
            $table->foreignId('produk_id')->constrained('produk', 'produk_id')->onDelete('cascade');
            $table->string('nama_file');
            $table->string('path');
            $table->boolean('is_thumbnail')->default(false);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk_gambar');
    }
};
