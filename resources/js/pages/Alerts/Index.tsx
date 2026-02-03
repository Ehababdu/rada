import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    Bell,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    FilterX,
    MoreHorizontal,
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

interface Alert {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read_at: string | null;
    created_at: string;
    is_read: boolean;
}

interface Props {
    alerts: {
        data: Alert[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        type: string;
        status: string;
    };
}

export default function Index({ alerts, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { auth } = usePage().props as unknown as SharedData;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Alert Dialog State
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [realTimeAlerts, setRealTimeAlerts] = useState<Alert[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('alerts.title', 'التنبيهات'), href: '/alerts' },
    ];

    // Real-time alerts listener
    useEffect(() => {
        if (!auth?.user?.id) return;

        const channel = window.Echo?.private(`alerts.${auth.user.id}`)
            .listen('.alert.created', (e: unknown) => {
                setRealTimeAlerts(prev => [e, ...prev]);
                toast({
                    title: e.title,
                    description: e.message,
                }, {
                    duration: 5000,
                });
            });

        return () => {
            channel?.stopListening('.alert.created');
        };
    }, [toast, auth?.user?.id]);

    // Combine real-time alerts with paginated alerts
    const allAlerts = useMemo(() => {
        const existingIds = new Set(alerts.data.map(alert => alert.id));
        const filteredRealTime = realTimeAlerts.filter(alert => !existingIds.has(alert.id));
        return [...filteredRealTime, ...alerts.data];
    }, [alerts.data, realTimeAlerts]);

    // Search Logic
    const performSearch = useCallback((params: Record<string, unknown>) => {
        router.get('/alerts', params as Record<string, unknown>, {
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
        router.get('/alerts');
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/alerts/${deleteId}`, {
                onSuccess: () => {
                    toast({ title: t('alert_deleted_successfully', 'تم حذف التنبيه بنجاح') });
                    setDeleteId(null);
                },
                onFinish: () => setDeleteId(null),
            });
        }
    };

    const markAsRead = (id: number) => {
        router.post(`/alerts/${id}/mark-as-read`, {}, {
            onSuccess: () => {
                toast({ title: t('alert_marked_as_read', 'تم تحديد التنبيه كمقروء') });
                router.reload({ only: ['alerts'] });
            },
        });
    };

    const markAsUnread = (id: number) => {
        router.post(`/alerts/${id}/mark-as-unread`, {}, {
            onSuccess: () => {
                toast({ title: t('alert_marked_as_unread', 'تم تحديد التنبيه كغير مقروء') });
                router.reload({ only: ['alerts'] });
            },
        });
    };

    const markAllAsRead = () => {
        router.post('/alerts/mark-all-as-read', {}, {
            onSuccess: () => {
                toast({ title: t('all_alerts_marked_as_read', 'تم تحديد جميع التنبيهات كمقروءة') });
                router.reload({ only: ['alerts'] });
            },
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <XCircle className="h-4 w-4 text-destructive" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'success':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            default:
                return <Bell className="h-4 w-4 text-blue-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'error':
                return 'border-red-500/20 bg-red-500/10 text-red-600';
            case 'warning':
                return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600';
            case 'success':
                return 'border-green-500/20 bg-green-500/10 text-green-600';
            default:
                return 'border-blue-500/20 bg-blue-500/10 text-blue-600';
        }
    };

    const columnHelper = createColumnHelper<Alert>();

    const columns = useMemo<ColumnDef<Alert, unknown>[]>(
        () => [
            columnHelper.accessor('id', {
                header: '#',
                cell: (info) => (
                    <span className="font-mono text-xs text-muted-foreground">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('title', {
                header: t('alerts.title', 'العنوان'),
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        {getTypeIcon(info.row.original.type)}
                        <div>
                            <span className="font-semibold">{info.getValue()}</span>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {info.row.original.message}
                            </p>
                        </div>
                    </div>
                ),
            }),
            columnHelper.accessor('type', {
                header: t('alerts.type', 'النوع'),
                cell: (info) => (
                    <Badge
                        variant="outline"
                        className={cn(
                            'gap-1',
                            getTypeColor(info.getValue()),
                        )}
                    >
                        {getTypeIcon(info.getValue())}
                        {String(t(`alerts.types.${info.getValue()}`, info.getValue()))}
                    </Badge>
                ),
            }),
            columnHelper.accessor('is_read', {
                header: t('alerts.status', 'الحالة'),
                cell: (info) => (
                    <Badge
                        variant={info.getValue() ? 'default' : 'secondary'}
                        className={cn(
                            'gap-1',
                            info.getValue()
                                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                                : 'border-orange-500/20 bg-orange-500/10 text-orange-600',
                        )}
                    >
                        {info.getValue() ? (
                            <CheckCircle2 className="h-3 w-3" />
                        ) : (
                            <Bell className="h-3 w-3" />
                        )}
                        {info.getValue()
                            ? t('alerts.read', 'مقروء')
                            : t('alerts.unread', 'غير مقروء')}
                    </Badge>
                ),
            }),
            columnHelper.accessor('created_at', {
                header: t('alerts.created_at', 'تاريخ الإنشاء'),
                cell: (info) => (
                    <span className="text-sm text-muted-foreground">
                        {info.getValue()}
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
                        <DropdownMenuContent
                            align={isRTL ? 'start' : 'end'}
                            className="w-44"
                        >
                            <DropdownMenuLabel>
                                {t('actions', 'الإجراءات')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/alerts/${info.row.original.id}`}
                                    className="flex cursor-pointer items-center"
                                >
                                    <Eye
                                        className={cn(
                                            'h-4 w-4 text-muted-foreground',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('view', 'عرض')}
                                </Link>
                            </DropdownMenuItem>
                            {!info.row.original.is_read && (
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => markAsRead(info.row.original.id)}
                                >
                                    <CheckCircle2
                                        className={cn(
                                            'h-4 w-4 text-muted-foreground',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('alerts.mark_as_read', 'تحديد كمقروء')}
                                </DropdownMenuItem>
                            )}
                            {info.row.original.is_read && (
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => markAsUnread(info.row.original.id)}
                                >
                                    <Bell
                                        className={cn(
                                            'h-4 w-4 text-muted-foreground',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('alerts.mark_as_unread', 'تحديد كغير مقروء')}
                                </DropdownMenuItem>
                            )}
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
                                {t('delete', 'حذف')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            }),
        ],
        [t, isRTL, columnHelper],
    );

    const table = useReactTable({
        data: allAlerts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, columnVisibility },
    });

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('alerts.title', 'التنبيهات')} />

