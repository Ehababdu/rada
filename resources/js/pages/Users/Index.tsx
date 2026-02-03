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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { create, destroy, edit, show } from '@/routes/users';
import {
    type BreadcrumbItem,
    type PaginatedResponse,
    type SharedData,
    type User,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FilterX,
    MoreHorizontal,
    Plus,
    Search,
    Settings2,
    Trash2,
    Users as UsersIcon,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

interface Props {
    users: PaginatedResponse<User>;
    filters: {
        search: string;
        role: string;
        sort: string;
    };
    roles: { id: number; name: string; display_name?: string }[];
}

export default function Index({
    users,
    filters = { search: '', role: '', sort: '' },
    roles = [],
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { auth, flash } = usePage<SharedData>().props;
    const { can } = usePermissions('users');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('users.title'),
            href: '/users',
        },
    ];

    // Server-side states
    const [pageIndex, setPageIndex] = useState(
        Number(users.current_page) - 1 || 0,
    );
    const [pageSize, setPageSize] = useState(users.per_page);
    const [sortBy, setSortBy] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Client-side states for UI
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        name: true,
        email: true,
        roles: true,
        email_verified_at: false,
        created_at: true,
    });

    // Filters state
    const [roleFilter, setRoleFilter] = useState<string>(filters.role || '');

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Function to update data from server
    const updateData = useCallback(
        (params: {
            page?: number;
            per_page?: number;
            sort?: string;
            filter?: Record<string, string>;
        }) => {
            const effectivePage =
                params.page !== undefined ? params.page : pageIndex + 1;
            const effectivePerPage =
                params.per_page !== undefined ? params.per_page : pageSize;

            let effectiveSort = '';
            if (params.sort) {
                effectiveSort = params.sort;
            } else if (sortBy) {
                effectiveSort =
                    sortDirection === 'desc' ? `-${sortBy}` : sortBy;
            }

            const query: Record<string, unknown> = {
                page: effectivePage,
                per_page: effectivePerPage,
                ...(effectiveSort && { sort: effectiveSort }),
                ...(searchQuery && { search: searchQuery }),
                ...(roleFilter && { role: roleFilter }),
                ...params.filter,
            };

            router.visit('/users', {
                data: query,
                preserveState: true,
                preserveScroll: true,
                only: ['users', 'filters'],
            });
        },
        [pageIndex, pageSize, sortBy, sortDirection, searchQuery, roleFilter],
    );

    // Debounced search
    const debouncedSearch = useCallback(
        (value: string) => {
            setSearchQuery(value);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
                updateData({ filter: value ? { search: value } : {} });
            }, 300);
        },
        [updateData],
    );

    // Reset search
    const resetSearch = useCallback(() => {
        setSearchQuery('');
        setRoleFilter('');
        updateData({ filter: { search: '', role: '' }, sort: '' });
    }, [updateData]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Helper function for sortable header
    const SortableHeader = useCallback(
        ({ columnId, label }: { columnId: string; label: string }) => (
            <Button
                variant="ghost"
                onClick={() => {
                    if (sortBy === columnId) {
                        setSortDirection(
                            sortDirection === 'asc' ? 'desc' : 'asc',
                        );
                    } else {
                        setSortBy(columnId);
                        setSortDirection('asc');
                    }
                }}
                className="h-auto p-0 font-semibold"
            >
                {label}
                {sortBy === columnId ? (
                    sortDirection === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        [sortBy, sortDirection],
    );

    const handleDelete = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;

        router.delete(destroy(userToDelete.id).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast(t('users.delete.success'), { variant: 'success' });
                setDeleteDialogOpen(false);
                setUserToDelete(null);
            },
            onError: () => {
                toast(t('users.delete.error'), { variant: 'destructive' });
                setDeleteDialogOpen(false);
                setUserToDelete(null);
            },
        });
    };

    // Column definitions
    const columnHelper = createColumnHelper<User>();
    const columns = useMemo<ColumnDef<User, unknown>[]>(() => {
        const allColumns = [
            columnHelper.display({
                id: 'id',
                header: '#',
                cell: (info) => (
                    <span className="font-mono text-xs text-muted-foreground">
                        {info.row.original.id}
                    </span>
                ),
            }),
            columnHelper.accessor('name', {
                header: () => (
                    <SortableHeader columnId="name" label={t('users.name')} />
                ),
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{info.getValue()}</span>
                    </div>
                ),
            }),
            columnHelper.accessor('email', {
                header: () => (
                    <SortableHeader columnId="email" label={t('users.email')} />
                ),
                cell: (info) => (
                    <span className="text-muted-foreground">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('roles', {
                header: t('users.roles'),
                cell: (info) => {
                    const roles = info.getValue();
                    if (!roles || roles.length === 0) {
                        return <span className="text-muted-foreground">-</span>;
                    }
                    return (
                        <div className="flex flex-wrap gap-1">
                            {roles.map(
                                (role: {
                                    id: number;
                                    name: string;
                                    display_name?: string;
                                }) => (
                                    <Badge
                                        key={role.id}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {role.display_name || role.name}
                                    </Badge>
                                ),
                            )}
                        </div>
                    );
                },
            }),
            columnHelper.accessor('email_verified_at', {
                header: t('users.email_verified'),
                cell: (info) => {
                    const verifiedAt = info.getValue();
                    return verifiedAt ? (
                        <Badge
                            variant="default"
                            className="gap-1 border-green-500/20 bg-green-500/10 text-green-600"
                        >
                            <CheckCircle className="h-3 w-3" />
                            {t('verified')}
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            {t('not_verified')}
                        </Badge>
                    );
                },
            }),
            columnHelper.accessor('created_at', {
                header: () => (
                    <SortableHeader
                        columnId="created_at"
                        label={t('common.created_at')}
                    />
                ),
                cell: (info) => (
                    <span className="text-muted-foreground">
                        {formatDate(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: '',
                cell: (info) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                            <DropdownMenuLabel>
                                {t('common.actions')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={show(info.row.original.id).url}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    {t('common.view')}
                                </Link>
                            </DropdownMenuItem>
                            {can('canUpdate') && info.row.original.id && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={edit(info.row.original.id).url}
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                        {t('common.edit')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {can('canDelete') &&
                                info.row.original.id !== auth?.user?.id && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDelete(info.row.original)
                                            }
                                            className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {t('common.delete')}
                                        </DropdownMenuItem>
                                    </>
                                )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            }),
        ];

        return allColumns;
    }, [can, t, isRTL, SortableHeader, auth?.user?.id, columnHelper]);

    const table = useReactTable({
        data: users.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: users.last_page,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast(flash.success, { variant: 'success' });
        }
        if (flash?.error) {
            toast(flash.error, { variant: 'destructive' });
        }
    }, [flash, toast]);

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('users.title')} />

                <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Header Section - Unified Design */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <UsersIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('users.title')}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('users.description')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {can('canCreate') && (
                                <Button
                                    asChild
                                    className="transition-all hover:scale-105"
                                >
                                    <Link href={create.url()}>
                                        <Plus
                                            className={cn(
                                                'h-4 w-4',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        {t('users.create')}
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
                                    onChange={(e) =>
                                        debouncedSearch(e.target.value)
                                    }
                                    className={cn(
                                        'transition-all focus:ring-2 focus:ring-primary/20',
                                        isRTL ? 'pr-10' : 'pl-10',
                                    )}
                                />
                            </div>

                            {/* Role Filter */}
                            <Select
                                value={
                                    roleFilter &&
                                    roles.some(
                                        (role) => role.name === roleFilter,
                                    )
                                        ? roleFilter
                                        : 'all'
                                }
                                onValueChange={(value) => {
                                    setRoleFilter(value === 'all' ? '' : value);
                                    updateData({
                                        filter: {
                                            role: value === 'all' ? '' : value,
                                        },
                                    });
                                }}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue
                                        placeholder={t('users.filter_by_role')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('common.all')}
                                    </SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.name}
                                        >
                                            {role.display_name || role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {(searchQuery || roleFilter) && (
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

                        {/* Column Visibility */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Settings2
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('common.columns')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align={isRTL ? 'start' : 'end'}
                                className="w-56"
                            >
                                <DropdownMenuLabel>
                                    {t('columns_visibility')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter((c) => c.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(v) =>
                                                column.toggleVisibility(!!v)
                                            }
                                        >
                                            {t(`users.columns.${column.id}`) ||
                                                column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    'py-4',
                                                    isRTL
                                                        ? 'text-right'
                                                        : 'text-left',
                                                )}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                table.getVisibleFlatColumns()
                                                    .length
                                            }
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <UsersIcon className="h-12 w-12 opacity-10" />
                                                <p className="text-lg font-medium">
                                                    {t('users.no_users')}
                                                </p>
                                                {can('canCreate') && (
                                                    <Button
                                                        asChild
                                                        className="mt-4"
                                                    >
                                                        <Link
                                                            href={create.url()}
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t('users.create')}
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="py-4"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 flex items-center gap-2 text-sm text-muted-foreground sm:order-1">
                                <span>{t('common.show')}</span>
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => {
                                        setPageSize(Number(value));
                                        updateData({
                                            per_page: Number(value),
                                            page: 1,
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>{t('common.entries')}</span>
                            </div>

                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setPageIndex(pageIndex - 1);
                                        updateData({ page: pageIndex });
                                    }}
                                    disabled={users.current_page === 1}
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
                                        {users.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {users.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setPageIndex(pageIndex + 1);
                                        updateData({ page: pageIndex + 2 });
                                    }}
                                    disabled={
                                        users.current_page === users.last_page
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
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {t('users.delete.title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('users.delete.confirmMessage', {
                                    name: userToDelete?.name,
                                })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                            <AlertDialogCancel
                                onClick={() => {
                                    setDeleteDialogOpen(false);
                                    setUserToDelete(null);
                                }}
                            >
                                {t('common.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-white hover:bg-destructive/90"
                            >
                                {t('common.delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </AppLayout>
        </TooltipProvider>
    );
}
