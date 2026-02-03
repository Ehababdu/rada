import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // تأخير بسيط لضمان تهيئة الـ sidebar
        const timer = setTimeout(() => setIsInitialized(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    if (!isInitialized) {
        return (
            <div className="flex min-h-screen w-full flex-col">
                <div className="flex-1 opacity-0">{children}</div>
            </div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
