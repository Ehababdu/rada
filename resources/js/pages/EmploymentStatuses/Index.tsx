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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    create as employmentStatusesCreate,
    destroy as employmentStatusesDestroy,
    edit as employmentStatusesEdit,
    index as employmentStatusesIndex,
    show as employmentStatusesShow,
} from '@/routes/employment-statuses';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FilterX,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EmploymentStatus {
    id: number;
    name: string;
    created_at: string;
}

interface Props {
    employmentStatuses: {
        data: EmploymentStatus[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ employmentStatuses, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('employment_statuses.title'),
            href: employmentStatusesIndex.url(),
        },
    ];

    const performSearch = useCallback(
        (params: Record<string, string | number | boolean>) => {
            router.get(employmentStatusesIndex.url(), params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        },
        [],
    );

    const handleSearchInput = (value: string) => {
        setSearchTerm(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            performSearch({ search: value });
        }, 400);
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get(employmentStatusesIndex.url());
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(employmentStatusesDestroy(deleteId).url, {
                onSuccess: () => {
                    toast({ title: t('success') });
                    setDeleteId(null);
                },
                onError: () => {
                    toast({ title: t('error'), variant: 'destructive' });
                    setDeleteId(null);
                },
            });
        }
    };

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('employment_statuses.title')} />

                <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Header Section - Unified Design */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('employment_statuses.title')}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('employment_statuses.description')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                asChild
                                className="transition-all hover:scale-105"
                            >
                                <Link href={employmentStatusesCreate.url()}>
                                    <Plus
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('employment_statuses.create')}
                                </Link>
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
                                    placeholder={t('search')}
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

                            {/* Clear Filters */}
                            {searchTerm && (
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
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        #
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        {t('employment_statuses.name')}
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        {t('created_at')}
                                    </TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employmentStatuses.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <Briefcase className="h-12 w-12 opacity-10" />
                                                <p className="text-lg font-medium">
                                                    {t('no_results')}
                                                </p>
                                                <p className="text-sm">
                                                    {t('no_data')}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employmentStatuses.data.map(
                                        (employmentStatus) => (
                                            <TableRow
                                                key={employmentStatus.id}
                                                className="group transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell>
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {employmentStatus.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {employmentStatus.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(
                                                        employmentStatus.created_at,
                                                    ).toLocaleDateString(
                                                        isRTL
                                                            ? 'ar-EG'
                                                            : 'en-US',
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align={
                                                                isRTL
                                                                    ? 'start'
                                                                    : 'end'
                                                            }
                                                            className="w-44"
                                                        >
                                                            <DropdownMenuLabel>
                                                                {t('actions')}
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        employmentStatusesShow(
                                                                            employmentStatus.id,
                                                                        ).url
                                                                    }
                                                                    className="flex cursor-pointer items-center"
                                                                >
                                                                    <Eye
                                                                        className={cn(
                                                                            'h-4 w-4 text-muted-foreground',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t('view')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        employmentStatusesEdit(
                                                                            employmentStatus.id,
                                                                        ).url
                                                                    }
                                                                    className="flex cursor-pointer items-center"
                                                                >
                                                                    <Edit
                                                                        className={cn(
                                                                            'h-4 w-4 text-muted-foreground',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t('edit')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setDeleteId(
                                                                        employmentStatus.id,
                                                                    )
                                                                }
                                                                className="cursor-pointer text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2
                                                                    className={cn(
                                                                        'h-4 w-4',
                                                                        isRTL
                                                                            ? 'ml-2'
                                                                            : 'mr-2',
                                                                    )}
                                                                />
                                                                {t('delete')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {employmentStatuses.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing')}{' '}
                                <span className="font-bold text-foreground">
                                    {employmentStatuses.from}
                                </span>{' '}
                                {t('to')}{' '}
                                <span className="font-bold text-foreground">
                                    {employmentStatuses.to}
                                </span>{' '}
                                {t('of')}{' '}
                                <span className="font-bold text-foreground">
                                    {employmentStatuses.total}
                                </span>{' '}
                                {t('records')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        performSearch({
                                            search: searchTerm,
                                            page:
                                                employmentStatuses.current_page -
                                                1,
                                        })
                                    }
                                    disabled={
                                        employmentStatuses.current_page === 1
                                    }
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
                                        {employmentStatuses.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {employmentStatuses.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        performSearch({
                                            search: searchTerm,
                                            page:
                                                employmentStatuses.current_page +
                                                1,
                                        })
                                    }
                                    disabled={
                                        employmentStatuses.current_page ===
                                        employmentStatuses.last_page
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
                                    {t('confirm_delete')}
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                    className={cn(
                                        isRTL ? 'text-right' : 'text-left',
                                    )}
                                >
                                    {t('confirm_delete_description')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                                <AlertDialogCancel>
                                    {t('cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
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
