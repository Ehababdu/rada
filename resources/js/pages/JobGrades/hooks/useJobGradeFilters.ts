import { useState } from 'react';

export interface UseJobGradeFiltersReturn {
    search: string;
    status: string;
    isFiltersOpen: boolean;
    setIsFiltersOpen: (open: boolean) => void;
    handleSearchChange: (value: string) => void;
    handleFilterChange: (key: string, value: string) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export function useJobGradeFilters(initialFilters: {
    search?: string;
    status?: string;
}): UseJobGradeFiltersReturn {
    const [search, setSearch] = useState(initialFilters.search || '');
    const [status, setStatus] = useState(initialFilters.status || '');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleFilterChange = (key: string, value: string) => {
        if (key === 'status') {
            setStatus(value);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
    };

    const hasActiveFilters = search.length > 0 || status.length > 0;

    return {
        search,
        status,
        isFiltersOpen,
        setIsFiltersOpen,
        handleSearchChange,
        handleFilterChange,
        clearFilters,
        hasActiveFilters,
    };
}