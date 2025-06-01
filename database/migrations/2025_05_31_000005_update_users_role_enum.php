<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        
        DB::table('users')->where('role', 'pengguna')->update(['role' => 'pelanggan']);
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the data changes
        DB::table('users')->where('role', 'pelanggan')->update(['role' => 'pengguna']);
    }
};
