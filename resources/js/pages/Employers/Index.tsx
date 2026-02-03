import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
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

// Icons
import {
    AlertTriangle,
    ArrowUpDown,
    Briefcase,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FilterX,
    MapPin,
    MoreHorizontal,
    Plus,
    Search,
    Settings2,
    Trash2,
    XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

interface Employer {
    id: number;
    name_ar: string;
    name_en: string;
    location: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    is_active: boolean;
}

interface Props {
    employers: {
        data: Employer[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        is_active: string;
    };
}

export default function Index({ employers, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { can } = usePermissions('employers');

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Alert Dialog State
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('employers.title'), href: '/employers' },
    ];

    // Search Logic
    const performSearch = useCallback((params: Record<string, unknown>) => {
        router.get('/employers', params as Record<string, unknown>, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, []);

    const handleSearchInput = (value: string) => {
        setSearchTerm(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            performSearch({ ...filters, search: value });
        }, 400);
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/employers');
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/employers/${deleteId}`, {
                onSuccess: () => {
                    toast({ title: t('employer_deleted_successfully') });
                    setDeleteId(null);
                },
                onFinish: () => setDeleteId(null),
            });
        }
    };

    const columnHelper = createColumnHelper<Employer>();

    const columns = useMemo<ColumnDef<Employer, unknown>[]>(
        () => [
            columnHelper.accessor('id', {
                header: '#',
                cell: (info) => (
                    <span className="font-mono text-xs text-muted-foreground">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor(isRTL ? 'name_ar' : 'name_en', {
                header: t('employers.name'),
                cell: (info) => (
                    <div className="flex flex-col">
                        <span className="font-semibold">{info.getValue()}</span>
                    </div>
                ),
            }),
            columnHelper.accessor('location', {
                header: t('employers.location'),
                cell: (info) => {
                    const employer = info.row.original;
                    const location = info.getValue();
                    if (!location)
                        return <span className="text-muted-foreground">-</span>;

                    return (
                        <Link
                            href={`/employers/${employer.id}/locations`}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 hover:underline"
                        >
                            <MapPin className="h-4 w-4" />
                            <span>
                                {isRTL ? location.name_ar : location.name_en}
                            </span>
                        </Link>
                    );
                },
            }),
            columnHelper.accessor('is_active', {
                header: t('status'),
                cell: (info) => (
                    <Badge
                        variant={info.getValue() ? 'default' : 'secondary'}
                        className={cn(
                            'gap-1',
                            info.getValue()
                                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                                : '',
                        )}
                    >
                        {info.getValue() ? (
                            <CheckCircle2 className="h-3 w-3" />
                        ) : (
                            <XCircle className="h-3 w-3" />
                        )}
                        {info.getValue()
                            ? t('employers.active')
                            : t('employers.inactive')}
                    </Badge>
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
                        <DropdownMenuContent
                            align={isRTL ? 'start' : 'end'}
                            className="w-44"
                        >
                            <DropdownMenuLabel>
                                {t('actions')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {can('canRead') && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/employers/${info.row.original.id}`}
                                        className="flex cursor-pointer items-center"
                                    >
                                        <Eye
                                            className={cn(
                                                'h-4 w-4 text-muted-foreground',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        {t('view')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {can('canUpdate') && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/employers/${info.row.original.id}/edit`}
                                        className="flex cursor-pointer items-center"
                                    >
                                        <Edit
                                            className={cn(
                                                'h-4 w-4 text-muted-foreground',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        {t('edit')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {can('canDelete') && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                        onClick={() =>
                                            setDeleteId(info.row.original.id)
                                        }
                                    >
                                        <Trash2
                                            className={cn(
                                                'h-4 w-4',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        {t('delete')}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            }),
        ],
        [t, isRTL, columnHelper, can],
    );

    const table = useReactTable({
        data: employers.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, columnVisibility },
    });

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('employers.title')} />

                <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Header Section - Unified Design */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('employers.title')}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('employers.manage_employers')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {can('canCreate') && (
                                <Button
                                    asChild
                                    className="transition-all hover:scale-105"
                                >
                                    <Link href="/employers/create">
                                        <Plus
                                            className={cn(
                                                'h-4 w-4',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        {t('employers.add_employer')}
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
                                    placeholder={t(
                                        'employers.search_employers',
                                    )}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleSearchInput(e.target.value)
                                    }
                                    className={cn(
                                        'transition-all focus:ring-2 focus:ring-primary/20',
                                        isRTL ? 'pr-10' : 'pl-10',
                                    )}
                                />
                            </div>

                            {/* Status Filter */}
                            <Select
                                value={filters.is_active || 'all'}
                                onValueChange={(val) =>
                                    performSearch({
                                        ...filters,
                                        is_active: val === 'all' ? '' : val,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t('banks.all_status')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('banks.all_status')}
                                    </SelectItem>
                                    <SelectItem value="1">
                                        {t('employers.active')}
                                    </SelectItem>
                                    <SelectItem value="0">
                                        {t('employers.inactive')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {(searchTerm || filters.is_active) && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={clearFilters}
                                            className="text-muted-foreground"
                                        >
                                            <FilterX className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('reset')}</p>
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
                                    {t('show_columns')}
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
                                            {t(`employers.${column.id}`) ||
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
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={cn(
                                                            'flex items-center gap-2 select-none',
                                                            header.column.getCanSort() &&
                                                                'cursor-pointer',
                                                        )}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                                                        )}
                                                    </div>
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {employers.data.length > 0 ? (
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
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <Briefcase className="h-12 w-12 opacity-10" />
                                                <p className="text-lg font-medium">
                                                    {t('no_results')}
                                                </p>
                                                <p className="text-sm">
                                                    {t(
                                                        'employers.no_employers',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {employers.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing')}{' '}
                                <span className="font-bold text-foreground">
                                    {employers.from}
                                </span>{' '}
                                {t('to')}{' '}
                                <span className="font-bold text-foreground">
                                    {employers.to}
                                </span>{' '}
                                {t('of')}{' '}
                                <span className="font-bold text-foreground">
                                    {employers.total}
                                </span>{' '}
                                {t('records')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        performSearch({
                                            ...filters,
                                            page: employers.current_page - 1,
                                        })
                                    }
                                    disabled={employers.current_page === 1}
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
                                        {employers.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {employers.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        performSearch({
                                            ...filters,
                                            page: employers.current_page + 1,
                                        })
                                    }
                                    disabled={
                                        employers.current_page ===
                                        employers.last_page
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
                        open={!!deleteId}
                        onOpenChange={() => setDeleteId(null)}
                    >
                        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    {t('confirm_delete_employer')}
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                    className={cn(
                                        isRTL ? 'text-right' : 'text-left',
                                    )}
                                >
                                    {t('are_you_sure_delete')}
                                    <br />
                                    <span className="mt-2 inline-block text-xs font-semibold text-muted-foreground">
                                        {t('employers.delete_warning')}
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                                <AlertDialogCancel>
                                    {t('cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={confirmDelete}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {t('delete')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}
