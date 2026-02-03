import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Filters } from '../types/martyr';

interface UseMartyrFiltersProps {
    filters: Filters;
    branches: Array<{ id: number; name_ar: string; bank_id: number }>;
}

export function useMartyrFilters({ filters, branches }: UseMartyrFiltersProps) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [filteredBranches, setFilteredBranches] = useState(branches);

    const isUserChange = useRef(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update localFilters when filters prop changes (from server)
    useEffect(() => {
        const filtersChanged = JSON.stringify(localFilters) !== JSON.stringify(filters);
        if (filtersChanged) {
            setLocalFilters(filters);
        }
    }, [filters]);

    // Filter branches based on selected bank
    useEffect(() => {
        if (localFilters.bank_id && localFilters.bank_id !== 'all') {
            const bankId = parseInt(localFilters.bank_id);
            setFilteredBranches(branches.filter(branch => branch.bank_id === bankId));
            // Clear branch filter if selected branch doesn't belong to the new bank
            if (localFilters.branch_id && localFilters.branch_id !== 'all') {
                const branchExists = branches.some(branch =>
                    branch.id === parseInt(localFilters.branch_id as string) &&
                    branch.bank_id === bankId
                );
                if (!branchExists) {
                    handleFilterChange('branch_id', '');
                }
            }
        } else {
            setFilteredBranches(branches);
        }
    }, [localFilters.bank_id, branches]);

    const triggerSearch = useCallback((search: string) => {
        const cleaned = cleanFilters({ ...localFilters, search });
        router.get('/martyrs', cleaned, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [localFilters]);

    const handleSearchChange = (value: string) => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(
            () => triggerSearch(value),
            400,
        );
    };

    const handleFilterChange = (key: keyof Filters, value: string) => {
        const newValue = value === 'all' ? '' : value;
        const newFilters = { ...localFilters, [key]: newValue };
        setLocalFilters(newFilters);
        isUserChange.current = true;
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
        if (isUserChange.current) {
            isUserChange.current = false;
            const cleaned = cleanFilters(localFilters);
            if (Object.keys(cleaned).length > 0) {
                router.get('/martyrs', cleaned, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }
    }, [localFilters]);

    const clearFilters = () => {
        setLocalFilters({});
        router.get(
            '/martyrs',
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return {
        localFilters,
        setLocalFilters,
        filteredBranches,
        handleFilterChange,
        handleSearchChange,
        clearFilters,
        cleanFilters,
        triggerSearch,
    };
}