import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

interface EmploymentStatus {
    id: number;
    name: string;
}

interface Props {
    employmentStatus: EmploymentStatus;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Edit({ employmentStatus, flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, setData, put, processing, errors } = useForm({
        name: employmentStatus.name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/employment-statuses/${employmentStatus.id}`, {
            onSuccess: () => {
                toast(t('success'), {
                    variant: 'default',
                });
            },
            onError: () => {
                toast(t('error'), {
                    variant: 'destructive',
                });
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('employment_statuses.title'),
            href: '/employment-statuses',
        },
        {
            title: employmentStatus.name,
            href: `/employment-statuses/${employmentStatus.id}`,
        },
        {
            title: t('edit'),
            href: `/employment-statuses/${employmentStatus.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('edit')} ${employmentStatus.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/employment-statuses/${employmentStatus.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                            {t('back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{t('edit')} {employmentStatus.name}</h1>
                        <p className="text-muted-foreground">
                            {t('employment_statuses.edit_description')}
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('employment_statuses.form')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('employment_statuses.name')} *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t('employment_statuses.name_placeholder')}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        {t('save')}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={`/employment-statuses/${employmentStatus.id}`}>
                                            {t('cancel')}
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}