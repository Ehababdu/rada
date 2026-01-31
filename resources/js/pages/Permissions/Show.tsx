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
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    destroy as permissionsDestroy,
    edit as permissionsEdit,
    index as permissionsIndex,
} from '@/routes/permissions';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Clock,
    Info,
    Shield,
    SquarePen,
    Trash2,
    UserCheck,
} from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    permission: Permission;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Show({ permission, flash }: Props) {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const isRTL = i18n.language === 'ar';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('permissions.title'), href: permissionsIndex.url() },
        { title: permission.name, href: '#' },
    ];

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = () => {
        router.delete(permissionsDestroy(permission.id).url, {
            onSuccess: () => {
                toast({ title: t('success'), variant: 'default' });
            },
            onError: () => {
                toast({ title: t('error'), variant: 'destructive' });
            },
        });
    };

    useEffect(() => {
        if (flash?.success) toast({ title: flash.success, variant: 'default' });
        if (flash?.error) toast({ title: flash.error, variant: 'destructive' });
    }, [flash, toast]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('permissions.title')} - ${permission.name}`} />

            <div
                className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Link href={permissionsIndex.url()}>
                                {isRTL ? (
                                    <ArrowRight className="h-4 w-4" />
                                ) : (
                                    <ArrowLeft className="h-4 w-4" />
                                )}
                                {t('common.back')}
                            </Link>
                        </Button>
                        <div className="hidden h-6 w-px bg-border sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {permission.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            asChild
                            className="gap-2 shadow-sm"
                        >
                            <Link href={permissionsEdit(permission.id).url}>
                                <SquarePen className="h-4 w-4" />
                                {t('common.edit')}
                            </Link>
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="gap-2 shadow-sm"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {t('common.delete')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {t('confirm_delete')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('permissions.confirm_delete', {
                                            name: permission.name,
                                        })}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter
                                    className={cn(
                                        'gap-2',
                                        isRTL && 'sm:flex-row-reverse',
                                    )}
                                >
                                    <AlertDialogCancel>
                                        {t('cancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                        {t('delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Details */}
                    <Card className="overflow-hidden border border-none shadow-sm lg:col-span-2">
                        <CardHeader className="border-b bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Info className="h-5 w-5 text-primary" />
                                {t('permissions.details')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase italic">
                                        {t('permissions.name')}
                                    </span>
                                    <div className="flex">
                                        <Badge
                                            variant="secondary"
                                            className="px-3 py-1 font-mono text-sm"
                                        >
                                            {permission.name}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase italic">
                                        {t('permissions.guard_name')}
                                    </span>
                                    <div className="flex">
                                        <Badge
                                            variant="outline"
                                            className="px-3 py-1 text-sm"
                                        >
                                            {permission.guard_name}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="mb-0.5 block text-xs text-muted-foreground">
                                            {t('common.created_at')}
                                        </span>
                                        <p className="text-sm font-medium">
                                            {formatDate(permission.created_at)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatTime(permission.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="mb-0.5 block text-xs text-muted-foreground">
                                            {t('common.updated_at')}
                                        </span>
                                        <p className="text-sm font-medium">
                                            {formatDate(permission.updated_at)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatTime(permission.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usage Info */}
                    <div className="space-y-6">
                        <Card className="border border-none shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                    <UserCheck className="h-4 w-4" />
                                    {t('permissions.usage_info')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/10">
                                    <h4 className="mb-1 flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-100">
                                        <Shield className="h-3.5 w-3.5" />
                                        {t('permissions.permission_name')}
                                    </h4>
                                    <p className="mb-3 text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                                        {t(
                                            'permissions.permission_name_description',
                                        )}
                                    </p>
                                    <code className="block rounded border border-blue-200 bg-white/80 p-2 font-mono text-[11px] text-blue-800 dark:border-blue-800 dark:bg-black/20 dark:text-blue-200">
                                        {permission.name}
                                    </code>
                                </div>

                                <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/10">
                                    <h4 className="mb-1 flex items-center gap-2 text-sm font-bold text-green-900 dark:text-green-100">
                                        <UserCheck className="h-3.5 w-3.5" />
                                        {t('permissions.guard_name')}
                                    </h4>
                                    <p className="mb-3 text-xs leading-relaxed text-green-700 dark:text-green-300">
                                        {t(
                                            'permissions.guard_name_description',
                                        )}
                                    </p>
                                    <code className="block rounded border border-green-200 bg-white/80 p-2 font-mono text-[11px] text-green-800 dark:border-green-800 dark:bg-black/20 dark:text-green-200">
                                        {permission.guard_name}
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
