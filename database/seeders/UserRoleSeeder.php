<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks to avoid constraint issues
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing data
        User::truncate();
        Admin::truncate();
        Pelanggan::truncate();
        
        // Create Admin
        $adminUser = User::create([
            'email' => 'mahyudin@gmail.com',
            'password' => Hash::make('123'),
            'role' => 'admin',
            'is_active' => true,
        ]);
        
        Admin::create([
            'user_id' => $adminUser->user_id,
            'nama_lengkap' => 'Mahyudin Admin',
            'no_telepon' => '081234567890',
            'jabatan' => 'admin',
            'deskripsi_jabatan' => 'System Administrator',
        ]);
        
        // Create Owner
        $ownerUser = User::create([
            'email' => 'rio@gmail.com',
            'password' => Hash::make('123'),
            'role' => 'admin',
            'is_active' => true,
        ]);
        
        $owner = Admin::create([
            'user_id' => $ownerUser->user_id,
            'nama_lengkap' => 'Rio Owner',
            'no_telepon' => '081234567891',
            'jabatan' => 'owner',
            'deskripsi_jabatan' => 'Pemilik Toko',
        ]);
        
        // Create Pelanggan
        $pelangganUser = User::create([
            'email' => 'user@gmail.com',
            'password' => Hash::make('123'),
            'role' => 'pelanggan',
            'is_active' => true,
        ]);
        
        $pelanggan = Pelanggan::create([
            'user_id' => $pelangganUser->user_id,
            'nama_lengkap' => 'Pelanggan User',
            'no_telepon' => '081234567892',
        ]);
        
        // Buat alamat untuk pelanggan
        $pelanggan->alamat()->create([
            'label_alamat' => 'Rumah',
            'nama_penerima' => 'Pelanggan User',
            'no_telepon' => '081234567892',
            'provinsi_id' => 6, // ID DKI Jakarta
            'provinsi' => 'DKI Jakarta',
            'kota_id' => 151, // ID Kota Jakarta Selatan
            'kota' => 'Jakarta Selatan',
            'kecamatan_id' => 2076, // ID Kecamatan Kebayoran Baru
            'kecamatan' => 'Kebayoran Baru',
            'kode_pos' => '12120',
            'alamat_lengkap' => 'Jl. Contoh No. 123, RT 01 RW 02',
            'is_utama' => true,
            'tipe_alamat' => 'Rumah',
        ]);
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin: mahyudin@gmail.com / 123');
        $this->command->info('Owner: rio@gmail.com / 123');
        $this->command->info('Pelanggan: user@gmail.com / 123');
    }
}
