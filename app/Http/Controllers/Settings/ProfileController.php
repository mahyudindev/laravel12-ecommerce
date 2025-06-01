<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $userRole = $user->role;
        $profileData = [];
        
        // Get role-specific data
        if ($user->isPelanggan() && $user->pelanggan) {
            $profileData = [
                'nama_lengkap' => $user->pelanggan->nama_lengkap,
                'no_telepon' => $user->pelanggan->no_telepon,
                'alamat' => $user->pelanggan->alamat,
                'tipe_alamat' => $user->pelanggan->tipe_alamat,
                'kota' => $user->pelanggan->kota,
                'kode_pos' => $user->pelanggan->kode_pos,
                'foto_profil' => $user->pelanggan->foto_profil,
            ];
        } elseif ($user->isAdmin() && $user->admin) {
            $profileData = [
                'nama_lengkap' => $user->admin->nama_lengkap,
                'no_telepon' => $user->admin->no_telepon,
                'jabatan' => $user->admin->jabatan,
                'deskripsi_jabatan' => $user->admin->deskripsi_jabatan,
                'foto_profil' => $user->admin->foto_profil,
            ];
        }
        
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'userRole' => $userRole,
            'profileData' => $profileData,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        
        // Update user email
        if (isset($validated['email']) && $validated['email'] !== $user->email) {
            $user->email = $validated['email'];
            $user->email_verified_at = null;
        }
        
        // Update profile based on user role
        if ($user->isPelanggan() && $user->pelanggan) {
            // Update pelanggan fields
            $pelanggan = $user->pelanggan;
            
            if (isset($validated['nama_lengkap'])) $pelanggan->nama_lengkap = $validated['nama_lengkap'];
            if (isset($validated['no_telepon'])) $pelanggan->no_telepon = $validated['no_telepon'];
            if (isset($validated['alamat'])) $pelanggan->alamat = $validated['alamat'];
            if (isset($validated['tipe_alamat'])) $pelanggan->tipe_alamat = $validated['tipe_alamat'];
            if (isset($validated['kota'])) $pelanggan->kota = $validated['kota'];
            if (isset($validated['kode_pos'])) $pelanggan->kode_pos = $validated['kode_pos'];
            
            // Save pelanggan changes
            $pelanggan->save();
        } elseif (($user->isAdmin() || $user->role === 'owner') && $user->admin) {
            // Update admin/owner fields
            $admin = $user->admin;
            
            if (isset($validated['nama_lengkap'])) $admin->nama_lengkap = $validated['nama_lengkap'];
            if (isset($validated['no_telepon'])) $admin->no_telepon = $validated['no_telepon'];
            
            // Prevent updating jabatan for owners
            if ($user->role !== 'owner' && isset($validated['jabatan'])) {
                $admin->jabatan = $validated['jabatan'];
            }
            
            if (isset($validated['deskripsi_jabatan'])) {
                $admin->deskripsi_jabatan = $validated['deskripsi_jabatan'];
            }
            
            // Save admin/owner changes
            $admin->save();
        }
        
        $user->save();
        
        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
