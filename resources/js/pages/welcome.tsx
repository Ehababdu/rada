import LanguageSwitcher from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Welcome({
    canRegister = true,
    app_title,
    app_description,
}: {
    canRegister?: boolean;
    app_name?: string;
    app_title?: string;
    app_description?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <div
            className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <Head title={t('welcome')} />

            {/* الخلفية المحدثة - أنظف وأكثر عصرية */}
            <div className="fixed inset-0 z-[-1] overflow-hidden">
                <div
                    className={cn(
                        'absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]',
                        isRTL ? 'right-[-5%]' : 'left-[-5%]',
                    )}
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-3">
                        {/* تأكد من مسار الشعار الصحيح */}
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-8 w-8 object-contain"
                        />
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                            {app_title || 'ERP System'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-95"
                                >
                                    <LayoutDashboard
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('dashboard')}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hidden h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors hover:bg-accent sm:inline-flex"
                                    >
                                        {t('login')}
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md transition-all hover:opacity-90"
                                        >
                                            {t('register')}
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
                <div className="max-w-4xl space-y-8 text-center">
                    {/* شعار كبير في المنتصف مع تأثير حركة */}
                    <div className="flex justify-center">
                        <div className="group relative">
                            <div className="absolute -inset-1 rounded-full bg-primary/20 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
                            <div className="relative rounded-2xl border bg-card p-4 shadow-2xl">
                                <img
                                    src="/logo.svg"
                                    alt="Logo"
                                    className="animate-float h-16 w-16 object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl leading-tight font-black tracking-tighter text-foreground uppercase md:text-6xl">
                            {app_title || 'ERP System'}
                        </h1>
                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            {app_description ||
                                'Enterprise Resource Planning System for advanced management and monitoring.'}
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                        {!auth.user ? (
                            <>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="min-w-[140px] border-2 font-bold transition-all hover:bg-primary/5"
                                    asChild
                                >
                                    <Link href={login()}>{t('login')}</Link>
                                </Button>
                                {canRegister && (
                                    <Button
                                        size="lg"
                                        className="group min-w-[140px] font-bold shadow-xl shadow-primary/20 transition-all"
                                        asChild
                                    >
                                        <Link href={register()}>
                                            {t('register')}
                                            <ArrowRight
                                                className={cn(
                                                    'h-4 w-4 transition-transform',
                                                    isRTL
                                                        ? 'mr-2 rotate-180 group-hover:translate-x-[-4px]'
                                                        : 'ml-2 group-hover:translate-x-1',
                                                )}
                                            />
                                        </Link>
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                size="lg"
                                className="min-w-[180px] font-bold shadow-lg"
                                asChild
                            >
                                <Link href={dashboard()}>
                                    <LayoutDashboard
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('dashboard')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card/20 backdrop-blur-sm">
                <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row">
                    <p className="text-xs font-medium text-muted-foreground md:text-sm">
                        &copy; {new Date().getFullYear()}{' '}
                        <span className="text-foreground">{app_title}</span>.{' '}
                        {t('all_rights_reserved')}
                    </p>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground md:text-sm">
                        <a
                            href="#"
                            className="transition-colors hover:text-primary"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="transition-colors hover:text-primary"
                        >
                            Support
                        </a>
                    </div>
                </div>
            </footer>

            {/* animation moved to global CSS */}
        </div>
    );
}
