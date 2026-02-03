import { Head, Link, router } from '@inertiajs/react';
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    AlertCircle,
    CheckCircle,
    Download,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Shield,
    Sparkles,
    SquarePen,
    Trash2,
    UserCheck,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import Combobox from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';

// --- Types ---
type PromotionRow = {
    id: number;
    martyr_id: number;
    martyr_name: string;
    martyr_national_id: string;
    current_rank: string;
    promotion_rank: string;
    current_job_grade: string;
    promotion_job_grade: string;
    current_job_grade_id?: number | null;
    promotion_job_grade_id?: number | null;
    current_rank_date?: string | null;
    obtained_date?: string | null;
    promotion_years: number;
    next_due_date: string;
    next_due_date_formatted: string;
    description?: string | null;
    status: string;
    status_label: string;
    created_at: string;
};

type MartyrOption = {
    id: number;
    full_name: string;
    national_id: string;
};

type Filters = {
    search?: string;
    martyr_id?: string;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
};

type TabKey = 'employees' | 'military';

interface Props {
    promotions: Paginated<PromotionRow>;
    martyrs: MartyrOption[];
    filters: Filters;
}

// --- Helpers ---
const formatValue = (value?: string | number | null): string => {
    if (value === null || value === undefined) return '—';
    return String(value) || '—';
};

const parseDate = (value?: string | null): Date | null => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value?: string | null): string => {
    const d = parseDate(value);
    if (!d) return '—';
    return d.toLocaleDateString('en-GB'); // DD/MM/YYYY
};

