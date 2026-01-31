import { Head, Link, router } from '@inertiajs/react';
import {
    ColumnDef,
    SortingState,
    VisibilityState,
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
    MoreHorizontal,
    Plus,
    Shield,
    Sparkles,
    SquarePen,
    Trash2,
    UserCheck,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import Combobox from '@/components/ui/combobox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

// --- Sub-Components ---
const StatCard = ({
    label,
    value,
    icon,
    tone = 'default',
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone?: 'default' | 'danger';
}) => (
    <div
        className={cn(
            'flex flex-col items-center justify-center rounded-xl p-3 transition-all hover:scale-105',
            tone === 'danger'
                ? 'border border-red-500/30 bg-red-500/20'
                : 'border border-white/20 bg-white/10',
        )}
    >
        <div className="mb-1 text-slate-300">{icon}</div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-[10px] tracking-wider text-slate-400 uppercase">
            {label}
        </div>
    </div>
);

// --- Main Component ---
export default function Index({ promotions, martyrs, filters }: Props) {
    const { t } = useTranslation();
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
    const [columnVisibility, setColumnVisibility] = useState<
        Record<TabKey, VisibilityState>
    >({
        employees: { description: false },
        military: { description: false },
    });
    const [deletePromotion, setDeletePromotion] = useState<PromotionRow | null>(
        null,
    );
    const [confirmPromotion, setConfirmPromotion] =
        useState<PromotionRow | null>(null);

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
        state: { sorting, columnVisibility: columnVisibility[activeTab] },
        onSortingChange: setSorting,
        onColumnVisibilityChange: (updater) => {
            const next =
                typeof updater === 'function'
                    ? updater(columnVisibility[activeTab])
                    : updater;
            setColumnVisibility((prev) => ({ ...prev, [activeTab]: next }));
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('promotions.title')} />

            <div className="space-y-6 pb-8">
                {/* Header Stats Card */}
                <Card className="mx-4 mt-6 overflow-hidden border-0 bg-slate-900 text-white shadow-xl md:mx-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase">
                                    <Sparkles className="h-4 w-4" />{' '}
                                    {t('promotions.title')}
                                </div>
                                <h1 className="text-2xl font-black">
                                    {t('promotions.promotion_details') ||
                                        'إدارة الترقيات'}
                                </h1>
                                <p className="max-w-md text-sm text-slate-400">
                                    نظام تتبع الاستحقاقات الدورية للموظفين
                                    والعسكريين.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <StatCard
                                    label="الإجمالي"
                                    value={stats.total}
                                    icon={<Sparkles className="h-4 w-4" />}
                                />
                                <StatCard
                                    label="موظفين"
                                    value={stats.employees}
                                    icon={<UserCheck className="h-4 w-4" />}
                                />
                                <StatCard
                                    label="عسكريين"
                                    value={stats.military}
                                    icon={<Shield className="h-4 w-4" />}
                                />
                                <StatCard
                                    label="متأخرة"
                                    value={stats.overdue}
                                    icon={<AlertCircle className="h-4 w-4" />}
                                    tone="danger"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <Card className="mx-4 md:mx-8">
                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleFilterSubmit}
                            className="flex flex-wrap items-end gap-4"
                        >
                            <div className="min-w-[250px] flex-1 space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">
                                    {t('search')}
                                </label>
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="الاسم أو الرقم الوطني..."
                                />
                            </div>
                            <div className="min-w-[250px] flex-1 space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">
                                    {t('promotions.martyr')}
                                </label>
                                <Combobox
                                    value={martyrId}
                                    onChange={setMartyrId}
                                    options={martyrOptions}
                                    placeholder="اختر الشهيد..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">{t('search')}</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    {t('clear')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tabs & Table */}
                <div className="space-y-4 px-4 md:px-8">
                    <div className="flex items-center justify-between">
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
                        <div className="flex gap-2">
                            {canCreate && (
                                <Link href="/promotions/create">
                                    <Button size="sm">
                                        <Plus className="ml-2 h-4 w-4" />{' '}
                                        {t('promotions.add_promotion') ||
                                            'إضافة ترقية'}
                                    </Button>
                                </Link>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    /* logic for export */
                                }}
                            >
                                <Download className="ml-2 h-4 w-4" /> تصدير
                            </Button>
                        </div>
                    </div>

                    <Card className="border-muted shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    {table.getHeaderGroups().map((hg) => (
                                        <TableRow key={hg.id}>
                                            {hg.headers.map((h) => (
                                                <TableHead
                                                    key={h.id}
                                                    className="text-right font-bold text-slate-700"
                                                >
                                                    {flexRender(
                                                        h.column.columnDef
                                                            .header,
                                                        h.getContext(),
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
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="py-4 text-right"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
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
                                                لا توجد بيانات متاحة حالياً
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

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
    );
}

const EMPLOYEE_LABEL = 'ترقيات الموظفين';
const MILITARY_LABEL = 'ترقيات العسكريين';
