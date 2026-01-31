import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
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
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UserCircle,
} from 'lucide-react';

import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

// --- Interfaces ---
interface Compensation {
    id: number;
    martyr_name: string;
    martyr_national_id: string;
    military_rank?: string;
    amount: number;
    receipt_date_formatted: string;
}

interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
}

interface Props {
    compensations: {
        data: Compensation[];
        total: number;
        from: number;
        to: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    martyrs: Martyr[];
    parentsStatuses: { id: number; name_ar: string; name_en: string }[];
    employmentStatuses: { id: number; name: string }[];
    filters: any;
}

const columnHelper = createColumnHelper<Compensation>();

export default function Index({
    compensations,
    martyrs,
    parentsStatuses,
    employmentStatuses,
    filters,
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { can } = usePermissions('compensations');

    // States
    const [search, setSearch] = useState(filters.search || '');
    const [selectedMartyr, setSelectedMartyr] = useState(
        filters.martyr_id && filters.martyr_id !== ''
            ? filters.martyr_id
            : 'all',
    );
    const [pStatus, setPStatus] = useState(
        filters.parents_status_id && filters.parents_status_id !== ''
            ? filters.parents_status_id
            : 'all',
    );
    const [eStatus, setEStatus] = useState(
        filters.employment_status_id && filters.employment_status_id !== ''
            ? filters.employment_status_id
            : 'all',
    );
    const [sorting, setSorting] = useState<SortingState>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const columns = useMemo<ColumnDef<Compensation, any>[]>(
        () => [
            columnHelper.accessor('martyr_name', {
                header: t('compensations.martyr_name'),
                cell: ({ row }) => (
                    <div className="flex items-center gap-3 font-medium">
                        <UserCircle className="h-8 w-8 text-muted-foreground/50" />
                        <div className="grid gap-0.5">
                            <span className="line-clamp-1 text-sm">
                                {row.original.martyr_name}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                                {row.original.martyr_national_id}
                            </span>
                        </div>
                    </div>
                ),
            }),
            columnHelper.accessor('military_rank', {
                header: t('martyrs.military_rank'),
                cell: ({ row }) => (
                    <Badge variant="secondary" className="rounded-md">
                        {row.original.military_rank || '-'}
                    </Badge>
                ),
            }),
            columnHelper.accessor('amount', {
                header: t('compensations.amount'),
                cell: ({ row }) => (
                    <span className="font-bold text-primary">
                        {new Intl.NumberFormat('ar-LY', {
                            style: 'currency',
                            currency: 'LYD',
                        }).format(row.original.amount)}
                    </span>
                ),
            }),
            columnHelper.accessor('receipt_date_formatted', {
                header: t('compensations.receipt_date'),
            }),
            columnHelper.display({
                id: 'actions',
                cell: ({ row }) => (
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
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(
                                        `/compensations/${row.original.id}`,
                                    )
                                }
                            >
                                <Eye className="mr-2 h-4 w-4" /> {t('view')}
                            </DropdownMenuItem>
                            {can('canUpdate') && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.get(
                                            `/compensations/${row.original.id}/edit`,
                                        )
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4" />{' '}
                                    {t('edit')}
                                </DropdownMenuItem>
                            )}
                            {can('canDelete') && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() =>
                                            setDeleteId(row.original.id)
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                        {t('delete')}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            }),
        ],
        [t, isRTL, can],
    );

    const table = useReactTable({
        data: compensations.data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSearch = () => {
        router.get(
            '/compensations',
            {
                search: search || undefined,
                martyr_id:
                    selectedMartyr === 'all' ? undefined : selectedMartyr,
                parents_status_id: pStatus === 'all' ? undefined : pStatus,
                employment_status_id: eStatus === 'all' ? undefined : eStatus,
            },
            { preserveState: true },
        );
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/compensations/${deleteId}`, {
                onSuccess: () => {
                    toast({
                        title: t('compensations.deleted'),
                        variant: 'default',
                    });
                    setDeleteId(null);
                },
            });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('compensations.title'), href: '/compensations' },
            ]}
        >
            <Head title={t('compensations.title')} />

            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
                {/* Top Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            {t('compensations.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('compensations.description')}
                        </p>
                    </div>
                    {can('canCreate') && (
                        <Button asChild size="lg" className="shadow-md">
                            <Link href="/compensations/create">
                                <Plus className="mr-2 h-5 w-5" />{' '}
                                {t('compensations.add_compensation')}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filters Section */}
                <Card className="border-muted/60 shadow-sm">
                    <CardContent className="flex flex-wrap items-end gap-3 p-4">
                        <div className="min-w-[240px] flex-1 space-y-1.5">
                            <span className="ml-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('search')}
                            </span>
                            <div className="relative">
                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('search_placeholder')}
                                    className="bg-muted/20 pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSearch()
                                    }
                                />
                            </div>
                        </div>

                        <div className="w-[200px] space-y-1.5">
                            <span className="ml-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                {t('compensations.filter_by_martyr')}
                            </span>
                            <Select
                                value={selectedMartyr}
                                onValueChange={setSelectedMartyr}
                            >
                                <SelectTrigger className="bg-muted/20">
                                    <SelectValue
                                        placeholder={t('all_martyrs')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('all_martyrs')}
                                    </SelectItem>
                                    {martyrs
                                        .filter(
                                            (m) =>
                                                m.id &&
                                                m.id.toString().trim() !== '',
                                        )
                                        .map((m) => (
                                            <SelectItem
                                                key={m.id}
                                                value={m.id.toString()}
                                            >
                                                {m.full_name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4" />{' '}
                                    {t('advanced_filters')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 space-y-4 p-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t('martyrs.parents_status')}
                                    </label>
                                    <Select
                                        value={pStatus}
                                        onValueChange={setPStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('all')}
                                            </SelectItem>
                                            {parentsStatuses
                                                .filter(
                                                    (s) =>
                                                        s.id &&
                                                        s.id
                                                            .toString()
                                                            .trim() !== '',
                                                )
                                                .map((s) => (
                                                    <SelectItem
                                                        key={s.id}
                                                        value={s.id.toString()}
                                                    >
                                                        {isRTL
                                                            ? s.name_ar
                                                            : s.name_en}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {t('martyrs.employment_status')}
                                    </label>
                                    <Select
                                        value={eStatus}
                                        onValueChange={setEStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('all')}
                                            </SelectItem>
                                            {employmentStatuses
                                                .filter(
                                                    (s) =>
                                                        s.id &&
                                                        s.id
                                                            .toString()
                                                            .trim() !== '',
                                                )
                                                .map((s) => (
                                                    <SelectItem
                                                        key={s.id}
                                                        value={s.id.toString()}
                                                    >
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleSearch}
                                >
                                    {t('apply_filters')}
                                </Button>
                            </PopoverContent>
                        </Popover>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleSearch}
                                variant="default"
                                className="px-6"
                            >
                                {t('apply')}
                            </Button>
                            <Button
                                onClick={() => router.get('/compensations')}
                                variant="ghost"
                                size="icon"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-12 font-bold text-foreground/80"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="group transition-colors hover:bg-muted/30"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-3"
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
                                        className="h-32 text-center text-muted-foreground italic"
                                    >
                                        {t('no_results')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Footer / Pagination */}
                    <div className="flex items-center justify-between border-t bg-muted/5 p-4">
                        <span className="text-sm text-muted-foreground">
                            {t('showing')} <b>{compensations.from}</b> -{' '}
                            <b>{compensations.to}</b> {t('of')}{' '}
                            <b>{compensations.total}</b>
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!compensations.links[0].url}
                                onClick={() =>
                                    router.get(compensations.links[0].url!)
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />{' '}
                                {t('previous')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    !compensations.links[
                                        compensations.links.length - 1
                                    ].url
                                }
                                onClick={() =>
                                    router.get(
                                        compensations.links[
                                            compensations.links.length - 1
                                        ].url!,
                                    )
                                }
                            >
                                {t('next')} <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('confirm_delete')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('delete_warning_message') ||
                                'Are you sure? This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