                <div
                    className="space-y-6 p-6"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    {/* Header Section - Unified Design */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <Bell className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('alerts.title', 'التنبيهات')}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('alerts.manage_alerts', 'إدارة التنبيهات والإشعارات')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={markAllAsRead}
                                className="transition-all hover:scale-105"
                            >
                                <CheckCircle2
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'ml-2' : 'mr-2',
                                    )}
                                />
                                {t('alerts.mark_all_as_read', 'تحديد الكل كمقروء')}
                            </Button>
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
                                    placeholder={t('alerts.search_alerts', 'البحث في التنبيهات...')}
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

                            {/* Type Filter */}
                            <Select
                                value={filters.type || 'all'}
                                onValueChange={(val) =>
                                    performSearch({
                                        ...filters,
                                        type: val === 'all' ? '' : val,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t('alerts.all_types', 'جميع الأنواع')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('alerts.all_types', 'جميع الأنواع')}
                                    </SelectItem>
                                    <SelectItem value="info">
                                        {t('alerts.types.info', 'معلومات')}
                                    </SelectItem>
                                    <SelectItem value="warning">
                                        {t('alerts.types.warning', 'تحذير')}
                                    </SelectItem>
                                    <SelectItem value="error">
                                        {t('alerts.types.error', 'خطأ')}
                                    </SelectItem>
                                    <SelectItem value="success">
                                        {t('alerts.types.success', 'نجح')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(val) =>
                                    performSearch({
                                        ...filters,
                                        status: val === 'all' ? '' : val,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t('alerts.all_status', 'جميع الحالات')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('alerts.all_status', 'جميع الحالات')}
                                    </SelectItem>
                                    <SelectItem value="read">
                                        {t('alerts.read', 'مقروء')}
                                    </SelectItem>
                                    <SelectItem value="unread">
                                        {t('alerts.unread', 'غير مقروء')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {(searchTerm || filters.type || filters.status) && (
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
                                        <p>{t('reset', 'إعادة تعيين')}</p>
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
                                    {t('show_columns', 'إظهار الأعمدة')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align={isRTL ? 'start' : 'end'}
                                className="w-56"
                            >
                                <DropdownMenuLabel>
                                    {t('columns_visibility', 'رؤية الأعمدة')}
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
                                            {t(`alerts.${column.id}`, column.id)}
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
                                {allAlerts.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className={cn(
                                                'group transition-colors hover:bg-muted/30',
                                                !row.original.is_read && 'bg-blue-50/50 dark:bg-blue-950/20'
                                            )}
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
                                                <Bell className="h-12 w-12 opacity-10" />
                                                <p className="text-lg font-medium">
                                                    {t('no_results', 'لا توجد نتائج')}
                                                </p>
                                                <p className="text-sm">
                                                    {t('alerts.no_alerts', 'لا توجد تنبيهات')}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {alerts.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing', 'عرض')} {' '}
                                <span className="font-bold text-foreground">
                                    {alerts.from}
                                </span>{' '}
                                {t('to', 'إلى')}{' '}
                                <span className="font-bold text-foreground">
                                    {alerts.to}
                                </span>{' '}
                                {t('of', 'من')}{' '}
                                <span className="font-bold text-foreground">
                                    {alerts.total}
                                </span>{' '}
                                {t('records', 'سجل')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        performSearch({
                                            ...filters,
                                            page: alerts.current_page - 1,
                                        })
                                    }
                                    disabled={alerts.current_page === 1}
                                >
                                    {isRTL ? (
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    ) : (
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                    )}
                                    {t('previous', 'السابق')}
                                </Button>

                                <div className="mx-2 flex items-center gap-1">
                                    <Badge
                                        variant="outline"
                                        className="h-8 min-w-[32px] justify-center"
                                    >
                                        {alerts.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {alerts.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        performSearch({
                                            ...filters,
                                            page: alerts.current_page + 1,
                                        })
                                    }
                                    disabled={
                                        alerts.current_page === alerts.last_page
                                    }
                                >
                                    {t('next', 'التالي')}
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
                                    {t('confirm_delete_alert', 'تأكيد حذف التنبيه')}
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                    className={cn(
                                        isRTL ? 'text-right' : 'text-left',
                                    )}
                                >
                                    {t('are_you_sure_delete', 'هل أنت متأكد من الحذف؟')}
                                    <br />
                                    <span className="mt-2 inline-block text-xs font-semibold text-muted-foreground">
                                        {t('alerts.delete_warning', 'سيتم حذف هذا التنبيه نهائياً.')}
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                                <AlertDialogCancel>{t('cancel', 'إلغاء')}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={confirmDelete}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {t('delete', 'حذف')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}