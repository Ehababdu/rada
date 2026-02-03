import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import i18n from 'i18next';
import {
    ArrowLeft,
    Calendar,
    Edit,
    Mail,
    Shield,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
    user: User;
}

export default function Show({ user }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { can } = usePermissions('users');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('users.title'),
            href: '/users',
        },
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
    ];

    const handleDelete = () => {
        router.delete(`/users/${user.id}`, {
            onSuccess: () => {
                toast(t('users.delete_success'), { variant: 'success' });
                router.visit('/users');
            },
            onError: () => {
                toast(t('common.error'), { variant: 'destructive' });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user.name} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/users">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('common.back')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {user.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('users.description')}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {can('canUpdate') && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/users/${user.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t('common.edit')}
                                </Link>
                            </Button>
                        )}

                        {can('canDelete') && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {t('common.delete')}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {t('users.delete_confirm_title')}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t('users.delete_confirm_message', {
                                                name: user.name,
                                            })}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            {t('common.cancel')}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            {t('common.delete')}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>

                {/* User Details */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                {t('users.basic_info')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <UserIcon className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t('users.name')}
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {user.name}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t('users.email')}
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t('users.created_at')}
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString(
                                            i18n.language === 'ar'
                                                ? 'ar-SA'
                                                : 'en-US',
                                            {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            },
                                        )}
                                    </p>
                                </div>
                            </div>

                            {user.updated_at !== user.created_at && (
                                <>
                                    <Separator />
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('users.updated_at')}
                                            </p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {new Date(
                                                    user.updated_at,
                                                ).toLocaleDateString(
                                                    i18n.language === 'ar'
                                                        ? 'ar-SA'
                                                        : 'en-US',
                                                    {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    },
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Roles and Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                {t('users.roles_permissions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Roles */}
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('users.roles')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="secondary"
                                            >
                                                {role.display_name || role.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('users.no_roles')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Permissions */}
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('users.permissions')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {user.permissions &&
                                    user.permissions.length > 0 ? (
                                        user.permissions.map((permission) => (
                                            <Badge
                                                key={permission.id}
                                                variant="outline"
                                            >
                                                {permission.display_name ||
                                                    permission.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('users.no_permissions')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