const isPromotionDue = (nextDueDate?: string | null): boolean => {
    if (!nextDueDate) return false;
    const dueDate = parseDate(nextDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate ? dueDate <= today : false;
};

// --- Main Component ---
export default function Index({ promotions, martyrs, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { can } = usePermissions('promotions');

    const canViewDetails = can('canViewDetails');
    const canUpdate = can('canUpdate');
    const canDelete = can('canDelete');
    const canCreate = can('canCreate');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('promotions.title'), href: '/promotions' },
    ];

    const [activeTab, setActiveTab] = useState<TabKey>('military');
    const [search, setSearch] = useState(filters.search || '');
    const [martyrId, setMartyrId] = useState(filters.martyr_id || '');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [deletePromotion, setDeletePromotion] = useState<PromotionRow | null>(
        null,
    );
    const [confirmPromotion, setConfirmPromotion] =
        useState<PromotionRow | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    '/promotions',
                    { search, martyr_id: martyrId, page: 1 },
                    { preserveState: true },
                );
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, martyrId, filters.search]);

    const partitioned = useMemo(() => {
        const employees: PromotionRow[] = [];
        const military: PromotionRow[] = [];
        (promotions.data || []).forEach((p) => {
            if (p.current_job_grade_id || p.promotion_job_grade_id)
                employees.push(p);
            else military.push(p);
        });
        return { employees, military };
    }, [promotions.data]);

    const activeData =
        activeTab === 'employees'
            ? partitioned.employees
            : partitioned.military;

    const stats = useMemo(
        () => ({
            total: promotions.total || 0,
            employees: partitioned.employees.length,
            military: partitioned.military.length,
            overdue: promotions.data.filter((p) =>
                isPromotionDue(p.next_due_date),
            ).length,
            upcoming: promotions.data.filter((p) => {
                const d = parseDate(p.next_due_date);
                if (!d) return false;
                const diff = Math.ceil(
                    (d.getTime() - Date.now()) / (1000 * 3600 * 24),
                );
                return diff <= 30 && diff > 0;
            }).length,
        }),
        [partitioned, promotions],
    );

    const martyrOptions = useMemo(
        () =>
            Object.fromEntries(
                martyrs.map((m) => [
                    m.id.toString(),
                    `${m.full_name} (${m.national_id})`,
                ]),
            ),
        [martyrs],
    );

    const handleFilterSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        router.get(
            '/promotions',
            { search, martyr_id: martyrId, page: 1 },
            { preserveState: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setMartyrId('');
        router.get('/promotions', {}, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deletePromotion) return;
        router.delete(`/promotions/${deletePromotion.id}`, {
            onSuccess: () => setDeletePromotion(null),
        });
    };

    const handleConfirmPromotion = () => {
        if (!confirmPromotion) return;
        router.post(
            `/promotions/${confirmPromotion.id}/confirm`,
            {},
            {
                onSuccess: () => setConfirmPromotion(null),
            },
        );
    };

    const columns = useMemo<ColumnDef<PromotionRow>[]>(() => {
        const cols: ColumnDef<PromotionRow>[] = [
            {
                accessorKey: 'martyr_name',
                header: t('promotions.martyr'),
                meta: { label: t('promotions.martyr') },
                cell: ({ row }) => (
                    <div className="space-y-1 text-right">
                        <div className="font-bold text-foreground">
                            {row.original.martyr_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {row.original.martyr_national_id}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey:
                    activeTab === 'military'
                        ? 'current_rank'
                        : 'current_job_grade',
                header:
                    activeTab === 'military'
                        ? t('promotions.current_rank')
                        : t('promotions.current_job_grade') || 'الدرجة الحالية',
                meta: {
                    label:
                        activeTab === 'military'
                            ? t('promotions.current_rank')
                            : 'الدرجة الحالية',
                },
                cell: ({ row }) => (
                    <Badge variant="outline" className="font-medium">
                        {formatValue(
                            activeTab === 'military'
                                ? row.original.current_rank
                                : row.original.current_job_grade,
                        )}
                    </Badge>
                ),
            },
            {
                accessorKey:
                    activeTab === 'military'
                        ? 'promotion_rank'
                        : 'promotion_job_grade',
                header:
                    activeTab === 'military'
                        ? t('promotions.promotion_rank')
                        : t('promotions.promotion_job_grade') ||
                          'الدرجة القادمة',
                meta: {
                    label:
                        activeTab === 'military'
                            ? t('promotions.promotion_rank')
                            : 'الدرجة القادمة',
                },
                cell: ({ row }) => (
                    <Badge
                        variant="secondary"
                        className="border-blue-100 bg-blue-50 font-bold text-blue-700"
                    >
                        {formatValue(
                            activeTab === 'military'
                                ? row.original.promotion_rank
                                : row.original.promotion_job_grade,
                        )}
                    </Badge>
                ),
            },
            {
                accessorKey: 'current_rank_date',
                header: t('promotions.obtained_date') || 'تاريخ الحصول',
                meta: { label: 'تاريخ الحصول' },
                cell: ({ row }) => (
                    <span className="text-sm">
                        {formatDate(row.original.current_rank_date)}
                    </span>
                ),
            },
            {
                accessorKey: 'promotion_years',
                header: t('promotions.promotion_years'),
                meta: { label: t('promotions.promotion_years') },
                cell: ({ row }) => (
                    <span className="font-semibold">
                        {row.original.promotion_years}
                    </span>
                ),
            },
            {
                accessorKey: 'next_due_date',
                header: t('promotions.next_due_date'),
                meta: { label: t('promotions.next_due_date') },
                cell: ({ row }) => (
                    <span
                        className={cn(
                            'text-sm font-medium',
                            isPromotionDue(row.original.next_due_date)
                                ? 'animate-pulse text-red-600'
                                : 'text-muted-foreground',
                        )}
                    >
                        {row.original.next_due_date_formatted}
                    </span>
                ),
            },
            {
                accessorKey: 'status_label',
                header: t('promotions.status') || 'الحالة',
                meta: { label: 'الحالة' },
                cell: ({ row }) => {
                    const status = row.original.status;
                    return (
                        <Badge
                            className={cn(
                                status === 'pending' &&
                                    'border-amber-200 bg-amber-100 text-amber-700',
                                status === 'overdue' &&
                                    'border-red-200 bg-red-100 text-red-700',
                                status === 'completed' &&
                                    'border-green-200 bg-green-100 text-green-700',
                            )}
                        >
                            {row.original.status_label}
                        </Badge>
                    );
                },
            },
            {
                id: 'actions',
                header: t('actions'),
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {canViewDetails && (
                                <Link href={`/promotions/${row.original.id}`}>
                                    <DropdownMenuItem>
                                        <Eye className="ml-2 h-4 w-4" />{' '}
                                        {t('view')}
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            {canUpdate && (
                                <Link
                                    href={`/promotions/${row.original.id}/edit`}
                                >
                                    <DropdownMenuItem>
                                        <SquarePen className="ml-2 h-4 w-4" />{' '}
                                        {t('edit')}
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            {canUpdate &&
                                isPromotionDue(row.original.next_due_date) &&
                                row.original.status !== 'completed' && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setConfirmPromotion(row.original)
                                        }
                                        className="text-green-600"
                                    >
                                        <CheckCircle className="ml-2 h-4 w-4" />{' '}
                                        {t('confirm_promotion') ||
                                            'تأكيد الترقية'}
                                    </DropdownMenuItem>
                                )}
                            {canDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setDeletePromotion(row.original)
                                        }
                                        className="text-destructive"
                                    >
                                        <Trash2 className="ml-2 h-4 w-4" />{' '}
                                        {t('delete')}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ];
        return cols;
    }, [activeTab, t, canViewDetails, canUpdate, canDelete]);

    const table = useReactTable({
        data: activeData,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('promotions.title')} />

                <div className="space-y-6 p-6">
                {/* Header Stats / Info */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('promotions.title')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('promotions.promotion_details') ||
                                    'إدارة الترقيات'}
                            </p>
                        </div>
                    </div>
                    {canCreate && (
                        <Button asChild className="transition-all hover:scale-105">
                            <Link href="/promotions/create">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('promotions.create')}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 shadow-sm">
                        <Sparkles className="mb-2 h-6 w-6 text-primary" />
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-xs text-muted-foreground">الإجمالي</div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 shadow-sm">
                        <UserCheck className="mb-2 h-6 w-6 text-primary" />
                        <div className="text-2xl font-bold">{stats.employees}</div>
                        <div className="text-xs text-muted-foreground">موظفين</div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 shadow-sm">
                        <Shield className="mb-2 h-6 w-6 text-primary" />
                        <div className="text-2xl font-bold">{stats.military}</div>
                        <div className="text-xs text-muted-foreground">عسكريين</div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 shadow-sm border-red-200 bg-red-50">
                        <AlertCircle className="mb-2 h-6 w-6 text-red-600" />
                        <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                        <div className="text-xs text-red-600">متأخرة</div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col items-start justify-between gap-4 px-4 md:px-8 md:flex-row md:items-center">
                    {/* Search & Tabs */}
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:flex-1">
                        <div className="relative w-full sm:w-72 md:flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="الاسم أو الرقم الوطني..."
                                className="w-full bg-background pl-9 transition-all focus:ring-2 focus:ring-primary/20"
                                value={search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex rounded-lg bg-muted p-1">
                            <Button
                                variant={
                                    activeTab === 'military'
                                        ? 'default'
                                        : 'ghost'
                                }
                                size="sm"
                                onClick={() => setActiveTab('military')}
                                className="rounded-md"
                            >
                                <Shield className="ml-2 h-4 w-4" />{' '}
                                {MILITARY_LABEL}
                            </Button>
                            <Button
                                variant={
                                    activeTab === 'employees'
                                        ? 'default'
                                        : 'ghost'
                                }
                                size="sm"
                                onClick={() => setActiveTab('employees')}
                                className="rounded-md"
                            >
                                <UserCheck className="ml-2 h-4 w-4" />{' '}
                                {EMPLOYEE_LABEL}
                            </Button>
                        </div>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
                        {/* Filters Sheet */}
                        <Sheet
                            open={isFiltersOpen}
                            onOpenChange={setIsFiltersOpen}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            title="الفلاتر المتقدمة"
                                            className="transition-colors hover:bg-accent"
                                        >
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </SheetTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>الفلاتر المتقدمة</p>
                                </TooltipContent>
                            </Tooltip>
                            <SheetContent
                                side={isRTL ? 'left' : 'right'}
                                className="w-full p-0 sm:max-w-md"
                            >
                                <SheetHeader className="border-b p-6">
                                    <SheetTitle>الفلاتر المتقدمة</SheetTitle>
                                    <SheetDescription>
                                        قم بتطبيق فلاتر متقدمة للبحث عن الترقيات
                                    </SheetDescription>
                                </SheetHeader>
                                <ScrollArea className="h-[calc(100vh-10rem)] p-6">
                                    <div className="grid gap-6">
                                        {/* Filters Fields */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>الشهيد</Label>
                                                <Combobox
                                                    value={martyrId}
                                                    onChange={setMartyrId}
                                                    options={martyrOptions}
                                                    placeholder="اختر الشهيد..."
                                                />
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    handleFilterSubmit();
                                                    setIsFiltersOpen(false);
                                                }}
                                                className="flex-1"
                                            >
                                                تطبيق الفلاتر
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    clearFilters();
                                                    setIsFiltersOpen(false);
                                                }}
                                                className="flex-1"
                                            >
                                                مسح الفلاتر
                                            </Button>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>

                        {/* Export Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        router.get('/promotions/export', {
                                            tab: activeTab,
                                            search,
                                            martyr_id: martyrId,
                                        })
                                    }
                                    className="transition-colors hover:bg-accent"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>تصدير إلى Excel</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Table */}
                <div className="flex flex-col gap-4">
                    <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 border-muted shadow-sm">
                        <div data-slot="card-content" className="p-0">
                            <div data-slot="table-container" className="relative w-full overflow-x-auto">
                                <table data-slot="table" className="w-full caption-bottom text-sm">
                                    <thead data-slot="table-header" className="[&_tr]:border-b bg-muted/50">
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr
                                                key={headerGroup.id}
                                                data-slot="table-row"
                                                className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                            >
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        data-slot="table-head"
                                                        className="h-10 px-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right font-bold text-slate-700"
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                  header.column.columnDef.header,
                                                                  header.getContext()
                                                              )}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody data-slot="table-body" className="[&_tr:last-child]:border-0">
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    data-slot="table-row"
                                                    className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <td
                                                            key={cell.id}
                                                            data-slot="table-cell"
                                                            className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                                                        >
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                                <td
                                                    data-slot="table-cell"
                                                    className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] h-32 text-center text-muted-foreground"
                                                    colSpan={columns.length}
                                                >
                                                    لا توجد بيانات متاحة حالياً
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    {promotions.last_page > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-muted-foreground">
                                عرض {promotions.from} إلى {promotions.to} من أصل{' '}
                                {promotions.total}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={promotions.current_page === 1}
                                    onClick={() =>
                                        router.get('/promotions', {
                                            ...filters,
                                            page: promotions.current_page - 1,
                                        })
                                    }
                                >
                                    السابق
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        promotions.current_page ===
                                        promotions.last_page
                                    }
                                    onClick={() =>
                                        router.get('/promotions', {
                                            ...filters,
                                            page: promotions.current_page + 1,
                                        })
                                    }
                                >
                                    التالي
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AlertDialog
                open={!!deletePromotion}
                onOpenChange={() => setDeletePromotion(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            هل أنت متأكد من الحذف؟
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            سيتم حذف سجل الترقية الخاص بـ (
                            {deletePromotion?.martyr_name}) بشكل نهائي.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            تأكيد الحذف
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={!!confirmPromotion}
                onOpenChange={() => setConfirmPromotion(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            تأكيد استحقاق الترقية
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            أنت على وشك تأكيد ترقية{' '}
                            <strong>{confirmPromotion?.martyr_name}</strong> إلى
                            <strong>
                                {' '}
                                {confirmPromotion?.promotion_rank ||
                                    confirmPromotion?.promotion_job_grade}
                            </strong>
                            . سيتم تحديث حالة السجل إلى "مكتمل".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmPromotion}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            تأكيد الترقية الآن
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </AppLayout>
        </TooltipProvider>
    );
}

const EMPLOYEE_LABEL = 'ترقيات الموظفين';
const MILITARY_LABEL = 'ترقيات العسكريين';
