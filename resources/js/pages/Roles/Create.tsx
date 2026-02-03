import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    create as rolesCreate,
    index as rolesIndex,
    store as rolesStore,
} from '@/routes/roles';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    permissions: Permission[];
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Create({ permissions, flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        display_name: '',
        description: '',
        guard_name: 'web',
        permissions: [] as string[],
    });

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        [],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(rolesStore.url(), {
            onSuccess: () => {
                toast({
                    title: t('common.success'),
                    description: t(
                        'roles.created_successfully',
                        'تم إنشاء الدور بنجاح',
                    ),
                });
            },
            onError: () => {
                toast({
                    title: t('common.error'),
                    description: t('roles.create_failed', 'فشل في إنشاء الدور'),
                    variant: 'destructive',
                });
            },
        });
    };

    const handlePermissionChange = (
        permissionName: string,
        checked: boolean,
    ) => {
        const newSelected = checked
            ? [...selectedPermissions, permissionName]
            : selectedPermissions.filter((p) => p !== permissionName);

        setSelectedPermissions(newSelected);
        setData('permissions', newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        const allPermissions = checked ? permissions.map((p) => p.name) : [];
        setSelectedPermissions(allPermissions);
        setData('permissions', allPermissions);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('roles.title', 'الأدوار'),
            href: rolesIndex.url(),
        },
        {
            title: t('roles.create', 'إنشاء دور'),
            href: rolesCreate.url(),
        },
    ];

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: t('common.success'),
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast({
                title: t('common.error'),
                description: flash.error,
                variant: 'destructive',
            });
        }
    }, [flash, toast, t]);

    // Group permissions by resource
    const groupedPermissions = permissions.reduce(
        (acc, permission) => {
            const resource = permission.name.split('.')[0];
            if (!acc[resource]) {
                acc[resource] = [];
            }
            acc[resource].push(permission);
            return acc;
        },
        {} as Record<string, Permission[]>,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${t('roles.create', 'إنشاء دور')} - ${t('roles.title', 'الأدوار')}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={rolesIndex.url()}>
                            <ArrowLeft className="h-4 w-4" />
                            {t('common.back', 'العودة')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('roles.create', 'إنشاء دور')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t(
                                'roles.create_description',
                                'إنشاء دور جديد وتحديد الصلاحيات المرتبطة به',
                            )}
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'roles.basic_info',
                                        'المعلومات الأساسية',
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            {t('roles.name', 'اسم الدور')}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="مثال: admin, editor"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="display_name">
                                            {t(
                                                'roles.display_name',
                                                'الاسم المعروض',
                                            )}
                                        </Label>
                                        <Input
                                            id="display_name"
                                            type="text"
                                            value={data.display_name}
                                            onChange={(e) =>
                                                setData(
                                                    'display_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="مثال: مدير النظام"
                                        />
                                        {errors.display_name && (
                                            <p className="text-sm text-red-500">
                                                {errors.display_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        {t('roles.description', 'الوصف')}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="وصف مختصر للدور ومسؤولياته"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('roles.permissions', 'الصلاحيات')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="select-all"
                                            checked={
                                                selectedPermissions.length ===
                                                permissions.length
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                        <Label
                                            htmlFor="select-all"
                                            className="font-medium"
                                        >
                                            {t(
                                                'roles.select_all_permissions',
                                                'تحديد جميع الصلاحيات',
                                            )}
                                        </Label>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {Object.entries(groupedPermissions).map(
                                            ([resource, perms]) => (
                                                <div
                                                    key={resource}
                                                    className="space-y-2"
                                                >
                                                    <h4 className="text-sm font-medium text-muted-foreground uppercase">
                                                        {t(
                                                            `navigation.${resource}`,
                                                        ) || resource}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {perms.map(
                                                            (permission) => (
                                                                <div
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <Checkbox
                                                                        id={`permission-${permission.id}`}
                                                                        checked={selectedPermissions.includes(
                                                                            permission.name,
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            handlePermissionChange(
                                                                                permission.name,
                                                                                checked as boolean,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`permission-${permission.id}`}
                                                                        className="text-sm"
                                                                    >
                                                                        {t(
                                                                            `permissions_names.${permission.name}`,
                                                                        ) ||
                                                                            permission.name}
                                                                    </Label>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(rolesIndex.url())}
                            >
                                {t('common.cancel', 'إلغاء')}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                {t('roles.create_role', 'إنشاء الدور')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
