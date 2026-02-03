import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import type { Martyr } from '../types/martyr';

interface MartyrsTableProps {
    columns: ColumnDef<Martyr>[];
    data: Martyr[];
    columnVisibility: Record<string, boolean>;
    enableRowSelection: boolean;
    rowSelection: Record<string, boolean>;
    onRowSelectionChange: (
        updaterOrValue:
            | Record<string, boolean>
            | ((old: Record<string, boolean>) => Record<string, boolean>),
    ) => void;
}

export const MartyrsTable = React.memo<MartyrsTableProps>(
    ({
        columns,
        data,
        columnVisibility,
        enableRowSelection,
        rowSelection,
        onRowSelectionChange,
    }: MartyrsTableProps) => {
        return (
            <DataTable
                columns={columns}
                data={data}
                columnVisibility={columnVisibility}
                enableRowSelection={enableRowSelection}
                rowSelection={rowSelection}
                onRowSelectionChange={(updaterOrValue) => {
                    const newSelection =
                        typeof updaterOrValue === 'function'
                            ? updaterOrValue(rowSelection)
                            : updaterOrValue;
                    onRowSelectionChange(newSelection);
                }}
            />
        );
    },
);
