import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Icons
import { ArrowLeft, ArrowRight, Building2, Edit, MapPin, Calendar, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bank {
    id: number;
    name_ar: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    bank: Bank;
}

export default function Show({ bank }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banks.title'), href: '/banks' },
        { title: bank.name_ar, href: `/banks/${bank.id}` },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={bank.name_ar} />

            <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href="/banks">
                                {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold tracking-tight">{bank.name_ar}</h1>
                                <Badge variant="secondary" className="font-mono text-xs">ID: {bank.id}</Badge>
                            </div>
                            <p className="text-muted-foreground">{t('banks.bank_details_view')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/banks/${bank.id}/edit`}>
                                <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                {t('edit')}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/banks/${bank.id}/branches`}>
                                <MapPin className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                {t('branches.manage_branches')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Info Card */}
                    <Card className="lg:col-span-2 shadow-sm border-none bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Building2 className="h-5 w-5" />
                                {t('banks.basic_information')}
                            </CardTitle>
                            <CardDescription>{t('banks.information_stored_in_system')}</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-muted-foreground">{t('banks.name_ar')}</span>
                                    <span className="text-xl font-semibold">{bank.name_ar}</span>
                                </div>
                                {/* يمكنك إضافة حقول أخرى هنا مستقبلاً */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata & Stats Card */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-none">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                                    <Activity className="h-4 w-4" />
                                    {t('banks.system_log')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">{t('created_at')}</p>
                                        <p className="text-sm font-medium">{formatDate(bank.created_at)}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(bank.created_at)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">{t('updated_at')}</p>
                                        <p className="text-sm font-medium">{formatDate(bank.updated_at)}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(bank.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card className="shadow-sm border-none bg-primary/5 border-primary/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('actions')}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Button variant="secondary" className="w-full justify-start bg-background shadow-sm" asChild>
                                    <Link href={`/banks/${bank.id}/branches`}>
                                        <MapPin className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                        {t('branches.manage_branches')}
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-background shadow-sm text-destructive hover:text-destructive" asChild>
                                    <Link href={`/banks/${bank.id}/edit`}>
                                        <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                        {t('edit')}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}