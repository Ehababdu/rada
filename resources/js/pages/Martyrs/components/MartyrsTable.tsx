import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import type { Martyr } from '../types/martyr';

interface MartyrsTableProps {
    columns: ColumnDef<Martyr>[];
    data: Martyr[];
    columnVisibility: Record<string, boolean>;
    enableRowSelection: boolean;
    rowSelection: Record<string, boolean>;
    onRowSelectionChange: (selection: Record<string, boolean>) => void;
}

export function MartyrsTable({
    columns,
    data,
    columnVisibility,
    enableRowSelection,
    rowSelection,
    onRowSelectionChange,
}: MartyrsTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            columnVisibility={columnVisibility}
            enableRowSelection={enableRowSelection}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
        />
    );
}