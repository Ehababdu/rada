import AppLogoIcon from './app-logo-icon';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function AppLogo() {
    const { name } = usePage<SharedData>().props;

    return (
        <>
            <div className="group relative flex aspect-square size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Pulse animation ring */}
                <div className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-md" />

                <AppLogoIcon className="relative size-7 fill-current text-white drop-shadow-lg transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-sm font-bold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                    {name}
                </span>
                <span className="text-xs text-muted-foreground/70">نظام الإدارة</span>
            </div>
        </>
    );
}
