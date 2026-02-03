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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FilterX,
    Key,
    MoreHorizontal,
    Plus,
    Search,
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
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('permissions.title')} />

                <div
                    className="space-y-6 p-6"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    {/* Header Section - Unified Design */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <Key className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('permissions.title')}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('permissions.description')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {can('canCreate') && (
                                <Button
                                    asChild
                                    className="transition-all hover:scale-105"
                                >
                                    <Link href={permissionsCreate.url()}>
                                        <Plus
                                            className={cn(
                                                'h-4 w-4',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        {t('permissions.create')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex min-w-[300px] flex-1 items-center gap-2">
                            {/* Search */}
                            <div className="relative w-full max-w-sm">
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
                                        'transition-all focus:ring-2 focus:ring-primary/20',
                                        isRTL ? 'pr-10' : 'pl-10',
                                    )}
                                />
                            </div>

                            {/* Clear Filters */}
                            {searchQuery && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={resetSearch}
                                            className="text-muted-foreground"
                                        >
                                            <FilterX className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('common.reset')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        #
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        {t('permissions.name')}
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        {t('permissions.guard_name')}
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        {t('common.created_at')}
                                    </TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <Key className="h-12 w-12 opacity-10" />
                                                <p className="text-lg font-medium">
                                                    {t('no_results')}
                                                </p>
                                                <p className="text-sm">
                                                    {t('common.no_data')}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    permissions.data.map((permission) => (
                                        <TableRow
                                            key={permission.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell>
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {permission.id}
                                                </span>
                                            </TableCell>
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
                                                    isRTL ? 'ar-EG' : 'en-US',
                                                )}
                                            </TableCell>
                                            <TableCell>
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
                                                        className="w-44"
                                                    >
                                                        <DropdownMenuLabel>
                                                            {t('common.actions')}
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
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
                                                                            ).url
                                                                        }
                                                                        className="flex cursor-pointer items-center"
                                                                    >
                                                                        <Eye
                                                                            className={cn(
                                                                                'h-4 w-4 text-muted-foreground',
                                                                                isRTL
                                                                                    ? 'ml-2'
                                                                                    : 'mr-2',
                                                                            )}
                                                                        />
                                                                        {t(
                                                                            'common.view',
                                                                        )}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                        {can('canUpdate') && (
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        permissionsEdit(
                                                                            permission.id,
                                                                        ).url
                                                                    }
                                                                    className="flex cursor-pointer items-center"
                                                                >
                                                                    <Edit
                                                                        className={cn(
                                                                            'h-4 w-4 text-muted-foreground',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t(
                                                                        'common.edit',
                                                                    )}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can('canDelete') && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setPermissionToDelete(
                                                                            permission,
                                                                        );
                                                                        setDeleteDialogOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2
                                                                        className={cn(
                                                                            'h-4 w-4',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
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

                    {/* Pagination */}
                    {permissions.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing')}{' '}
                                <span className="font-bold text-foreground">
                                    {permissions.from}
                                </span>{' '}
                                {t('to')}{' '}
                                <span className="font-bold text-foreground">
                                    {permissions.to}
                                </span>{' '}
                                {t('of')}{' '}
                                <span className="font-bold text-foreground">
                                    {permissions.total}
                                </span>{' '}
                                {t('records')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
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
                                    disabled={permissions.current_page === 1}
                                >
                                    {isRTL ? (
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    ) : (
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                    )}
                                    {t('previous')}
                                </Button>

                                <div className="mx-2 flex items-center gap-1">
                                    <Badge
                                        variant="outline"
                                        className="h-8 min-w-[32px] justify-center"
                                    >
                                        {permissions.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {permissions.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
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
                                    disabled={
                                        permissions.current_page ===
                                        permissions.last_page
                                    }
                                >
                                    {t('next')}
                                    {isRTL ? (
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                    >
                        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    {t('common.confirm_delete')}
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                    className={cn(
                                        isRTL ? 'text-right' : 'text-left',
                                    )}
                                >
                                    {t('permissions.confirm_delete', {
                                        name: permissionToDelete?.name,
                                    })}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
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
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {t('common.delete')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}
