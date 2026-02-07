import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label'; // تأكد من وجود هذا السطر
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    XCircle,
} from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface JobGrade {
    id: number;
    name_ar: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    jobGrade: JobGrade;
    flash: {
        success?: string;
        error?: string;
        message?: string;
    };
}

export default function Show({ jobGrade, flash }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();

    useEffect(() => {
        if (flash?.success) {
            toast({ title: flash.success, variant: 'success' });
        }
        if (flash?.error) {
            toast({ title: flash.error, variant: 'destructive' });
        }
        if (flash?.message) {
            toast({ title: flash.message, variant: 'success' });
        }
    }, [flash, toast]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('job_grades.title'), href: '/job-grades' },
        {
            title: jobGrade.name_ar,
            href: `/job-grades/${jobGrade.id}`,
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            i18n.language === 'ar' ? 'ar-SA' : 'en-US',
            { year: 'numeric', month: 'long', day: 'numeric' },
        );
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(
            i18n.language === 'ar' ? 'ar-SA' : 'en-US',
            { hour: '2-digit', minute: '2-digit' },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('job_grades.show')} - ${jobGrade.name_ar}`} />

            <div
                className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Action Bar */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/job-grades">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                {isRTL ? (
                                    <ArrowRight className="h-4 w-4" />
                                ) : (
                                    <ArrowLeft className="h-4 w-4" />
                                )}
                                {t('back')}
                            </Button>
                        </Link>
                        <div className="hidden h-6 w-px bg-border sm:block" />
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Details Card */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="overflow-hidden border border-none shadow-sm">
                            <CardHeader className="border-b bg-muted/30 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <Award className="h-5 w-5 text-primary" />
                                    {t('job_grades.details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase italic">
                                            {t('job_grades.name_ar')}
                                        </Label>
                                        <p className="text-lg font-medium text-foreground">
                                            {jobGrade.name_ar}
                                        </p>
                                    </div>

            

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase italic">
                                            {t('job_grades.order')}
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="px-3 py-0 font-mono text-base"
                                            >
                                                {jobGrade.order}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase italic">
                                            {t('job_grades.status')}
                                        </Label>
                                        <div>
                                            <Badge
                                                className={cn(
                                                    'gap-1.5 border-none px-3 py-1 font-semibold shadow-none',
                                                    jobGrade.is_active
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-100',
                                                )}
                                            >
                                                {jobGrade.is_active ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <XCircle className="h-4 w-4" />
                                                )}
                                                {jobGrade.is_active
                                                    ? t('active')
                                                    : t('inactive')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Metadata Card */}
                    <div className="space-y-6">
                        <Card className="border border-none shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                    {t('timestamps')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="flex items-start gap-4 text-start">
                                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-xs text-muted-foreground">
                                            {t('created_at')}
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {formatDate(jobGrade.created_at)}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(jobGrade.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 text-start">
                                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-xs text-muted-foreground">
                                            {t('updated_at')}
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {formatDate(jobGrade.updated_at)}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(jobGrade.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                            <p className="text-center text-xs leading-relaxed text-primary/80 italic">
                                {t('job_grades.show_hint')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
