import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Icons
import { ArrowLeft, Award, Save } from 'lucide-react';

// Layout
import AppLayout from '@/layouts/app-layout';

// Hooks
import { useToast } from '@/hooks/use-toast';

// Types
import type { JobGrade } from './types/job-grade';

// React
import { useEffect } from 'react';

interface Props {
    jobGrade: JobGrade;
}

export default function Edit({ jobGrade }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { toast } = useToast();

    const { flash } = usePage().props as any;

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

    const { data, setData, put, processing, errors } = useForm({
        name_ar: jobGrade.name_ar,
        order: jobGrade.order.toString(),
        is_active: jobGrade.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/job-grades/${jobGrade.id}`);
    };

    // Breadcrumbs
    const breadcrumbs = [
        { title: t('dashboard.title'), href: '/dashboard' },
        { title: t('job_grades.title'), href: '/job-grades' },
        { title: jobGrade.name_ar, href: `/job-grades/${jobGrade.id}` },
        { title: t('job_grades.edit'), href: `/job-grades/${jobGrade.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('job_grades.edit')} - ${jobGrade.name_ar}`} />

            <div
                className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/job-grades/${jobGrade.id}`}>
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
                                {t('job_grades.edit')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('job_grades.edit_description')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('job_grades.job_grade_details')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name AR */}
                            <div className="space-y-2">
                                <Label htmlFor="name_ar">{t('job_grades.name_ar')}</Label>
                                <Input
                                    id="name_ar"
                                    type="text"
                                    placeholder={t('job_grades.name_ar_placeholder')}
                                    value={data.name_ar}
                                    onChange={(e) => setData('name_ar', e.target.value)}
                                />
                                {errors.name_ar && (
                                    <p className="text-sm text-destructive">{errors.name_ar}</p>
                                )}
                            </div>

                            {/* Order */}
                            <div className="space-y-2">
                                <Label htmlFor="order">{t('job_grades.order')}</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    placeholder={t('job_grades.order_placeholder')}
                                    value={data.order}
                                    onChange={(e) => setData('order', e.target.value)}
                                    min="0"
                                />
                                {errors.order && (
                                    <p className="text-sm text-destructive">{errors.order}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="is_active">{t('job_grades.status')}</Label>
                                <Select
                                    value={data.is_active ? '1' : '0'}
                                    onValueChange={(value) => setData('is_active', value === '1')}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">{t('active')}</SelectItem>
                                        <SelectItem value="0">{t('inactive')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.is_active && (
                                    <p className="text-sm text-destructive">{errors.is_active}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6">
                                <Button variant="outline" asChild>
                                    <Link href={`/job-grades/${jobGrade.id}`}>{t('cancel')}</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? t('saving') : t('save')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}