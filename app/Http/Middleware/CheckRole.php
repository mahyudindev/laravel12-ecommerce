<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Inertia\InertiaResponse;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        // If user has the required role, continue
        if ($user->role === $role) {
            return $next($request);
        }
        
        // Redirect based on user's role
        return match($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'owner' => redirect()->route('owner.dashboard'),
            'pelanggan' => redirect()->route('pelanggan.dashboard'),
            default => redirect()->route('home'),
        };
    }
}
