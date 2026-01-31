import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

// Icons
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpDown,
    Building2,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    MapPin,
    MoreHorizontal,
    Plus,
    RotateCcw,
    Search,
    Trash2,
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

interface Bank {
    id: number;
    name_ar: string;
}

interface Branch {
    id: number;
    name_ar: string;
    created_at: string;
}

interface Props {
    bank: Bank;
    branches: {
        data: Branch[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
    };
}

export default function Index({ bank, branches, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banks.title'), href: '/banks' },
        { title: bank.name_ar, href: `/banks/${bank.id}` },
        { title: t('branches.title'), href: `/banks/${bank.id}/branches` },
    ];

    const columnHelper = createColumnHelper<Branch>();

    const columns = useMemo<ColumnDef<Branch, any>[]>(
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
                header: t('branches.name_ar'),
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-bold">{info.getValue()}</span>
                    </div>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: t('actions'),
                cell: (info) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
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
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/banks/${bank.id}/branches/${info.row.original.id}`}
                                >
                                    <Eye
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />{' '}
                                    {t('view')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/banks/${bank.id}/branches/${info.row.original.id}/edit`}
                                >
                                    <Edit
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />{' '}
                                    {t('edit')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10"
                                onClick={() => {
                                    if (confirm(t('branches.confirm_delete'))) {
                                        router.delete(
                                            `/banks/${bank.id}/branches/${info.row.original.id}`,
                                            {
                                                onSuccess: () =>
                                                    toast({
                                                        title: t(
                                                            'branches.deleted_successfully',
                                                        ),
                                                    }),
                                            },
                                        );
                                    }
                                }}
                            >
                                <Trash2
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'ml-2' : 'mr-2',
                                    )}
                                />{' '}
                                {t('delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            }),
        ],
        [t, isRTL, bank.id],
    );

    const table = useReactTable({
        data: branches.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, columnVisibility },
    });

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            router.get(
                `/banks/${bank.id}/branches`,
                { search: value },
                { preserveState: true, replace: true },
            );
        }, 400);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('branches.title')} - ${bank.name_ar}`} />

            <div
                className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="h-10 w-10 rounded-full"
                        >
                            <Link href="/banks">
                                {isRTL ? (
                                    <ArrowRight className="h-5 w-5" />
                                ) : (
                                    <ArrowLeft className="h-5 w-5" />
                                )}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                                {bank.name_ar} - {t('branches.title')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('branches.manage_branches')}
                            </p>
                        </div>
                    </div>
                    <Button asChild className="shadow-sm">
                        <Link href={`/banks/${bank.id}/branches/create`}>
                            <Plus
                                className={cn(
                                    'h-4 w-4',
                                    isRTL ? 'ml-2' : 'mr-2',
                                )}
                            />
                            {t('branches.add_branch')}
                        </Link>
                    </Button>
                </div>

                {/* Search Bar */}
                <Card className="border-none bg-muted/40 shadow-none">
                    <CardContent className="flex gap-4 p-4">
                        <div className="relative max-w-md flex-1">
                            <Search
                                className={cn(
                                    'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                    isRTL ? 'right-3' : 'left-3',
                                )}
                            />
                            <Input
                                placeholder={t('branches.search_branches')}
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className={cn(
                                    'bg-background',
                                    isRTL ? 'pr-10' : 'pl-10',
                                )}
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                router.get(`/banks/${bank.id}/branches`)
                            }
                            className="bg-background"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left'
                                            }
                                        >
                                            <div
                                                className={cn(
                                                    'flex items-center gap-2',
                                                    header.column.getCanSort() &&
                                                        'cursor-pointer select-none',
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                                <ArrowUpDown className="h-3 w-3 opacity-50" />
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {branches.data.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="transition-colors hover:bg-muted/20"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
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
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        {t('branches.no_branches')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {branches.last_page > 1 && (
                    <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
                        <p className="text-sm text-muted-foreground italic">
                            {t('showing')}{' '}
                            <span className="font-medium text-foreground">
                                {branches.from}
                            </span>{' '}
                            {t('to')}{' '}
                            <span className="font-medium text-foreground">
                                {branches.to}
                            </span>{' '}
                            {t('of')}{' '}
                            <span className="font-medium text-foreground">
                                {branches.total}
                            </span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(`/banks/${bank.id}/branches`, {
                                        page: branches.current_page - 1,
                                        search: searchTerm,
                                    })
                                }
                                disabled={branches.current_page === 1}
                            >
                                <ChevronLeft
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'ml-1' : 'mr-1',
                                    )}
                                />
                                {t('previous')}
                            </Button>
                            <span className="px-4 text-sm font-medium">
                                {branches.current_page} / {branches.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(`/banks/${bank.id}/branches`, {
                                        page: branches.current_page + 1,
                                        search: searchTerm,
                                    })
                                }
                                disabled={
                                    branches.current_page === branches.last_page
                                }
                            >
                                {t('next')}
                                <ChevronRight
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'mr-1' : 'ml-1',
                                    )}
                                />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
