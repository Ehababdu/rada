import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DataTableEmptyState } from './data-table-empty-state';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
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
    emptyState?: {
        title: string;
        description?: string;
        action?: {
            label: string;
            href?: string;
            onClick?: () => void;
        };
    };
    loading?: boolean;
    pageSize?: number;
    enableRowSelection?: boolean;
    enableColumnVisibility?: boolean;
    enablePagination?: boolean;
    className?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchKeys,
    filterableColumns,
    searchableColumns,
    bulkActions,
    emptyState,
    loading = false,
    pageSize = 10,
    enableRowSelection = false,
    enableColumnVisibility = true,
    enablePagination = true,
    className,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);

    return (
        <div className={`w-full space-y-4 ${className}`}>
            <DataTableToolbar
                table={table}
                searchKey={searchKey}
                searchKeys={searchKeys}
                filterableColumns={filterableColumns}
                searchableColumns={searchableColumns}
                bulkActions={bulkActions}
                selectedRows={selectedRows}
                onClearSelection={() => table.resetRowSelection()}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span className="ml-2">جاري التحميل...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <DataTableEmptyState
                                        table={table}
                                        searchQuery={table.getState().globalFilter}
                                        isFiltered={table.getState().columnFilters.length > 0}
                                        {...emptyState}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                {enablePagination && <DataTablePagination table={table} />}
                {enableColumnVisibility && <DataTableViewOptions table={table} />}
            </div>
        </div>
    );
}