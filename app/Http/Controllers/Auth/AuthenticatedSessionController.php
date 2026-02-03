<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Contracts\Session\Session as SessionContract;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $throttleKey = $request->throttleKey();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'message' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => (int) ceil($seconds / 60),
                ]),
            ], 429);
        }

        $user = User::where('email', $request->string('email'))->first();

        if ($user !== null && $this->twoFactorEnabled($user)) {
            if (! Auth::validate($request->only('email', 'password'))) {
                $this->handleFailedLogin($request);
            }

            $session = $this->ensureSession($request);
            $session->put('login.id', $user->id);
            $session->put('login.remember', $request->boolean('remember'));

            RateLimiter::clear($throttleKey);

            return redirect()->route('two-factor.login');
        }

        $request->authenticate();

        $this->ensureSession($request)->regenerate();

        RateLimiter::clear($throttleKey);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $session = $request->hasSession() ? $request->session() : null;

        if ($session !== null) {
            $session->invalidate();
            $session->regenerateToken();
        }

        return redirect()->route('home');
    }

    private function twoFactorEnabled(User $user): bool
    {
        return ! empty($user->two_factor_secret) && $user->two_factor_confirmed_at !== null;
    }

    private function ensureSession(Request $request): SessionContract
    {
        if ($request->hasSession()) {
            return $request->session();
        }

        $session = app('session')->driver();
        $session->start();
        $request->setLaravelSession($session);

        return $session;
    }

    /**
     * @throws ValidationException
     */
    private function handleFailedLogin(LoginRequest $request): never
    {
        RateLimiter::hit($request->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.failed'),
        ]);
    }
}
