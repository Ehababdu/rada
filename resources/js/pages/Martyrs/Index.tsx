import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { startTransition, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';

// Icons
import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react';

// Types
import { type BreadcrumbItem } from '@/types';

// Local imports
import { usePermissions } from '@/hooks/use-permissions';
import { MartyrsActions } from './components/MartyrsActions';
import { MartyrsDeleteDialog } from './components/MartyrsDeleteDialog';
import { MartyrsFilters } from './components/MartyrsFilters';
import { MartyrsTable } from './components/MartyrsTable';
import { useMartyrColumns } from './hooks/useMartyrColumns';
import { useMartyrDelete } from './hooks/useMartyrDelete';
import { useMartyrExport } from './hooks/useMartyrExport';
import { useMartyrFilters } from './hooks/useMartyrFilters';
import type { Props } from './types/martyr';

export default function Index({
    martyrs,
    filters,
    maritalStatuses,
    employmentStatuses,
    banks,
    parentsStatuses,
    militaryRanks = [],
    branches = [],
    employers = [],
    previousEmployers = [],
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { can } = usePermissions('martyrs');
    const { can: canAttachments } = usePermissions('attachments');

    const canViewAttachments = canAttachments('canRead');
    const canViewDetails = can('canViewDetails');
    const canUpdate = can('canUpdate');
    const canDelete = can('canDelete');
    const canCreate = can('canCreate');
    const canExport = can('canExport');

    // Deferred search for better performance
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Table state
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>(
        {},
    );
    const [isColumnsDialogOpen, setIsColumnsDialogOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Hooks
    const {
        localFilters,
        filteredBranches,
        handleFilterChange,
        handleSearchChange,
        clearFilters,
        cleanFilters,
    } = useMartyrFilters({ filters, branches });

    const {
        deleteOpen,
        setDeleteOpen,
        setDeletingId,
        isDeleting,
        handleDelete,
    } = useMartyrDelete();

    // Memoized callbacks to prevent unnecessary re-renders
    const handleDeleteClick = useCallback(
        (id: number) => {
            setDeletingId(id);
            setDeleteOpen(true);
        },
        [setDeletingId, setDeleteOpen],
    );

    const {
        availableColumns,
        visibleColumns,
        setVisibleColumns,
        basicKeys,
        additionalKeys,
        areAllBasicSelected,
        areSomeBasicSelected,
        areAllAdditionalSelected,
        areSomeAdditionalSelected,
        filteredColumns,
    } = useMartyrColumns({
        canViewAttachments,
        canViewDetails,
        canUpdate,
        canDelete,
        isRTL,
        onDelete: handleDeleteClick,
    });

    // Convert visibleColumns array to columnVisibility object for TanStack Table
    const columnVisibility = useMemo(() => {
        const visibility: Record<string, boolean> = {};
        availableColumns.forEach((col) => {
            visibility[col.key] = visibleColumns.includes(col.key);
        });
        return visibility;
    }, [availableColumns, visibleColumns]);

    const { latestExportAvailable, latestExportUrl, handleExport } =
        useMartyrExport({
            cleanFilters,
            localFilters,
            visibleColumns,
            selectedRows,
        });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.title'),
            href: '/martyrs',
        },
    ];

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('martyrs.title')} />

                <div className="space-y-6 p-6">
                    {/* Header Stats / Info */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <User className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('martyrs.title')}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MartyrsActions
                                canCreate={canCreate}
                                canExport={canExport}
                                handleExport={handleExport}
                                latestExportAvailable={latestExportAvailable}
                                latestExportUrl={latestExportUrl}
                                isColumnsDialogOpen={isColumnsDialogOpen}
                                setIsColumnsDialogOpen={setIsColumnsDialogOpen}
                                availableColumns={availableColumns}
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                                basicKeys={basicKeys}
                                additionalKeys={additionalKeys}
                                areAllBasicSelected={areAllBasicSelected}
                                areSomeBasicSelected={areSomeBasicSelected}
                                areAllAdditionalSelected={
                                    areAllAdditionalSelected
                                }
                                areSomeAdditionalSelected={
                                    areSomeAdditionalSelected
                                }
                                isRTL={isRTL}
                            />
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        {/* Search */}
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t(
                                        'martyrs.search_placeholder',
                                    )}
                                    className="bg-background pl-9 transition-all focus:ring-2 focus:ring-primary/20"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        handleSearchChange(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                            {/* Per Page */}
                            <Select
                                value={localFilters.per_page || '10'}
                                onValueChange={(value: string) =>
                                    handleFilterChange('per_page', value)
                                }
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="all">الكل</SelectItem>
                                </SelectContent>
                            </Select>

                            <MartyrsFilters
                                isFiltersOpen={isFiltersOpen}
                                setIsFiltersOpen={setIsFiltersOpen}
                                localFilters={localFilters}
                                handleFilterChange={handleFilterChange}
                                handleSearchChange={handleSearchChange}
                                clearFilters={clearFilters}
                                filteredBranches={filteredBranches}
                                militaryRanks={militaryRanks}
                                maritalStatuses={maritalStatuses}
                                employmentStatuses={employmentStatuses}
                                banks={banks}
                                parentsStatuses={parentsStatuses}
                                employers={employers}
                                previousEmployers={previousEmployers}
                                isRTL={isRTL}
                            />
                        </div>
                    </div>

                    {/* Data Table */}
                    <MartyrsTable
                        columns={filteredColumns}
                        data={martyrs.data}
                        columnVisibility={columnVisibility}
                        enableRowSelection={true}
                        rowSelection={selectedRows}
                        onRowSelectionChange={(selection) => {
                            startTransition(() => {
                                setSelectedRows(selection);
                            });
                        }}
                    />

                    {/* Pagination */}
                    {martyrs.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing')}{' '}
                                <span className="font-bold text-foreground">
                                    {martyrs.from}
                                </span>{' '}
                                {t('to')}{' '}
                                <span className="font-bold text-foreground">
                                    {martyrs.to}
                                </span>{' '}
                                {t('of')}{' '}
                                <span className="font-bold text-foreground">
                                    {martyrs.total}
                                </span>{' '}
                                {t('records')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get('/martyrs', {
                                            page: martyrs.current_page - 1,
                                            ...Object.entries(
                                                localFilters,
                                            ).reduce<Record<string, string>>(
                                                (acc, [k, v]) => {
                                                    if (v && v.trim() !== '')
                                                        acc[k] = v;
                                                    return acc;
                                                },
                                                {},
                                            ),
                                        })
                                    }
                                    disabled={martyrs.current_page === 1}
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
                                        {martyrs.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {martyrs.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get('/martyrs', {
                                            page: martyrs.current_page + 1,
                                            ...cleanFilters(localFilters),
                                        })
                                    }
                                    disabled={
                                        martyrs.current_page ===
                                        martyrs.last_page
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

                <MartyrsDeleteDialog
                    deleteOpen={deleteOpen}
                    setDeleteOpen={setDeleteOpen}
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
                />
            </AppLayout>
        </TooltipProvider>
    );
}
