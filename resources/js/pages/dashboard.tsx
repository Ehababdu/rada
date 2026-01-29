import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Users, Award, Receipt, TrendingUp, FileCheck, UserPlus, Bell, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// الهوك الخاص بالعد التصاعدي
function useCountUp(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number;
        let animationFrame: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);
    return count;
}

interface DashboardProps {
    stats: {
        totalMartyrs: number;
        promotionsDueThisYear: number;
        totalReceiptsThisYear: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    const martyrsCount = useCountUp(stats.totalMartyrs, 1500);
    const promotionsCount = useCountUp(stats.promotionsDueThisYear, 1500);
    const receiptsCount = useCountUp(stats.totalReceiptsThisYear, 2000);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard'), href: dashboard().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard')} />
            
            {/* الخلفية المائية المتفاعلة مع الوضعين */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
                    <img src="/favicon.jpg" alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale invert dark:invert-0" />
                </div>
            </div>

            <div className="relative z-10 flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                {/* الترحيب */}
                <header className={cn("transition-all duration-700 delay-100", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4")}>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        {t('لوحة التحكم')}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">نظرة شاملة على بيانات المنظومة وتحديثاتها.</p>
                </header>

                {/* كروت الإحصائيات */}
                <div className="grid gap-6 md:grid-cols-3">
                    <StatCard 
                        title="عدد الشهداء الكلي"
                        value={martyrsCount}
                        icon={Users}
                        variant="blue"
                        isVisible={isVisible}
                        delay="100ms"
                    />
                    <StatCard 
                        title="ترقيات العام المستحقة"
                        value={promotionsCount}
                        icon={Award}
                        variant="amber"
                        isVisible={isVisible}
                        delay="200ms"
                        subContent={stats.promotionsDueThisYear > 0 ? "تنبيه: توجد ملفات تحتاج مراجعة" : "لا توجد ترقيات معلقة"}
                    />
                    <StatCard 
                        title="إجمالي الإيصالات المالية"
                        value={receiptsCount}
                        icon={Receipt}
                        variant="green"
                        isVisible={isVisible}
                        delay="300ms"
                        isCurrency
                    />
                </div>

                {/* القسم السفلي: إجراءات ونشاطات */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className={cn("lg:col-span-2 transition-all duration-700 delay-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                        <div className="h-full rounded-3xl border border-border bg-card/40 p-8 backdrop-blur-md shadow-sm">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <Activity className="text-primary size-5" />
                                وصول سريع
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-3">
                                <QuickAction icon={UserPlus} title="شهيد جديد" href="#" color="bg-blue-500" />
                                <QuickAction icon={FileCheck} title="مراجعة ملفات" href="#" color="bg-purple-500" />
                                <QuickAction icon={TrendingUp} title="الإحصائيات" href="#" color="bg-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className={cn("transition-all duration-700 delay-700", isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")}>
                        <div className="h-full rounded-3xl border border-border bg-card/40 p-8 backdrop-blur-md shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-foreground">
                                <Bell className="text-primary size-5" />
                                التنبيهات الأخيرة
                            </h2>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="mt-1 size-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground/90">تحديث في رتبة الشهيد #2041</p>
                                            <p className="text-xs text-muted-foreground italic">منذ 15 دقيقة</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer { 100% { transform: translateX(100%); } }
                .animate-shimmer { animation: shimmer 2s infinite linear; }
            `}</style>
        </AppLayout>
    );
}

// مكون كرت الإحصائيات (متوافق مع شادكان والوضع الداكن)
function StatCard({ title, value, icon: Icon, variant, isVisible, delay, subContent, isCurrency }: any) {
    const variants: any = {
        blue: "text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10",
        amber: "text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10",
        green: "text-green-600 dark:text-green-400 border-green-200/50 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10",
    };

    return (
        <div 
            className={cn(
                "group relative overflow-hidden rounded-[2rem] border p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5",
                variants[variant],
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: delay }}
        >
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent opacity-0 group-hover:animate-shimmer" />
            
            <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className={cn("p-3 rounded-2xl bg-background shadow-sm border border-border group-hover:scale-110 transition-transform")}>
                        <Icon className="size-6" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black mt-1 tracking-tighter text-foreground tabular-nums">
                        {isCurrency ? new Intl.NumberFormat('ar-LY', { style: 'currency', currency: 'LYD' }).format(value) : value}
                    </h3>
                    {subContent && <p className="text-[10px] mt-2 font-medium opacity-70 italic">{subContent}</p>}
                </div>
            </div>
        </div>
    );
}

// مكون الإجراء السريع
function QuickAction({ icon: Icon, title, href, color }: any) {
    return (
        <Link 
            href={href} 
            className="group flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all duration-300 shadow-sm"
        >
            <div className={cn("p-4 rounded-2xl text-white shadow-lg group-hover:rotate-6 transition-transform", color)}>
                <Icon className="size-6" />
            </div>
            <span className="font-bold text-sm">{title}</span>
        </Link>
    );
}