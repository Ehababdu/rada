import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    create as employmentStatusesCreate,
    index as employmentStatusesIndex,
    store as employmentStatusesStore,
} from '@/routes/employment-statuses';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface Props {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Create({ flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    useEffect(() => {
        if (flash?.success) {
            toast({ title: flash.success, variant: 'success' });
        }
        if (flash?.error) {
            toast({ title: flash.error, variant: 'destructive' });
        }
    }, [flash, toast]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(employmentStatusesStore.url());
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('employment_statuses.title'),
            href: employmentStatusesIndex.url(),
        },
        {
            title: t('employment_statuses.create'),
            href: employmentStatusesCreate.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employment_statuses.create')} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={employmentStatusesIndex.url()}>
                            <ArrowLeft className="h-4 w-4" />
                            {t('back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('employment_statuses.create')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('employment_statuses.create_description')}
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('employment_statuses.form')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        {t('employment_statuses.name')} *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder={t(
                                            'employment_statuses.name_placeholder',
                                        )}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {t('create')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link
                                            href={employmentStatusesIndex.url()}
                                        >
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
