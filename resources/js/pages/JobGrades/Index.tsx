import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Icons
import { Award, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

// Layout
import AppLayout from '@/layouts/app-layout';

// Components
import { JobGradesActions } from './components/JobGradesActions';
import { JobGradesFilters } from './components/JobGradesFilters';
import { JobGradesTable } from './components/JobGradesTable';

// Hooks
import { useJobGradeColumns } from './hooks/useJobGradeColumns';
import { useJobGradeDelete } from './hooks/useJobGradeDelete';
import { useJobGradeFilters } from './hooks/useJobGradeFilters';
import { usePermissions } from '@/hooks/use-permissions';

// Types
import type { JobGrade, JobGradesResponse } from './types/job-grade';

interface Props {
    jobGrades: JobGradesResponse;
    filters: {
        search: string;
        status: string;
        per_page?: string;
    };
}

export default function Index({
    jobGrades,
    filters,
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // Permissions
    const { can } = usePermissions('job grades');

    // Filters Hook
    const {
        search,
        status,
        isFiltersOpen,
        setIsFiltersOpen,
        handleSearchChange,
        handleFilterChange,
        clearFilters,
        hasActiveFilters,
    } = useJobGradeFilters(filters);

    // Local state for per page
    const [perPage, setPerPage] = useState(filters.per_page || '10');

    // Delete Hook
    const { handleDelete, isDeleting } = useJobGradeDelete();

    // Columns Hook
    const columns = useJobGradeColumns({
        canView: can('canRead'),
        canUpdate: can('canUpdate'),
        canDelete: can('canDelete'),
        isRTL,
        onDelete: handleDelete,
    });

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    '/job-grades',
                    { search, status },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, status, filters.search]);

    // Breadcrumbs
    const breadcrumbs = [
        { title: t('dashboard.title'), href: '/dashboard' },
        { title: t('job_grades.title'), href: '/job-grades' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('job_grades.title')} />

            <div
                className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
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
                    <div className="flex items-center gap-2">
                        <JobGradesActions canCreate={can('canCreate')} />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    {/* Search */}
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t('job_grades.search_placeholder')}
                                className="bg-background pl-9 transition-all focus:ring-2 focus:ring-primary/20"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                        {/* Per Page */}
                        <Select
                            value={perPage}
                            onValueChange={(value: string) => {
                                setPerPage(value);
                                router.get(
                                    '/job-grades',
                                    { ...filters, per_page: value, page: 1 },
                                    { preserveState: true, replace: true },
                                );
                            }}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>

                        <JobGradesFilters
                            isFiltersOpen={isFiltersOpen}
                            setIsFiltersOpen={setIsFiltersOpen}
                            search={search}
                            status={status}
                            handleSearchChange={handleSearchChange}
                            handleFilterChange={handleFilterChange}
                            clearFilters={clearFilters}
                            isRTL={isRTL}
                        />

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    clearFilters();
                                    router.get('/job-grades', {}, { preserveState: true });
                                }}
                                className="shrink-0"
                            >
                                <X className="mr-2 h-4 w-4" />
                                {t('job_grades.clear_filters')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="space-y-4">
                    <JobGradesTable
                        columns={columns}
                        data={jobGrades.data}
                    />

                    {/* Pagination */}
                    {jobGrades.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing')}{' '}
                                <span className="font-bold text-foreground">
                                    {jobGrades.from}
                                </span>{' '}
                                {t('to')}{' '}
                                <span className="font-bold text-foreground">
                                    {jobGrades.to}
                                </span>{' '}
                                {t('of')}{' '}
                                <span className="font-bold text-foreground">
                                    {jobGrades.total}
                                </span>{' '}
                                {t('records')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get('/job-grades', {
                                            page: jobGrades.current_page - 1,
                                            ...filters,
                                        })
                                    }
                                    disabled={jobGrades.current_page === 1}
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
                                        {jobGrades.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {jobGrades.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get('/job-grades', {
                                            page: jobGrades.current_page + 1,
                                            ...filters,
                                        })
                                    }
                                    disabled={
                                        jobGrades.current_page ===
                                        jobGrades.last_page
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
            </div>
        </AppLayout>
    );
}
