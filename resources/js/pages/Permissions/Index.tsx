import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    create as permissionsCreate,
    destroy as permissionsDestroy,
    edit as permissionsEdit,
    index as permissionsIndex,
    show as permissionsShow,
} from '@/routes/permissions';
import { type BreadcrumbItem, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    MoreHorizontal,
    Plus,
    RotateCcw,
    Search,
    Shield,
    SquarePen,
    Trash2,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
}

interface Props {
    paginatedPermissions: PaginatedResponse<Permission>;
    filters: {
        search: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

// دالة الـ Debounce المحلية لمنع تضارب الاستيرادات
function customDebounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default function Index({
    paginatedPermissions: permissions,
    filters = { search: '' },
    flash,
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { can } = usePermissions('permissions');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('permissions.title'), href: permissionsIndex.url() },
    ];

    // States
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] =
        useState<Permission | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Debounced Search logic
    const debouncedSearch = useCallback(
        customDebounce((query: string) => {
            router.get(
                permissionsIndex.url(),
                { search: query },
                { preserveState: true, replace: true },
            );
        }, 300),
        [],
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const resetSearch = () => {
        setSearchQuery('');
        router.get(permissionsIndex.url(), {}, { preserveState: true });
    };

    const handleDelete = (permission: Permission) => {
        router.delete(permissionsDestroy(permission.id).url, {
            onSuccess: () => {
                toast({ title: t('success'), variant: 'default' });
                setDeleteDialogOpen(false);
                setPermissionToDelete(null);
            },
            onError: () => toast({ title: t('error'), variant: 'destructive' }),
        });
    };

    useEffect(() => {
        if (flash?.success) toast({ title: flash.success });
        if (flash?.error) toast({ title: flash.error, variant: 'destructive' });
    }, [flash, toast]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('permissions.title')} />

            <div
                className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Shield className="h-6 w-6 text-primary" />
                            {t('permissions.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('permissions.description')}
                        </p>
                    </div>
                    {can('canCreate') && (
                        <Button asChild className="gap-2 shadow-sm">
                            <Link href={permissionsCreate.url()}>
                                <Plus className="h-4 w-4" />
                                {t('permissions.create')}
                            </Link>
                        </Button>
                    )}
                </div>

                <Card className="border border-none shadow-sm">
                    <CardHeader className="mb-4 border-b pb-4">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <CardTitle className="text-lg font-semibold">
                                {t('permissions.list')}
                            </CardTitle>

                            <div className="flex w-full items-center gap-2 md:w-auto">
                                <div className="relative flex-1 md:w-72">
                                    <Search
                                        className={cn(
                                            'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                            isRTL ? 'right-3' : 'left-3',
                                        )}
                                    />
                                    <Input
                                        placeholder={t('common.search')}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className={cn(
                                            'bg-muted/50',
                                            isRTL ? 'pr-9' : 'pl-9',
                                        )}
                                    />
                                </div>
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        onClick={resetSearch}
                                        size="icon"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead
                                            className={
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left'
                                            }
                                        >
                                            {t('permissions.name')}
                                        </TableHead>
                                        <TableHead
                                            className={
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left'
                                            }
                                        >
                                            {t('permissions.guard_name')}
                                        </TableHead>
                                        <TableHead
                                            className={
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left'
                                            }
                                        >
                                            {t('common.created_at')}
                                        </TableHead>
                                        <TableHead className="w-[80px] text-center">
                                            {t('common.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-32 text-center text-muted-foreground"
                                            >
                                                {t('common.no_data')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        permissions.data.map((permission) => (
                                            <TableRow
                                                key={permission.id}
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {permission.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] font-normal uppercase"
                                                    >
                                                        {permission.guard_name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(
                                                        permission.created_at,
                                                    ).toLocaleDateString(
                                                        isRTL
                                                            ? 'ar-EG'
                                                            : 'en-US',
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align={
                                                                isRTL
                                                                    ? 'start'
                                                                    : 'end'
                                                            }
                                                            className="w-40"
                                                        >
                                                            {can(
                                                                'canViewDetails',
                                                            ) && (
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={
                                                                            permissionsShow(
                                                                                permission.id,
                                                                            )
                                                                                .url
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />{' '}
                                                                        {t(
                                                                            'common.view',
                                                                        )}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can(
                                                                'canUpdate',
                                                            ) && (
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={
                                                                            permissionsEdit(
                                                                                permission.id,
                                                                            )
                                                                                .url
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <SquarePen className="mr-2 h-4 w-4" />{' '}
                                                                        {t(
                                                                            'common.edit',
                                                                        )}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can(
                                                                'canDelete',
                                                            ) && (
                                                                <>
                                                                    <div className="my-1 h-px bg-muted" />
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setPermissionToDelete(
                                                                                permission,
                                                                            );
                                                                            setDeleteDialogOpen(
                                                                                true,
                                                                            );
                                                                        }}
                                                                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                                        {t(
                                                                            'common.delete',
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Professional Pagination Section */}
                        {permissions.last_page > 1 && (
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                                <p className="text-xs text-muted-foreground">
                                    {t('common.showing')}{' '}
                                    <span className="font-bold text-foreground">
                                        {permissions.from}
                                    </span>{' '}
                                    {t('common.to')}{' '}
                                    <span className="font-bold text-foreground">
                                        {permissions.to}
                                    </span>{' '}
                                    {t('common.of')}{' '}
                                    <span className="font-bold text-foreground">
                                        {permissions.total}
                                    </span>
                                </p>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            permissions.current_page === 1
                                        }
                                        onClick={() =>
                                            router.get(
                                                permissionsIndex.url(),
                                                {
                                                    search: searchQuery,
                                                    page:
                                                        permissions.current_page -
                                                        1,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        {isRTL ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            <ChevronLeft className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <div className="rounded-md border bg-primary/5 px-4 py-1.5 text-xs font-medium">
                                        {t('common.page')}{' '}
                                        {permissions.current_page} /{' '}
                                        {permissions.last_page}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            permissions.current_page ===
                                            permissions.last_page
                                        }
                                        onClick={() =>
                                            router.get(
                                                permissionsIndex.url(),
                                                {
                                                    search: searchQuery,
                                                    page:
                                                        permissions.current_page +
                                                        1,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        {isRTL ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {t('common.confirm_delete')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('permissions.confirm_delete', {
                                    name: permissionToDelete?.name,
                                })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter
                            className={cn(
                                'gap-2',
                                isRTL && 'sm:flex-row-reverse',
                            )}
                        >
                            <AlertDialogCancel
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                {t('common.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    permissionToDelete &&
                                    handleDelete(permissionToDelete)
                                }
                                className="border-none bg-red-600 text-white hover:bg-red-700"
                            >
                                {t('common.delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
