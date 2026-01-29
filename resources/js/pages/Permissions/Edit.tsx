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
import { index as permissionsIndex, show as permissionsShow, edit as permissionsEdit, update as permissionsUpdate } from '@/routes/permissions';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
}

interface Props {
    permission: Permission;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Edit({ permission, flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, setData, put, processing, errors, reset } = useForm({
        name: permission.name,
        guard_name: permission.guard_name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(permissionsUpdate(permission.id).url, {
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
            title: permission.name,
            href: permissionsShow(permission.id).url,
        },
        {
            title: t('common.edit'),
            href: permissionsEdit(permission.id).url,
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
            <Head title={`${t('common.edit')} - ${permission.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={permissionsShow(permission.id).url}>
                            <ArrowLeft className="h-4 w-4" />
                            {t('common.back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{t('common.edit')} {permission.name}</h1>
                        <p className="text-muted-foreground">
                            {t('permissions.edit_description')}
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('permissions.edit_form')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        {t('permissions.name')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t('permissions.name_placeholder')}
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
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
                                        onChange={(e) => setData('guard_name', e.target.value)}
                                        placeholder={t('permissions.guard_name_placeholder')}
                                        className={errors.guard_name ? 'border-red-500' : ''}
                                    />
                                    {errors.guard_name && (
                                        <p className="text-sm text-red-500">{errors.guard_name}</p>
                                    )}
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('permissions.guard_name_help')}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        {t('common.update')}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => reset()}>
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