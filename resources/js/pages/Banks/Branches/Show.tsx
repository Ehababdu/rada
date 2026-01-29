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
import { ArrowLeft, ArrowRight, MapPin, Edit, Calendar, Clock, Building2, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bank {
    id: number;
    name_ar: string;
}

interface Branch {
    id: number;
    name_ar: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    bank: Bank;
    branch: Branch;
}

export default function Show({ bank, branch }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banks.title'), href: '/banks' },
        { title: bank.name_ar, href: `/banks/${bank.id}` },
        { title: t('branches.title'), href: `/banks/${bank.id}/branches` },
        { title: branch.name_ar, href: `/banks/${bank.id}/branches/${branch.id}` },
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
            <Head title={`${branch.name_ar} - ${bank.name_ar}`} />

            <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href={`/banks/${bank.id}/branches`}>
                                {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold tracking-tight">{branch.name_ar}</h1>
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 italic">
                                    <Building2 className="h-3 w-3 mr-1 ml-1" />
                                    {bank.name_ar}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{t('branches.branch_details_view')}</p>
                        </div>
                    </div>

                    <Button asChild className="shadow-sm">
                        <Link href={`/banks/${bank.id}/branches/${branch.id}/edit`}>
                            <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                            {t('edit')}
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Branch Basic Info */}
                        <Card className="shadow-sm border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary font-bold">
                                    <MapPin className="h-5 w-5" />
                                    {t('branches.basic_information')}
                                </CardTitle>
                                <CardDescription>{t('branches.basic_info_description')}</CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-muted-foreground">{t('branches.name_ar')}</span>
                                        <span className="text-lg font-semibold">{branch.name_ar}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-muted-foreground">{t('branches.status')}</span>
                                        <div>
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10">
                                                {t('active')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Parent Bank Info Card */}
                        <Card className="shadow-sm border-none bg-muted/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {t('banks.parent_bank')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-background border flex items-center justify-center shadow-sm">
                                            <Building2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg leading-none">{bank.name_ar}</p>
                                            <Link 
                                                href={`/banks/${bank.id}`} 
                                                className="text-xs text-primary hover:underline mt-1 inline-block"
                                            >
                                                {t('banks.view_bank_details')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Area (Metadata) */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-none overflow-hidden">
                            <CardHeader className="bg-muted/50 pb-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                                    <Activity className="h-4 w-4" />
                                    {t('system_log')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t('created_at')}</p>
                                        <p className="text-sm font-medium">{formatDate(branch.created_at)}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(branch.created_at)}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t('updated_at')}</p>
                                        <p className="text-sm font-medium">{formatDate(branch.updated_at)}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(branch.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Action Footer */}
                        <div className="px-2">
                             <Button variant="outline" className="w-full text-muted-foreground hover:text-primary transition-colors" asChild>
                                <Link href={`/banks/${bank.id}/branches/${branch.id}/edit`}>
                                    <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                    {t('branches.modify_branch_data')}
                                </Link>
                             </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}