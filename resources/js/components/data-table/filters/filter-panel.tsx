import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { DateRangeFilter } from './date-range-filter';
import { MultiSelectFilter } from './multi-select-filter';
import { NumericRangeFilter } from './numeric-range-filter';

export interface FilterConfig {
    id: string;
    type: 'faceted' | 'date-range' | 'numeric-range' | 'multi-select';
    title: string;
    options?: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    min?: number;
    max?: number;
    step?: number;
}

interface FilterPanelProps<TData> {
    filters: FilterConfig[];
    table: any;
    onClose?: () => void;
}

export function FilterPanel<TData>({
    filters,
    table,
    onClose,
}: FilterPanelProps<TData>) {
    const { t } = useTranslation();

    const hasActiveFilters = filters.some((filter) => {
        const column = table.getColumn(filter.id);
        return column?.getFilterValue() !== undefined;
    });

    const clearAllFilters = () => {
        filters.forEach((filter) => {
            const column = table.getColumn(filter.id);
            column?.setFilterValue(undefined);
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                    {t('dataTable.filters')}
                </h3>
                {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filters.map((filter) => {
                    const column = table.getColumn(filter.id);

                    switch (filter.type) {
                        case 'faceted':
                            return (
                                <DataTableFacetedFilter
                                    key={filter.id}
                                    column={column}
                                    title={filter.title}
                                    options={filter.options || []}
                                />
                            );
                        case 'date-range':
                            return (
                                <DateRangeFilter
                                    key={filter.id}
                                    column={column}
                                    title={filter.title}
                                />
                            );
                        case 'numeric-range':
                            return (
                                <NumericRangeFilter
                                    key={filter.id}
                                    column={column}
                                    title={filter.title}
                                    min={filter.min}
                                    max={filter.max}
                                    step={filter.step}
                                />
                            );
                        case 'multi-select':
                            return (
                                <MultiSelectFilter
                                    key={filter.id}
                                    column={column}
                                    title={filter.title}
                                    options={filter.options || []}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </div>

            {hasActiveFilters && (
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                    >
                        {t('dataTable.clearAllFilters')}
                    </Button>
                </div>
            )}
        </div>
    );
}
