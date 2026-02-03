import { useCallback, useMemo, useState } from 'react';

export interface UseBulkSelectionReturn<TData> {
    selectedRows: TData[];
    selectedIds: string[];
    isSelected: (id: string) => boolean;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    toggleRow: (row: TData, id: string) => void;
    toggleAll: (rows: TData[], getId: (row: TData) => string) => void;
    clearSelection: () => void;
    selectRows: (rows: TData[], getId: (row: TData) => string) => void;
}

/**
 * Hook for managing bulk selection state in tables
 */
export function useBulkSelection<TData>(): UseBulkSelectionReturn<TData> {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const isSelected = useCallback(
        (id: string) => {
            return selectedIds.has(id);
        },
        [selectedIds],
    );

    const isAllSelected = useMemo(() => false, []); // This will be calculated by the table
    const isIndeterminate = useMemo(() => false, []); // This will be calculated by the table

    const toggleRow = useCallback((row: TData, id: string) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const toggleAll = useCallback(
        (rows: TData[], getId: (row: TData) => string) => {
            setSelectedIds((prev) => {
                const allIds = new Set(rows.map(getId));
                const currentlySelected = rows.filter((row) =>
                    prev.has(getId(row)),
                ).length;

                if (currentlySelected === rows.length) {
                    // All selected, deselect all
                    return new Set();
                } else {
                    // Not all selected, select all
                    return allIds;
                }
            });
        },
        [],
    );

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const selectRows = useCallback(
        (rows: TData[], getId: (row: TData) => string) => {
            setSelectedIds(new Set(rows.map(getId)));
        },
        [],
    );

    return {
        selectedRows: [], // TODO: This hook needs to be properly implemented
        selectedIds: Array.from(selectedIds),
        isSelected,
        isAllSelected,
        isIndeterminate,
        toggleRow,
        toggleAll,
        clearSelection,
        selectRows,
    };
}
