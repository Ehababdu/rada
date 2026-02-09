import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

// Icons
import { ArrowLeft, Award, Edit } from 'lucide-react';

// Layout
import AppLayout from '@/layouts/app-layout';

// Types
import type { JobGrade } from './types/job-grade';

interface Props {
    jobGrade: JobGrade;
}

export default function Show({ jobGrade }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // Breadcrumbs
    const breadcrumbs = [
        { title: t('dashboard.title'), href: '/dashboard' },
        { title: t('job_grades.title'), href: '/job-grades' },
        { title: jobGrade.name_ar, href: `/job-grades/${jobGrade.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('job_grades.job_grade_details')} - ${jobGrade.name_ar}`} />

            <div
                className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/job-grades">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('back')}
                            </Link>
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <Award className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {jobGrade.name_ar}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('job_grades.job_grade_details')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/job-grades/${jobGrade.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('job_grades.edit')}
                        </Link>
                    </Button>
                </div>

                {/* Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('job_grades.job_grade_information')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Name AR */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('job_grades.name_ar')}
                                </Label>
                                <p className="text-lg font-semibold">{jobGrade.name_ar}</p>
                            </div>

                            {/* Order */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('job_grades.order')}
                                </Label>
                                <p className="text-lg font-semibold">{jobGrade.order}</p>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('job_grades.status')}
                                </Label>
                                <Badge variant={jobGrade.is_active ? 'default' : 'secondary'}>
                                    {jobGrade.is_active ? t('active') : t('inactive')}
                                </Badge>
                            </div>

                            {/* Created At */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('created_at')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {new Date(jobGrade.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Updated At */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('updated_at')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {new Date(jobGrade.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}