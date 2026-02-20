import { useEffect, useState } from 'react';
import { Toaster as Sonner } from "sonner"
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { appearance = 'system' } = useAppearance();
    const [dir, setDir] = useState<'rtl' | 'ltr'>((document.documentElement.dir as 'rtl' | 'ltr') || 'ltr');

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const currentDir = (document.documentElement.dir as 'rtl' | 'ltr') || 'ltr';
            setDir(currentDir);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

        return () => observer.disconnect();
    }, []);

    return (
        <Sonner
            theme={appearance as ToasterProps["theme"]}
            className="toaster group"
            position={dir === 'rtl' ? 'top-left' : 'top-right'}
            dir={dir}
            richColors
            closeButton
            visibleToasts={1}
            toastOptions={{
                duration: 4000,
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:font-sans",
                    description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-medium",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-medium",
                    closeButton: cn(
                        "group-[.toast]:opacity-0 group-hover/[.toast]:opacity-100 transition-opacity !bg-background !border-border !text-foreground shadow-sm",
                        dir === 'rtl' ? "!right-auto !left-[-6px] !top-[-6px]" : "!left-auto !right-[-6px] !top-[-6px]"
                    ),
                    success: "group-[.toaster]:!bg-green-500/10 group-[.toaster]:!text-green-600 group-[.toaster]:!border-green-500/20",
                    error: "group-[.toaster]:!bg-red-500/10 group-[.toaster]:!text-red-600 group-[.toaster]:!border-red-500/20",
                    warning: "group-[.toaster]:!bg-yellow-500/10 group-[.toaster]:!text-yellow-600 group-[.toaster]:!border-yellow-500/20",
                    info: "group-[.toaster]:!bg-blue-500/10 group-[.toaster]:!text-blue-600 group-[.toaster]:!border-blue-500/20",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
