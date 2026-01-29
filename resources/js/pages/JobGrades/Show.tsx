import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label'; // تأكد من وجود هذا السطر
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Award, Edit, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobGrade {
    id: number;
    name_ar: string;
    name_en: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    jobGrade: JobGrade;
}

export default function Show({ jobGrade }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('job_grades.title'), href: '/job-grades' },
        { title: isRTL ? jobGrade.name_ar : jobGrade.name_en, href: `/job-grades/${jobGrade.id}` },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            i18n.language === 'ar' ? 'ar-SA' : 'en-US',
            { year: 'numeric', month: 'long', day: 'numeric' }
        );
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(
            i18n.language === 'ar' ? 'ar-SA' : 'en-US',
            { hour: '2-digit', minute: '2-digit' }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('job_grades.show')} - ${jobGrade.name_ar}`} />

            <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/job-grades">
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                                {t('back')}
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {isRTL ? jobGrade.name_ar : jobGrade.name_en}
                        </h1>
                    </div>
                    
                    <Button asChild className="gap-2 shadow-sm">
                        <Link href={`/job-grades/${jobGrade.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            {t('edit')}
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm overflow-hidden border">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    {t('job_grades.details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold italic">
                                            {t('job_grades.name_ar')}
                                        </Label>
                                        <p className="text-lg font-medium text-foreground">{jobGrade.name_ar}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold italic">
                                            {t('job_grades.name_en')}
                                        </Label>
                                        <p className="text-lg font-medium text-foreground">{jobGrade.name_en}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold italic">
                                            {t('job_grades.order')}
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-base px-3 py-0 font-mono">
                                                {jobGrade.order}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold italic">
                                            {t('job_grades.status')}
                                        </Label>
                                        <div>
                                            <Badge className={cn(
                                                "gap-1.5 px-3 py-1 shadow-none border-none font-semibold",
                                                jobGrade.is_active 
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                            )}>
                                                {jobGrade.is_active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                {jobGrade.is_active ? t('active') : t('inactive')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Metadata Card */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-sm border">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    {t('timestamps')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex gap-4 items-start text-start">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground block mb-1">{t('created_at')}</Label>
                                        <p className="text-sm font-medium">{formatDate(jobGrade.created_at)}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(jobGrade.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start text-start">
                                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground block mb-1">{t('updated_at')}</Label>
                                        <p className="text-sm font-medium">{formatDate(jobGrade.updated_at)}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(jobGrade.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <p className="text-xs text-primary/80 leading-relaxed italic text-center">
                                {t('job_grades.show_hint')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}