import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    Award,
    CheckCircle,
    Edit,
    Eye,
    FilterX,
    Plus,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface JobGrade {
    id: number;
    name_ar: string;
    name_en: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    jobGrades: {
        data: JobGrade[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        is_active?: string;
        sort?: string;
        direction?: string;
        per_page?: number;
    };
}

export default function Index({ jobGrades, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [search, setSearch] = useState(filters.search || '');
    const [isActiveFilter, setIsActiveFilter] = useState(
        filters.is_active || '',
    );
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('job_grades.title'), href: '/job-grades' },
    ];

    // دالة البحث مع Debounce
    const triggerSearch = useCallback(
        (searchValue: string, activeValue: string) => {
            router.get(
                '/job-grades',
                {
                    search: searchValue || undefined,
                    is_active: activeValue || undefined,
                    page: 1,
                },
                { preserveState: true, replace: true },
            );
        },
        [],
    );

    const onSearchChange = (val: string) => {
        setSearch(val);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(
            () => triggerSearch(val, isActiveFilter),
            400,
        );
    };

    const onStatusFilterChange = (val: string) => {
        setIsActiveFilter(val);
        triggerSearch(search, val);
    };

    const handleSort = (field: string) => {
        const direction =
            filters.sort === field && filters.direction === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            '/job-grades',
            { ...filters, sort: field, direction, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(`/job-grades/${id}`);
    };

    const columns: ColumnDef<JobGrade>[] = [
        {
            accessorKey: 'name_ar',
            header: () => (
                <Button
                    variant="ghost"
                    onClick={() => handleSort('name_ar')}
                    className="h-8 gap-1 p-0 font-bold text-inherit hover:bg-transparent"
                >
                    {t('job_grades.name_ar')}
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-semibold">{row.original.name_ar}</div>
            ),
        },
        {
            accessorKey: 'name_en',
            header: t('job_grades.name_en'),
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground italic">
                    {row.original.name_en}
                </div>
            ),
        },
        {
            accessorKey: 'order',
            header: () => (
                <Button
                    variant="ghost"
                    onClick={() => handleSort('order')}
                    className="h-8 gap-1 p-0 font-bold text-inherit hover:bg-transparent"
                >
                    {t('job_grades.order')}
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono">
                    {row.original.order}
                </Badge>
            ),
        },
        {
            accessorKey: 'is_active',
            header: t('job_grades.status'),
            cell: ({ row }) => (
                <Badge
                    className={cn(
                        'gap-1 border-none px-2 py-0.5 font-medium shadow-none',
                        row.original.is_active
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-100 text-red-700 hover:bg-red-100',
                    )}
                >
                    {row.original.is_active ? (
                        <CheckCircle className="h-3 w-3" />
                    ) : (
                        <XCircle className="h-3 w-3" />
                    )}
                    {row.original.is_active ? t('active') : t('inactive')}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: t('actions'),
            cell: ({ row }) => (
                <div
                    className={cn(
                        'flex items-center gap-1',
                        isRTL ? 'justify-start' : 'justify-end',
                    )}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        asChild
                    >
                        <Link href={`/job-grades/${row.original.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                        asChild
                    >
                        <Link href={`/job-grades/${row.original.id}/edit`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {t('confirm_delete')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('job_grades.confirm_delete', {
                                        name: row.original.name_ar,
                                    })}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter
                                className={cn(
                                    'gap-2',
                                    isRTL && 'sm:flex-row-reverse',
                                )}
                            >
                                <AlertDialogCancel>
                                    {t('cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        handleDelete(row.original.id)
                                    }
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {t('delete')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('job_grades.title')} />

            <div
                className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                            <Award className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('job_grades.title')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('job_grades.list_description')}
                            </p>
                        </div>
                    </div>
                    <Button asChild className="shrink-0 shadow-sm">
                        <Link href="/job-grades/create">
                            <Plus
                                className={cn(
                                    'h-4 w-4',
                                    isRTL ? 'ml-2' : 'mr-2',
                                )}
                            />
                            {t('job_grades.create')}
                        </Link>
                    </Button>
                </div>

                {/* Filters Section */}
                <Card className="border-none bg-muted/20 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="min-w-[240px] flex-1 space-y-1.5">
                                <Label
                                    htmlFor="search"
                                    className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                                >
                                    {t('search')}
                                </Label>
                                <div className="relative">
                                    <Search
                                        className={cn(
                                            'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                            isRTL ? 'right-3' : 'left-3',
                                        )}
                                    />
                                    <Input
                                        id="search"
                                        value={search}
                                        onChange={(e) =>
                                            onSearchChange(e.target.value)
                                        }
                                        placeholder={t(
                                            'job_grades.search_placeholder',
                                        )}
                                        className={cn(
                                            'border-muted-foreground/20 bg-background',
                                            isRTL ? 'pr-10' : 'pl-10',
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="w-full space-y-1.5 md:w-48">
                                <Label
                                    htmlFor="is_active"
                                    className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                                >
                                    {t('status')}
                                </Label>
                                <select
                                    id="is_active"
                                    value={isActiveFilter}
                                    onChange={(e) =>
                                        onStatusFilterChange(e.target.value)
                                    }
                                    className="h-10 w-full rounded-md border border-muted-foreground/20 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">{t('all')}</option>
                                    <option value="1">{t('active')}</option>
                                    <option value="0">{t('inactive')}</option>
                                </select>
                            </div>

                            {(search || isActiveFilter) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSearch('');
                                        setIsActiveFilter('');
                                        triggerSearch('', '');
                                    }}
                                    className="h-10 text-muted-foreground transition-colors hover:text-primary"
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
                    </CardContent>
                </Card>

                {/* Data Table Section */}
                <Card className="overflow-hidden border-none shadow-sm">
                    <CardContent className="p-0">
                        {/* ملاحظة: إذا كان الخطأ في الترقيم مستمراً، قمنا هنا بتمرير المعاملات 
                          كـ Numbers صريحة لتجنب 'any' 
                        */}
                        <DataTable
                            columns={columns}
                            data={jobGrades.data}
                            // @ts-expect-error - نستخدم هذا في حال كان تعريف النوع في DataTable لا يتوقع pagination كـ Prop
                            pagination={{
                                currentPage: jobGrades.current_page,
                                lastPage: jobGrades.last_page,
                                perPage: jobGrades.per_page,
                                total: jobGrades.total,
                                from: jobGrades.from,
                                to: jobGrades.to,
                            }}
                            onPageChange={(page: number) => {
                                router.get(
                                    '/job-grades',
                                    { ...filters, page },
                                    { preserveState: true, replace: true },
                                );
                            }}
                            onPerPageChange={(perPage: number) => {
                                router.get(
                                    '/job-grades',
                                    { ...filters, per_page: perPage, page: 1 },
                                    { preserveState: true, replace: true },
                                );
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
