<?php

namespace App\Http\Controllers;

use App\Http\Controllers\CartController;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials, true)) {
            return back()->withErrors(['email' => 'Invalid credentials provided.']);
        }

        $user = Auth::user();
        
        // Add pending cart item if exists
        $this->addPendingCartItem($user);

        $request->session()->regenerate();

        return redirect()->intended(
            $user->isAdmin() ? route('admin.dashboard') : route('home')
        )->with('success', 'Welcome back.');
    }

    public function register(RegisterRequest $request): RedirectResponse
    {
        $user = User::create($request->validated());
        $user->cart()->create();

        Auth::login($user);
        
        // Add pending cart item if exists
        $this->addPendingCartItem($user);
        
        $request->session()->regenerate();

        return redirect()->route('home')->with('success', 'Account created successfully.');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Signed out successfully.');
    }

    /**
     * Add pending cart item to user cart after login
     */
    private function addPendingCartItem($user)
    {
        // This will be handled via JavaScript session storage
        // We'll create a JavaScript function to handle this after successful login
        // For now, we'll just return the user to their intended destination
        // The actual cart addition will be handled in the frontend
    }
}
