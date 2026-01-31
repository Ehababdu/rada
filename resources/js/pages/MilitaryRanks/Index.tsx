import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

// Icons
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FilterX,
    MoreHorizontal,
    Plus,
    Search,
    Settings2,
    Shield,
    Trash2,
} from 'lucide-react';

import { usePermissions } from '@/hooks/use-permissions';
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

interface MilitaryRank {
    id: number;
    name_ar: string;
    name_en: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    militaryRanks: {
        data: MilitaryRank[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        is_active: string;
    };
}

export default function Index({ militaryRanks, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { flash } = usePage<SharedData>().props;
    const { can } = usePermissions('military-ranks');

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('military_ranks.title'), href: '/military-ranks' },
    ];

    const columnHelper = createColumnHelper<MilitaryRank>();

    const columns = useMemo<ColumnDef<MilitaryRank, any>[]>(
        () => [
            columnHelper.accessor('id', {
                header: '#',
                cell: (info) => (
                    <span className="font-mono text-muted-foreground">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('name_ar', {
                header: t('military_ranks.name_ar'),
                cell: (info) => (
                    <div className="font-bold">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('name_en', {
                header: t('military_ranks.name_en'),
                cell: (info) => (
                    <span className="text-muted-foreground">
                        {info.getValue() || '-'}
                    </span>
                ),
            }),
            columnHelper.accessor('order', {
                header: t('military_ranks.order'),
                cell: (info) => (
                    <Badge variant="secondary" className="font-mono">
                        {info.getValue()}
                    </Badge>
                ),
            }),
            columnHelper.accessor('is_active', {
                header: t('military_ranks.status'),
                cell: (info) => (
                    <Badge
                        variant={info.getValue() ? 'default' : 'destructive'}
                        className={cn(
                            info.getValue()
                                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                                : '',
                        )}
                    >
                        {info.getValue() ? t('active') : t('inactive')}
                    </Badge>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: t('actions'),
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
                            className="w-40"
                        >
                            {can('canViewDetails') && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/military-ranks/${info.row.original.id}`}
                                    >
                                        <Eye
                                            className={cn(
                                                'h-4 w-4',
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
                                        href={`/military-ranks/${info.row.original.id}/edit`}
                                    >
                                        <Edit
                                            className={cn(
                                                'h-4 w-4',
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
                                        onClick={() =>
                                            handleDelete(info.row.original.id)
                                        }
                                        className="text-destructive focus:text-destructive"
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
        [t, isRTL],
    );

    const table = useReactTable({
        data: militaryRanks.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, columnVisibility },
    });

    const triggerSearch = useCallback((search: string, status: string) => {
        router.get(
            '/military-ranks',
            { search, is_active: status },
            { preserveState: true, replace: true },
        );
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(
            () => triggerSearch(value, filters.is_active),
            400,
        );
    };

    const handleStatusChange = (value: string) => {
        triggerSearch(searchTerm, value === 'all' ? '' : value);
    };

    const handleDelete = (id: number) => {
        if (confirm(t('confirm_delete_military_rank'))) {
            router.delete(`/military-ranks/${id}`, {
                onSuccess: () =>
                    toast({ title: t('military_rank_deleted_successfully') }),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('military_ranks.title')} />

            <div
                className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('military_ranks.title')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('military_ranks.manage_ranks')}
                            </p>
                        </div>
                    </div>
                    {can('canCreate') && (
                        <Button asChild className="shrink-0">
                            <Link href="/military-ranks/create">
                                <Plus
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'ml-2' : 'mr-2',
                                    )}
                                />
                                {t('military_ranks.add_rank')}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filters Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex min-w-[300px] flex-1 items-center gap-2">
                        <div className="relative w-full max-w-sm">
                            <Search
                                className={cn(
                                    'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                    isRTL ? 'right-3' : 'left-3',
                                )}
                            />
                            <Input
                                placeholder={t('military_ranks.search_ranks')}
                                value={searchTerm}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className={cn(isRTL ? 'pr-10' : 'pl-10')}
                            />
                        </div>

                        <Select
                            onValueChange={handleStatusChange}
                            defaultValue={filters.is_active || 'all'}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue
                                    placeholder={t('military_ranks.all_status')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t('military_ranks.all_status')}
                                </SelectItem>
                                <SelectItem value="1">{t('active')}</SelectItem>
                                <SelectItem value="0">
                                    {t('inactive')}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {(searchTerm || filters.is_active) && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSearchTerm('');
                                    triggerSearch('', '');
                                }}
                                className="text-muted-foreground"
                            >
                                <FilterX
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'ml-2' : 'mr-2',
                                    )}
                                />
                                {t('reset')}
                            </Button>
                        )}
                    </div>

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
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.columnDef.header as string}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table Content */}
                <Card className="overflow-hidden border-none shadow-sm">
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
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: (
                                                            <ArrowUp className="h-3 w-3 text-primary" />
                                                        ),
                                                        desc: (
                                                            <ArrowDown className="h-3 w-3 text-primary" />
                                                        ),
                                                    }[
                                                        header.column.getIsSorted() as string
                                                    ] ??
                                                        (header.column.getCanSort() && (
                                                            <ArrowUpDown className="h-3 w-3 opacity-30" />
                                                        ))}
                                                </div>
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {militaryRanks.data.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="group transition-colors hover:bg-muted/30"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-4"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
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
                                            <Shield className="h-12 w-12 opacity-10" />
                                            <p>
                                                {t('military_ranks.no_ranks')}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Pagination */}
                {militaryRanks.last_page > 1 && (
                    <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                        <div className="order-2 text-sm text-muted-foreground sm:order-1">
                            {t('showing')}{' '}
                            <span className="font-bold text-foreground">
                                {militaryRanks.from}
                            </span>{' '}
                            {t('to')}{' '}
                            <span className="font-bold text-foreground">
                                {militaryRanks.to}
                            </span>{' '}
                            {t('of')}{' '}
                            <span className="font-bold text-foreground">
                                {militaryRanks.total}
                            </span>{' '}
                            {t('records')}
                        </div>
                        <div className="order-1 flex items-center gap-2 sm:order-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get('/military-ranks', {
                                        page: militaryRanks.current_page - 1,
                                        search: searchTerm,
                                        is_active: filters.is_active,
                                    })
                                }
                                disabled={militaryRanks.current_page === 1}
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
                                    {militaryRanks.current_page}
                                </Badge>
                                <span className="text-muted-foreground">/</span>
                                <span className="text-sm font-medium">
                                    {militaryRanks.last_page}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get('/military-ranks', {
                                        page: militaryRanks.current_page + 1,
                                        search: searchTerm,
                                        is_active: filters.is_active,
                                    })
                                }
                                disabled={
                                    militaryRanks.current_page ===
                                    militaryRanks.last_page
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
        </AppLayout>
    );
}
