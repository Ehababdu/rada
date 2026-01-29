<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Generate a unique nonce for this request
        $nonce = Str::random(32);

        // Store nonce in request for use in views
        $request->attributes->set('csp_nonce', $nonce);
        view()->share('csp_nonce', $nonce);

        $response = $next($request);

        // Content Security Policy
        $cspDirectives = $this->getCspDirectives($nonce);
        $csp = implode('; ', array_map(
            fn ($key, $value) => "$key $value",
            array_keys($cspDirectives),
            $cspDirectives
        ));

        $response->headers->set('Content-Security-Policy', $csp);

        // HTTP Strict Transport Security (HSTS)
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Prevent clickjacking attacks
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS Protection (legacy, but still useful for older browsers)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy (formerly Feature Policy)
        $permissionsPolicy = [
            'geolocation=()',
            'microphone=()',
            'camera=()',
            'payment=()',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()',
        ];
        $response->headers->set('Permissions-Policy', implode(', ', $permissionsPolicy));

        return $response;
    }

    /**
     * Get Content Security Policy directives based on environment.
     */
    protected function getCspDirectives(string $nonce): array
    {
        $isDevelopment = config('app.env') === 'local';

        // Base directives
        $directives = [
            'default-src' => "'self'",
            'script-src' => $isDevelopment
                ? "'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 http://127.0.0.1:5173 http://localhost:5174 http://127.0.0.1:5174 http://localhost:5175 http://127.0.0.1:5175"
                : "'self' 'nonce-{$nonce}' 'sha256-NeX6BkQ/dL2xGqNL0hx0Qt1D9OBsViVY0GIuBkpTJTQ=' 'sha256-SzlVd60UNZ/TldNgHS9eD898St9DDjMaBZ89PhinRe4=' http://127.0.0.1:5173",
            'style-src' => $isDevelopment
                ? "'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net http://localhost:5173 http://127.0.0.1:5173 http://localhost:5174 http://127.0.0.1:5174 http://localhost:5175 http://127.0.0.1:5175"
                : "'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net",
            'img-src' => "'self' data: blob: https:",
            'font-src' => "'self' data: https://fonts.gstatic.com https://fonts.bunny.net",
            'connect-src' => $isDevelopment
                ? "'self' ws: wss: http://localhost:* http://127.0.0.1:*"
                : "'self'",
            'frame-src' => "'self'",
            'object-src' => "'none'",
            'base-uri' => "'self'",
            'form-action' => "'self'",
            'frame-ancestors' => "'self'",
            'upgrade-insecure-requests' => '',
        ];

        // Remove upgrade-insecure-requests in development
        if ($isDevelopment) {
            unset($directives['upgrade-insecure-requests']);
        }

        return $directives;
    }
}
