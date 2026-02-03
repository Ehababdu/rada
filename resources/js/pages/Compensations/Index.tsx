import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Icons
import {
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

import { ColumnDef } from '@tanstack/react-table';

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

interface Filters {
    search?: string;
    martyr_id?: string;
    parents_status_id?: string;
    employment_status_id?: string;
}

interface Props {
    compensations: {
        data: Compensation[];
        total: number;
        from: number;
        to: number;
        last_page: number;
        current_page: number;
        per_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    martyrs: Martyr[];
    parentsStatuses: { id: number; name_ar: string; name_en: string }[];
    employmentStatuses: { id: number; name: string }[];
    filters: Filters;
}

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

    const canViewDetails = can('canRead');
    const canUpdate = can('canUpdate');
    const canDelete = can('canDelete');
    const canCreate = can('canCreate');

    // State
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter Logic
    const handleFilterChange = (key: keyof Filters, value: string) => {
        const newValue = value === 'all' ? '' : value;
        setLocalFilters((prev) => ({ ...prev, [key]: newValue }));
    };

    const cleanFilters = (f: Filters) => {
        return Object.entries(f).reduce<Record<string, string>>(
            (acc, [k, v]) => {
                if (v && v.trim() !== '') acc[k] = v;
                return acc;
            },
            {},
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/compensations', cleanFilters(localFilters), {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [localFilters]);

    const clearFilters = () => {
        setLocalFilters({});
        router.get(
            '/compensations',
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const columns = useMemo<ColumnDef<Compensation>[]>(
        () => [
            {
                id: 'martyr_name',
                accessorKey: 'martyr_name',
                header: t('compensations.martyr_name'),
                cell: ({ row }: { row: { original: Compensation } }) => (
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
            },
            {
                id: 'military_rank',
                accessorKey: 'military_rank',
                header: t('martyrs.military_rank'),
                cell: ({ row }: { row: { original: Compensation } }) => (
                    <Badge variant="secondary" className="rounded-md">
                        {row.original.military_rank || '-'}
                    </Badge>
                ),
            },
            {
                id: 'amount',
                accessorKey: 'amount',
                header: t('compensations.amount'),
                cell: ({ row }: { row: { original: Compensation } }) => (
                    <span className="font-bold text-primary">
                        {new Intl.NumberFormat('ar-LY', {
                            style: 'currency',
                            currency: 'LYD',
                        }).format(row.original.amount)}
                    </span>
                ),
            },
            {
                id: 'receipt_date_formatted',
                accessorKey: 'receipt_date_formatted',
                header: t('compensations.receipt_date'),
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }: { row: { original: Compensation } }) => (
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
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                {t('actions')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {canViewDetails && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/compensations/${row.original.id}`}
                                        className="flex cursor-pointer items-center"
                                    >
                                        <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {t('view')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {canUpdate && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/compensations/${row.original.id}/edit`}
                                        className="flex cursor-pointer items-center"
                                    >
                                        <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {t('edit')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => setDeleteId(row.original.id)}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('delete')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [t, canViewDetails, canUpdate, canDelete],
    );

    return (
        <TooltipProvider>
            <AppLayout
                breadcrumbs={[
                    { title: t('compensations.title'), href: '/compensations' },
                ]}
            >
                <Head title={t('compensations.title')} />

                <div className="space-y-6 p-6">
                    {/* Header Stats / Info */}
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {t('compensations.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('compensations.description', {
                                count: compensations.total,
                            })}
                        </p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        {/* Search */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    'compensations.search_placeholder',
                                )}
                                className="bg-background pl-9"
                                value={localFilters.search || ''}
                                onChange={(e) =>
                                    handleFilterChange('search', e.target.value)
                                }
                            />
                        </div>

                        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
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
                                                title={t(
                                                    'compensations.filters.advanced',
                                                )}
                                            >
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </SheetTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {t(
                                                'compensations.filters.advanced',
                                            )}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                                <SheetContent
                                    side={isRTL ? 'left' : 'right'}
                                    className="w-full p-0 sm:max-w-md"
                                >
                                    <SheetHeader className="border-b p-6">
                                        <SheetTitle>
                                            {t(
                                                'compensations.filters.advanced',
                                            )}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {t(
                                                'compensations.filters.advanced_description',
                                            )}
                                        </SheetDescription>
                                    </SheetHeader>
                                    <ScrollArea className="h-[calc(100vh-10rem)] p-6">
                                        <div className="grid gap-6">
                                            {/* Filters Fields */}
                                            <div className="space-y-4">
                                                {/* Martyr Filter */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        {t(
                                                            'compensations.filter_by_martyr',
                                                        )}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            localFilters.martyr_id ||
                                                            'all'
                                                        }
                                                        onValueChange={(v) =>
                                                            handleFilterChange(
                                                                'martyr_id',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'compensations.all_martyrs',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">
                                                                {t(
                                                                    'compensations.all_martyrs',
                                                                )}
                                                            </SelectItem>
                                                            {martyrs.map(
                                                                (m) => (
                                                                    <SelectItem
                                                                        key={
                                                                            m.id
                                                                        }
                                                                        value={String(
                                                                            m.id,
                                                                        )}
                                                                    >
                                                                        {
                                                                            m.full_name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Parents Status */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        {t(
                                                            'martyrs.parents_status',
                                                        )}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            localFilters.parents_status_id ||
                                                            'all'
                                                        }
                                                        onValueChange={(v) =>
                                                            handleFilterChange(
                                                                'parents_status_id',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'all',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">
                                                                {t('all')}
                                                            </SelectItem>
                                                            {parentsStatuses.map(
                                                                (s) => (
                                                                    <SelectItem
                                                                        key={
                                                                            s.id
                                                                        }
                                                                        value={String(
                                                                            s.id,
                                                                        )}
                                                                    >
                                                                        {isRTL
                                                                            ? s.name_ar
                                                                            : s.name_en}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Employment Status */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        {t(
                                                            'martyrs.employment_status',
                                                        )}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            localFilters.employment_status_id ||
                                                            'all'
                                                        }
                                                        onValueChange={(v) =>
                                                            handleFilterChange(
                                                                'employment_status_id',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'all',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">
                                                                {t('all')}
                                                            </SelectItem>
                                                            {employmentStatuses.map(
                                                                (s) => (
                                                                    <SelectItem
                                                                        key={
                                                                            s.id
                                                                        }
                                                                        value={String(
                                                                            s.id,
                                                                        )}
                                                                    >
                                                                        {s.name}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    <div className="border-t bg-muted/20 p-6">
                                        <Button
                                            onClick={clearFilters}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            {t('clear_filters')}
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <div className="mx-1 hidden h-6 w-px bg-border md:block" />

                            {/* Create Button */}
                            {canCreate && (
                                <Button asChild>
                                    <Link href="/compensations/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('compensations.add_compensation')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Data Table Card */}
                    <Card className="border-muted shadow-sm">
                        <CardContent className="p-0">
                            <DataTable
                                columns={columns}
                                data={compensations.data}
                            />
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {compensations.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <p className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('compensations.pagination.showing', {
                                    from: compensations.from,
                                    to: compensations.to,
                                    total: compensations.total,
                                })}
                            </p>
                            <Pagination className="order-1 w-auto sm:order-2">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={
                                                compensations.current_page > 1
                                                    ? `/compensations?page=${compensations.current_page - 1}`
                                                    : '#'
                                            }
                                            className={
                                                compensations.current_page <= 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                        />
                                    </PaginationItem>
                                    {/* Show first page */}
                                    {compensations.current_page > 3 && (
                                        <>
                                            <PaginationItem>
                                                <PaginationLink href="/compensations?page=1">
                                                    1
                                                </PaginationLink>
                                            </PaginationItem>
                                            {compensations.current_page > 4 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                        </>
                                    )}
                                    {/* Show pages around current */}
                                    {Array.from(
                                        {
                                            length: Math.min(
                                                5,
                                                compensations.last_page,
                                            ),
                                        },
                                        (_, i) => {
                                            const page = Math.max(
                                                1,
                                                Math.min(
                                                    compensations.last_page,
                                                    compensations.current_page -
                                                        2 +
                                                        i,
                                                ),
                                            );
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href={`/compensations?page=${page}`}
                                                        isActive={
                                                            page ===
                                                            compensations.current_page
                                                        }
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        },
                                    )}
                                    {/* Show last page */}
                                    {compensations.current_page <
                                        compensations.last_page - 2 && (
                                        <>
                                            {compensations.current_page <
                                                compensations.last_page - 3 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            <PaginationItem>
                                                <PaginationLink
                                                    href={`/compensations?page=${compensations.last_page}`}
                                                >
                                                    {compensations.last_page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </>
                                    )}
                                    <PaginationItem>
                                        <PaginationNext
                                            href={
                                                compensations.current_page <
                                                compensations.last_page
                                                    ? `/compensations?page=${compensations.current_page + 1}`
                                                    : '#'
                                            }
                                            className={
                                                compensations.current_page >=
                                                compensations.last_page
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>

                {/* Delete Alert Dialog */}
                <AlertDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {t('compensations.confirm_delete')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-destructive">
                                {t('compensations.delete_warning_message') ||
                                    'This action cannot be undone. This will permanently delete the compensation record.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    if (deleteId) {
                                        setIsDeleting(true);
                                        try {
                                            await router.delete(
                                                `/compensations/${deleteId}`,
                                                {
                                                    onSuccess: () => {
                                                        toast({
                                                            title: t(
                                                                'compensations.deleted',
                                                            ),
                                                            variant: 'default',
                                                        });
                                                        setDeleteId(null);
                                                    },
                                                },
                                            );
                                        } finally {
                                            setIsDeleting(false);
                                        }
                                    }
                                }}
                                disabled={isDeleting}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                {isDeleting ? t('deleting') : t('delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </AppLayout>
        </TooltipProvider>
    );
}
