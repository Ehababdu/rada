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
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
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
    MoreHorizontal,
    Plus,
    RotateCcw,
    Search,
    Settings2,
    Trash2,
    User as UserIcon,
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

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-4 py-3">
            <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
        </td>
        <td className="px-4 py-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </td>
        <td className="px-4 py-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </td>
        <td className="px-4 py-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </td>
        <td className="px-4 py-3">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
        </td>
        <td className="px-4 py-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </td>
    </tr>
);

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
    const [showColumnToggle, setShowColumnToggle] = useState(false);
    const columnToggleRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filters state
    const [roleFilter, setRoleFilter] = useState<string>(filters.role || '');

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Debounced search
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
    const mountedRef = useRef(false);
    const debouncedSearch = useCallback((value: string) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            updateData({ filter: value ? { search: value } : {} });
        }, 300);
    }, []);

    // Reset search
    const resetSearch = useCallback(() => {
        setSearchQuery('');
        setRoleFilter('');
        updateData({ filter: { search: '', role: '' }, sort: '' });
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Hide column toggle on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                columnToggleRef.current &&
                !columnToggleRef.current.contains(event.target as Node)
            ) {
                setShowColumnToggle(false);
            }
        };

        if (showColumnToggle) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColumnToggle]);

    // Function to update data from server
    const updateData = (params: {
        page?: number;
        per_page?: number;
        sort?: string;
        filter?: Record<string, string>;
    }) => {
        setIsLoading(true);

        const effectivePage =
            params.page !== undefined ? params.page : pageIndex + 1;
        const effectivePerPage =
            params.per_page !== undefined ? params.per_page : pageSize;

        let effectiveSort = '';
        if (params.sort) {
            effectiveSort = params.sort;
        } else if (sortBy) {
            effectiveSort = sortDirection === 'desc' ? `-${sortBy}` : sortBy;
        }

        const query: Record<string, any> = {
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
            onFinish: () => setIsLoading(false),
        });
    };

    // Helper function for sortable header
    const SortableHeader = ({
        columnId,
        label,
    }: {
        columnId: string;
        label: string;
    }) => (
        <Button
            variant="ghost"
            onClick={() => {
                if (sortBy === columnId) {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
    const columns = useMemo<ColumnDef<User, any>[]>(() => {
        const allColumns = [
            columnHelper.display({
                id: 'id',
                header: 'ID',
                cell: (info) => (
                    <span className="font-medium text-gray-900 dark:text-gray-100">
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
                        <UserIcon size={16} className="text-gray-500" />
                        <span className="font-medium">{info.getValue()}</span>
                    </div>
                ),
            }),
            columnHelper.accessor('email', {
                header: () => (
                    <SortableHeader columnId="email" label={t('users.email')} />
                ),
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('roles', {
                header: t('users.roles'),
                cell: (info) => {
                    const roles = info.getValue();
                    if (!roles || roles.length === 0) {
                        return <span className="text-gray-500">-</span>;
                    }
                    return (
                        <div className="flex flex-wrap gap-1">
                            {roles.map((role: any) => (
                                <span
                                    key={role.id}
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                    {role.display_name || role.name}
                                </span>
                            ))}
                        </div>
                    );
                },
            }),
            columnHelper.accessor('email_verified_at', {
                header: t('users.email_verified'),
                cell: (info) => {
                    const verifiedAt = info.getValue();
                    return verifiedAt ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
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
                cell: (info) => formatDate(info.getValue()),
            }),
            columnHelper.display({
                id: 'actions',
                header: t('common.actions'),
                cell: (info) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={show(info.row.original.id).url}
                                    className="flex items-center gap-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    {t('common.view')}
                                </Link>
                            </DropdownMenuItem>
                            {can('canUpdate') && info.row.original.id && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={edit(info.row.original.id).url}
                                        className="flex items-center gap-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        {t('common.edit')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {can('canDelete') &&
                                info.row.original.id !== auth?.user?.id && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleDelete(info.row.original)
                                        }
                                        className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {t('common.delete')}
                                    </DropdownMenuItem>
                                )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            }),
        ];

        return allColumns;
    }, [sortBy, sortDirection, can, t]);

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.title')} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {t('users.title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('users.description')}
                        </p>
                    </div>
                    {can('canCreate') && (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('users.create')}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => debouncedSearch(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Role Filter */}
                    <Select
                        value={
                            roleFilter &&
                            roles.some((role) => role.name === roleFilter)
                                ? roleFilter
                                : 'all'
                        }
                        onValueChange={(value) => {
                            setRoleFilter(value === 'all' ? '' : value);
                            updateData({
                                filter: { role: value === 'all' ? '' : value },
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
                                <SelectItem key={role.id} value={role.name}>
                                    {role.display_name || role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Reset Filters */}
                    {(searchQuery || roleFilter) && (
                        <Button variant="outline" onClick={resetSearch}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            {t('common.reset')}
                        </Button>
                    )}

                    {/* Column Toggle */}
                    <div className="relative" ref={columnToggleRef}>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setShowColumnToggle(!showColumnToggle)
                            }
                        >
                            <Settings2 className="mr-2 h-4 w-4" />
                            {t('common.columns')}
                        </Button>
                        {showColumnToggle && (
                            <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                {table.getAllColumns().map((column) => (
                                    <label
                                        key={column.id}
                                        className="flex items-center gap-2 py-1"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={column.getIsVisible()}
                                            onChange={column.getToggleVisibilityHandler()}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <span className="text-sm">
                                            {t(`users.columns.${column.id}`)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {isLoading ? (
                                    Array.from({ length: pageSize }).map(
                                        (_, index) => (
                                            <SkeletonRow key={index} />
                                        ),
                                    )
                                ) : users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                table.getVisibleFlatColumns()
                                                    .length
                                            }
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            {t('users.no_users')}
                                            <div className="mt-4">
                                                {can('canCreate') && (
                                                    <Button asChild>
                                                        <Link
                                                            href={create.url()}
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t('users.create')}
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </td>
                                                ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t('common.show')}
                            </span>
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
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t('common.entries')}
                            </span>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPageIndex(pageIndex - 1)}
                                disabled={users.current_page === 1}
                                className="rounded-md border border-gray-200 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <span className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                                {users.current_page} / {users.last_page}
                            </span>

                            <button
                                onClick={() => setPageIndex(pageIndex + 1)}
                                disabled={
                                    users.current_page === users.last_page
                                }
                                className="rounded-md border border-gray-200 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
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
                    <AlertDialogFooter>
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
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
