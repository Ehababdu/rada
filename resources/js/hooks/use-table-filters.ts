import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterConfig } from '@/components/data-table/filters/filter-panel';

export interface TableFilters {
    [key: string]: any;
}

export interface SelectFieldOption {
    value: string;
    label: string;
}

export interface SelectField {
    key: string;
    options: SelectFieldOption[];
}

export interface TableFilterConfig {
    searchKeys?: string[];
    dateFields?: string[];
    numericFields?: string[];
    selectFields?: SelectField[];
}

export interface UseTableFiltersReturn extends TableFilterConfig {
    filters: TableFilters;
    setFilter: (key: string, value: any) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
    hasActiveFilters: boolean;
    activeFiltersCount: number;
    getFilterValue: (key: string) => any;
    applySavedFilters: (savedFilters: TableFilters) => void;
}

/**
 * Hook for managing table filters state
 */
export function useTableFilters(
    config: TableFilterConfig = {},
    initialFilters: TableFilters = {},
    onFiltersChange?: (filters: TableFilters) => void
): UseTableFiltersReturn {
    const [filters, setFiltersState] = useState<TableFilters>(initialFilters);

    const setFilter = useCallback((key: string, value: any) => {
        setFiltersState(prev => {
            const newFilters = { ...prev };

            if (value === undefined || value === null || value === '') {
                delete newFilters[key];
            } else {
                newFilters[key] = value;
            }

            onFiltersChange?.(newFilters);
            return newFilters;
        });
    }, [onFiltersChange]);

    const clearFilter = useCallback((key: string) => {
        setFilter(key, undefined);
    }, [setFilter]);

    const clearAllFilters = useCallback(() => {
        setFiltersState({});
        onFiltersChange?.({});
    }, [onFiltersChange]);

    const getFilterValue = useCallback((key: string) => {
        return filters[key];
    }, [filters]);

    const applySavedFilters = useCallback((savedFilters: TableFilters) => {
        setFiltersState(savedFilters);
        onFiltersChange?.(savedFilters);
    }, [onFiltersChange]);

    const hasActiveFilters = useMemo(() => {
        return Object.keys(filters).length > 0;
    }, [filters]);

    const activeFiltersCount = useMemo(() => {
        return Object.keys(filters).length;
    }, [filters]);

    return {
        // Config properties
        searchKeys: config.searchKeys,
        dateFields: config.dateFields,
        numericFields: config.numericFields,
        selectFields: config.selectFields,
        // Filter state
        filters,
        setFilter,
        clearFilter,
        clearAllFilters,
        hasActiveFilters,
        activeFiltersCount,
        getFilterValue,
        applySavedFilters,
    };
}

/**
 * Hook for creating filter configurations for different resources
 */
export function useTableFilterConfigs(resource: string): FilterConfig[] {
    const { t } = useTranslation();

    return useMemo(() => {
        switch (resource) {
            case 'martyrs':
                return [
                    {
                        id: 'military_rank_id',
                        type: 'faceted',
                        title: t('martyrs.militaryRank'),
                        options: [], // This would be populated from API
                    },
                    {
                        id: 'marital_status_id',
                        type: 'faceted',
                        title: t('martyrs.maritalStatus'),
                        options: [
                            { label: t('martyrs.maritalStatuses.single'), value: '1' },
                            { label: t('martyrs.maritalStatuses.married'), value: '2' },
                            { label: t('martyrs.maritalStatuses.divorced'), value: '3' },
                            { label: t('martyrs.maritalStatuses.widowed'), value: '4' },
                        ],
                    },
                    {
                        id: 'martyr_date',
                        type: 'date-range',
                        title: t('martyrs.martyrDate'),
                    },
                ];

            case 'compensations':
                return [
                    {
                        id: 'martyr_id',
                        type: 'multi-select',
                        title: t('compensations.martyr'),
                        options: [], // This would be populated from API
                    },
                    {
                        id: 'amount',
                        type: 'numeric-range',
                        title: t('compensations.amount'),
                        min: 0,
                        max: 100000,
                        step: 100,
                    },
                    {
                        id: 'receipt_date',
                        type: 'date-range',
                        title: t('compensations.receiptDate'),
                    },
                ];

            case 'promotions':
                return [
                    {
                        id: 'martyr_id',
                        type: 'multi-select',
                        title: t('promotions.martyr'),
                        options: [], // This would be populated from API
                    },
                    {
                        id: 'from_rank_id',
                        type: 'faceted',
                        title: t('promotions.fromRank'),
                        options: [], // This would be populated from API
                    },
                    {
                        id: 'to_rank_id',
                        type: 'faceted',
                        title: t('promotions.toRank'),
                        options: [], // This would be populated from API
                    },
                    {
                        id: 'promotion_date',
                        type: 'date-range',
                        title: t('promotions.promotionDate'),
                    },
                ];

            default:
                return [];
        }
    }, [resource, t]);
}