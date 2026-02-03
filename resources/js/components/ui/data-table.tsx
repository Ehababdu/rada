"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  showPagination?: boolean
  // Server-side pagination props
  enablePagination?: boolean
  pageSize?: number
  totalItems?: number
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: (number | { value: number; label: string })[]
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updaterOrValue: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
  // Row selection props
  enableRowSelection?: boolean
  rowSelection?: Record<string, boolean>
  onRowSelectionChange?: (updaterOrValue: Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>)) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Filter...",
  showPagination = true,
  enablePagination,
  pageSize,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  columnVisibility: externalColumnVisibility,
  onColumnVisibilityChange: externalOnColumnVisibilityChange,
  enableRowSelection = false,
  rowSelection: externalRowSelection,
  onRowSelectionChange: externalOnRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>({})
  const columnVisibility =
    typeof externalColumnVisibility !== 'undefined'
      ? externalColumnVisibility
      : internalColumnVisibility
  const setColumnVisibility =
    typeof externalOnColumnVisibilityChange !== 'undefined'
      ? externalOnColumnVisibilityChange
      : setInternalColumnVisibility
  const [internalRowSelection, setInternalRowSelection] = React.useState({})
  const rowSelection =
    typeof externalRowSelection !== 'undefined'
      ? externalRowSelection
      : internalRowSelection
  const setRowSelection =
    typeof externalOnRowSelectionChange !== 'undefined'
      ? externalOnRowSelectionChange
      : setInternalRowSelection

  const table = useReactTable({
    data,
    columns: enableRowSelection ? [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ] : columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(enablePagination ? { pagination: {
        pageIndex: (currentPage || 1) - 1,
        pageSize: pageSize || 10,
      } } : {}),
    },
  })

  return (
    <div className="w-full">
      {searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  colSpan={enableRowSelection ? columns.length + 1 : columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {enableRowSelection && table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span className="mr-4">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </span>
            )}
            {enablePagination ? (
              `Showing ${((currentPage || 1) - 1) * (pageSize || 10) + 1} to ${Math.min((currentPage || 1) * (pageSize || 10), totalItems || 0)} of ${totalItems || 0} entries`
            ) : null}
          </div>
          <div className="flex items-center space-x-2">
            {enablePagination && pageSizeOptions && onPageSizeChange && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <select
                  value={pageSize || 10}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="h-8 w-16 rounded border border-input bg-background px-2 text-sm"
                >
                  {pageSizeOptions.map((option) => {
                    const value = typeof option === 'number' ? option : option.value;
                    const label = typeof option === 'number' ? option.toString() : option.label;
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}