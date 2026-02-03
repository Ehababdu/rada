import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import type { Filters } from '../types/martyr';

interface UseMartyrFiltersProps {
    filters: Filters;
    branches: Array<{ id: number; name_ar: string; bank_id: number }>;
}

export function useMartyrFilters({ filters, branches }: UseMartyrFiltersProps) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const isUserChange = useRef(false);

    const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
        const newValue = value === 'all' ? '' : value;
        const newFilters = { ...localFilters, [key]: newValue };
        setLocalFilters(newFilters);
        isUserChange.current = true;
    }, [localFilters]);

    const cleanFilters = (f: Filters) => {
        return Object.entries(f).reduce<Record<string, string>>(
            (acc, [k, v]) => {
                if (v && v.trim() !== '') acc[k] = v;
                return acc;
            },
            {},
        );
    };

    const prevFiltersRef = useRef<Filters>(filters);

    // Update localFilters when filters prop changes (from server)
    useEffect(() => {
        if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalFilters(filters);
            prevFiltersRef.current = filters;
        }
    }, [filters]);

    const filteredBranches = useMemo(() => {
        if (localFilters.bank_id && localFilters.bank_id !== 'all') {
            const bankId = parseInt(localFilters.bank_id);
            return branches.filter(branch => branch.bank_id === bankId);
        } else {
            return branches;
        }
    }, [localFilters.bank_id, branches]);

    // Clear branch filter if selected branch doesn't belong to the new bank
    useEffect(() => {
        if (localFilters.bank_id && localFilters.bank_id !== 'all') {
            const bankId = parseInt(localFilters.bank_id);
            if (localFilters.branch_id && localFilters.branch_id !== 'all') {
                const branchExists = branches.some(branch =>
                    branch.id === parseInt(localFilters.branch_id as string) &&
                    branch.bank_id === bankId
                );
                if (!branchExists) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    handleFilterChange('branch_id', '');
                }
            }
        }
    }, [localFilters.bank_id, localFilters.branch_id, branches, handleFilterChange]);

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

    const handleSearchChange = useCallback((value: string) => {
        handleFilterChange('search', value);
    }, [handleFilterChange]);

    const triggerSearch = useCallback(() => {
        isUserChange.current = true;
    }, []);

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