import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as rolesDestroy,
    edit as rolesEdit,
    index as rolesIndex,
} from '@/routes/roles';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Shield,
    SquarePen,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Role {
    id: number;
    name: string;
    display_name: string | null;
    description: string | null;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
    users: User[];
}

interface Props {
    role: Role;
    flash: {
        success?: string;
        error?: string;
    };
}

const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function Show({ role, flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('roles.title', 'الأدوار'),
            href: rolesIndex.url(),
        },
        {
            title: role.display_name || role.name,
            href: '#',
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
    const groupedPermissions = role.permissions.reduce(
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
                title={`${role.display_name || role.name} - ${t('roles.title', 'الأدوار')}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={rolesIndex.url()}>
                                <ArrowLeft className="h-4 w-4" />
                                {t('common.back', 'العودة')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {role.display_name || role.name}
                            </h1>
                            <p className="text-muted-foreground">
                                {t(
                                    'roles.role_details',
                                    'تفاصيل الدور وصلاحياته',
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={rolesEdit.url(role.id)}>
                                <SquarePen className="h-4 w-4" />
                                {t('common.edit', 'تعديل')}
                            </Link>
                        </Button>
                        {role.users.length === 0 && (
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (
                                        confirm(
                                            t(
                                                'roles.confirm_delete',
                                                'هل أنت متأكد من حذف هذا الدور؟',
                                            ),
                                        )
                                    ) {
                                        router.delete(
                                            rolesDestroy.url(role.id),
                                        );
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                {t('common.delete', 'حذف')}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Basic Information */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                {t('roles.basic_info', 'المعلومات الأساسية')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('roles.name', 'اسم الدور')}
                                </Label>
                                <p className="font-medium">
                                    <Badge variant="outline">{role.name}</Badge>
                                </p>
                            </div>

                            {role.display_name && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'roles.display_name',
                                            'الاسم المعروض',
                                        )}
                                    </Label>
                                    <p>{role.display_name}</p>
                                </div>
                            )}

                            {role.description && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('roles.description', 'الوصف')}
                                    </Label>
                                    <p>{role.description}</p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('roles.guard_name', 'اسم الحارس')}
                                </Label>
                                <p>{role.guard_name}</p>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'common.created_at',
                                            'تاريخ الإنشاء',
                                        )}
                                    </Label>
                                    <p className="text-sm">
                                        {formatDate(role.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'roles.users_count',
                                            'عدد المستخدمين',
                                        )}
                                    </Label>
                                    <p className="text-sm">
                                        {role.users.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                {t('roles.permissions', 'الصلاحيات')} (
                                {role.permissions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {role.permissions.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">
                                    {t(
                                        'roles.no_permissions',
                                        'لا توجد صلاحيات مرتبطة بهذا الدور',
                                    )}
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {Object.entries(groupedPermissions).map(
                                        ([resource, permissions]) => (
                                            <div
                                                key={resource}
                                                className="space-y-2"
                                            >
                                                <h4 className="border-b pb-1 text-sm font-medium text-muted-foreground uppercase">
                                                    {t(
                                                        `navigation.${resource}`,
                                                    ) || resource}
                                                </h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {permissions.map(
                                                        (permission) => (
                                                            <Badge
                                                                key={
                                                                    permission.id
                                                                }
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {t(
                                                                    `permissions_names.${permission.name}`,
                                                                ) ||
                                                                    permission.name}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Users with this role */}
                    {role.users.length > 0 && (
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    {t(
                                        'roles.users_with_role',
                                        'المستخدمون المرتبطون بهذا الدور',
                                    )}{' '}
                                    ({role.users.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {role.users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 rounded-lg border p-3"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
