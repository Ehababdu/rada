import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    create as permissionsCreate,
    index as permissionsIndex,
    store as permissionsStore,
} from '@/routes/permissions';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Create({ flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        guard_name: 'web',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(permissionsStore.url(), {
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
            title: t('permissions.title'),
            href: permissionsIndex.url(),
        },
        {
            title: t('permissions.create'),
            href: permissionsCreate.url(),
        },
    ];

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast(flash.success, { variant: 'default' });
        }
        if (flash?.error) {
            toast(flash.error, { variant: 'destructive' });
        }
    }, [flash, toast]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${t('permissions.create')} - ${t('permissions.title')}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={permissionsIndex.url()}>
                            <ArrowLeft className="h-4 w-4" />
                            {t('common.back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('permissions.create')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('permissions.create_description')}
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('permissions.create_form')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        {t('permissions.name')}{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder={t(
                                            'permissions.name_placeholder',
                                        )}
                                        className={
                                            errors.name ? 'border-red-500' : ''
                                        }
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guard_name">
                                        {t('permissions.guard_name')}
                                    </Label>
                                    <Input
                                        id="guard_name"
                                        type="text"
                                        value={data.guard_name}
                                        onChange={(e) =>
                                            setData(
                                                'guard_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'permissions.guard_name_placeholder',
                                        )}
                                        className={
                                            errors.guard_name
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.guard_name && (
                                        <p className="text-sm text-red-500">
                                            {errors.guard_name}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('permissions.guard_name_help')}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {t('common.create')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => reset()}
                                    >
                                        {t('common.reset')}
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
