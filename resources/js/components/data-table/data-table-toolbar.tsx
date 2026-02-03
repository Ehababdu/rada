import { Download, Filter, Search, Settings } from 'lucide-react';
import * as React from 'react';
import { Table, Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFuzzySearcher } from '@/lib/fuzzy-search';
import { useTranslation } from 'react-i18next';
import { BulkActions } from './bulk-actions';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { SavedFilters } from './filters/saved-filters';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchKey?: string;
    searchKeys?: string[];
    filterableColumns?: {
        id: string;
        title: string;
        options: {
            label: string;
            value: string;
        }[];
    }[];
    searchableColumns?: {
        id: string;
        title: string;
    }[];
    bulkActions?: {
        label: string;
        action: (selectedRows: TData[]) => void;
        variant?: 'default' | 'destructive';
        confirmMessage?: string;
    }[];
    selectedRows: TData[];
    onClearSelection: () => void;
    onExport?: () => void;
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchKeys,
    filterableColumns,
    searchableColumns,
    bulkActions,
    selectedRows,
    onClearSelection,
    onExport,
}: DataTableToolbarProps<TData>) {
    const { t } = useTranslation();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);

    // Fuzzy search setup
    const fuzzySearcher = React.useMemo(() => {
        if (!searchKeys || searchKeys.length === 0) return null;

        const allData =
            table?.getCoreRowModel().rows.map((row: Row<TData>) => row.original) || [];
        return createFuzzySearcher(allData, {
            keys: searchKeys,
            threshold: 0.3,
            includeScore: true,
        });
    }, [table, searchKeys]);

    // Handle search
    React.useEffect(() => {
        if (!globalFilter.trim()) {
            table?.resetGlobalFilter();
            return;
        }

        if (fuzzySearcher) {
            const results = fuzzySearcher.search(globalFilter);
            const filteredIds = new Set(
                results.map((result) => result.refIndex),
            );

            table?.setGlobalFilter((row: Row<TData>) => {
                return filteredIds.has(row.index);
            });
        } else if (searchKey) {
            table?.setGlobalFilter(globalFilter);
        }
    }, [globalFilter, fuzzySearcher, table, searchKey]);

    const hasActiveFilters = table?.getState().columnFilters.length > 0;
    const hasSearch = searchKey || searchKeys;

    return (
        <div className="flex flex-col gap-4">
            {/* Bulk Actions */}
            {bulkActions && bulkActions.length > 0 && (
                <BulkActions
                    bulkActions={bulkActions}
                    selectedRows={selectedRows}
                    onClearSelection={onClearSelection}
                />
            )}

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    {/* Search Input */}
                    {hasSearch && (
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t('dataTable.search')}
                                value={globalFilter}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                className="pl-9"
                            />
                        </div>
                    )}

                    {/* Faceted Filters */}
                    {filterableColumns?.map((column) => (
                        <DataTableFacetedFilter
                            key={column.id}
                            column={table?.getColumn(column.id)}
                            title={column.title}
                            options={column.options}
                        />
                    ))}

                    {/* Advanced Filters Toggle */}
                    {(searchableColumns || hasActiveFilters) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className={hasActiveFilters ? 'border-primary' : ''}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {t('dataTable.filters')}
                            {hasActiveFilters && (
                                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                                    {table?.getState().columnFilters.length}
                                </span>
                            )}
                        </Button>
                    )}

                    {/* Saved Filters */}
                    <SavedFilters
                        table={table}
                        onApplyFilter={(filters) => {
                            // Apply saved filters to table
                            Object.entries(filters).forEach(([key, value]) => {
                                const column = table?.getColumn(key);
                                column?.setFilterValue(value);
                            });
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Export Button */}
                    {onExport && (
                        <Button variant="outline" size="sm" onClick={onExport}>
                            <Download className="mr-2 h-4 w-4" />
                            {t('dataTable.export')}
                        </Button>
                    )}

                    {/* Column Visibility */}
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="rounded-lg border bg-card p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {searchableColumns?.map((column) => (
                            <div key={column.id} className="space-y-2">
                                <label className="text-sm font-medium">
                                    {column.title}
                                </label>
                                <Input
                                    placeholder={`${t('dataTable.search')} ${column.title}`}
                                    value={
                                        (table
                                            ?.getColumn(column.id)
                                            ?.getFilterValue() as string) ?? ''
                                    }
                                    onChange={(e) =>
                                        table
                                            ?.getColumn(column.id)
                                            ?.setFilterValue(e.target.value)
                                    }
                                    className="h-8"
                                />
                            </div>
                        ))}
                    </div>

                    {hasActiveFilters && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    table?.resetColumnFilters();
                                    setGlobalFilter('');
                                }}
                            >
                                {t('dataTable.clearAllFilters')}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
