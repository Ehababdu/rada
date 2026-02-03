// @ts-expect-error tailwindcss vite plugin is not typed
import tailwindcss from '@tailwindcss/vite';
// @ts-expect-error react vite plugin is not typed
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
        }),
        tailwindcss(),
        // wayfinder({
        //     formVariants: true,
        // }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
        },
    },
    esbuild: {
    },
    resolve: {
        alias: {
            'node:url': 'url',
            'node:path': 'path',
            'node:fs': 'fs',
            'node:process': 'process',
        },
    },
});

