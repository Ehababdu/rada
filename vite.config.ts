// @ts-ignore
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '../',
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        // wayfinder({
        //     formVariants: true,
        // }),
    ],
    server: {
        host: '127.0.0.1',
    },
    esbuild: {
        jsx: 'automatic',
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

