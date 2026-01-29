import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Award, Save, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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

export default function Edit({ jobGrade }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { data, setData, put, processing, errors, reset } = useForm({
        name_ar: jobGrade.name_ar,
        name_en: jobGrade.name_en,
        order: jobGrade.order.toString(),
        is_active: jobGrade.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('job_grades.title'),
            href: '/job-grades',
        },
        {
            title: jobGrade.name_ar,
            href: `/job-grades/${jobGrade.id}`,
        },
        {
            title: t('edit'),
            href: `/job-grades/${jobGrade.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/job-grades/${jobGrade.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('job_grades.edit')} - ${jobGrade.name_ar}`} />

            <div className="flex items-center gap-4 mb-8">
                <Link href={`/job-grades/${jobGrade.id}`}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back')}
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    <h1 className="text-2xl font-bold">{t('job_grades.edit')}</h1>
                </div>
            </div>

            <Card className="p-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        {t('job_grades.details')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name_ar">{t('job_grades.name_ar')} *</Label>
                                <Input
                                    id="name_ar"
                                    value={data.name_ar}
                                    onChange={(e) => setData('name_ar', e.target.value)}
                                    placeholder={t('job_grades.enter_name_ar')}
                                />
                                {errors.name_ar && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>{errors.name_ar}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name_en">{t('job_grades.name_en')} *</Label>
                                <Input
                                    id="name_en"
                                    value={data.name_en}
                                    onChange={(e) => setData('name_en', e.target.value)}
                                    placeholder={t('job_grades.enter_name_en')}
                                />
                                {errors.name_en && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>{errors.name_en}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">{t('job_grades.order')}</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', e.target.value)}
                                    placeholder={t('job_grades.enter_order')}
                                    min="0"
                                />
                                <p className="text-sm text-muted-foreground">
                                    {t('job_grades.order_help')}
                                </p>
                                {errors.order && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>{errors.order}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {t('job_grades.is_active')}
                                    </Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('job_grades.is_active_help')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                {t('required_fields_note')}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Button variant="outline" type="button" onClick={() => reset()}>
                                    {t('reset')}
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? t('saving') : t('save')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}