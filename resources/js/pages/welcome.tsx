import LanguageSwitcher from '@/components/language-switcher';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function Welcome({ canRegister = true, app_title, app_description }: { canRegister?: boolean; app_name?: string; app_title?: string; app_description?: string }) {
    const { auth } = usePage<SharedData>().props;
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <div 
            className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <Head title={t('welcome')} />

            {/* الخلفية المحدثة - أنظف وأكثر عصرية */}
            <div className="fixed inset-0 z-[-1] overflow-hidden">
                <div className={cn(
                    "absolute top-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]",
                    isRTL ? "right-[-5%]" : "left-[-5%]"
                )} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-3">
                        {/* تأكد من مسار الشعار الصحيح */}
                        <img src="/logo.svg" alt="Logo" className="h-8 w-8 object-contain" />
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
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
                                    <LayoutDashboard className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    {t('dashboard')}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hidden sm:inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium hover:bg-accent transition-colors"
                                    >
                                        {t('login')}
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md hover:opacity-90 transition-all"
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
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="text-center space-y-8 max-w-4xl">
                    {/* شعار كبير في المنتصف مع تأثير حركة */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 rounded-full bg-primary/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                            <div className="relative p-4 rounded-2xl bg-card border shadow-2xl">
                                <img src="/logo.svg" alt="Logo" className="h-16 w-16 object-contain animate-float" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground leading-tight">
                            {app_title || 'ERP System'}
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {app_description || 'Enterprise Resource Planning System for advanced management and monitoring.'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                        {!auth.user ? (
                            <>
                                <Button size="lg" variant="outline" className="min-w-[140px] border-2 font-bold hover:bg-primary/5 transition-all" asChild>
                                    <Link href={login()}>{t('login')}</Link>
                                </Button>
                                {canRegister && (
                                    <Button size="lg" className="min-w-[140px] font-bold shadow-xl shadow-primary/20 group transition-all" asChild>
                                        <Link href={register()}>
                                            {t('register')}
                                            <ArrowRight className={cn("h-4 w-4 transition-transform", isRTL ? "mr-2 rotate-180 group-hover:translate-x-[-4px]" : "ml-2 group-hover:translate-x-1")} />
                                        </Link>
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button size="lg" className="min-w-[180px] font-bold shadow-lg" asChild>
                                <Link href={dashboard()}>
                                    <LayoutDashboard className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    {t('dashboard')}
                                </Link>
                            </Button>
                        )}
                    </div>

                   
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
                     <p className="text-xs md:text-sm text-muted-foreground font-medium">
                        &copy; {new Date().getFullYear()} <span className="text-foreground">{app_title}</span>. {t('all_rights_reserved')}
                     </p>
                     <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Support</a>
                     </div>
                </div>
            </footer>

            {/* إضافة انيميشن بسيط للشعار */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}

// Button Component
function Button({ className, variant = 'default', size = 'default', asChild, ...props }: any) {
    const Component = asChild ? 'span' : 'button';
    
    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
    };

    const sizes = {
        default: "h-9 px-4",
        lg: "h-11 px-8",
        xl: "h-12 px-8 text-lg",
    };

    return (
        <Component 
            className={cn(
                "inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50", 
                variants[variant as keyof typeof variants],
                sizes[size as keyof typeof sizes],
                className
            )} 
            {...props} 
        />
    );
}