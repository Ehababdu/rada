import { Table } from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    /**
     * Page sizes to show in dropdown
     */
    pageSizeOptions?: number[];
    /**
     * Total items count (server-side pagination)
     */
    totalItems?: number;
    /**
     * Current page (server-side pagination)
     */
    currentPage?: number;
    /**
     * Total pages (server-side pagination)
     */
    totalPages?: number;
    /**
     * Callback when page changes (server-side)
     */
    onPageChange?: (page: number) => void;
    /**
     * Callback when page size changes (server-side)
     */
    onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
    table,
    pageSizeOptions = [10, 20, 30, 40, 50],
    totalItems,
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps<TData>) {
    const isServerSide = totalItems !== undefined;

    const getPageIndex = () => {
        return isServerSide
            ? (currentPage ?? 1) - 1
            : table.getState().pagination.pageIndex;
    };

    const getPageCount = () => {
        return isServerSide ? totalPages ?? 0 : table.getPageCount();
    };

    const getPageSize = () => {
        return table.getState().pagination.pageSize;
    };

    const canPreviousPage = getPageIndex() > 0;
    const canNextPage = getPageIndex() < getPageCount() - 1;

    const handleFirstPage = () => {
        if (isServerSide) {
            onPageChange?.(1);
        } else {
            table.setPageIndex(0);
        }
    };

    const handlePreviousPage = () => {
        if (isServerSide) {
            onPageChange?.((currentPage ?? 1) - 1);
        } else {
            table.previousPage();
        }
    };

    const handleNextPage = () => {
        if (isServerSide) {
            onPageChange?.((currentPage ?? 1) + 1);
        } else {
            table.nextPage();
        }
    };

    const handleLastPage = () => {
        if (isServerSide) {
            onPageChange?.(totalPages ?? 1);
        } else {
            table.setPageIndex(table.getPageCount() - 1);
        }
    };

    const handlePageSizeChange = (value: string) => {
        const newSize = Number(value);
        if (isServerSide) {
            onPageSizeChange?.(newSize);
        } else {
            table.setPageSize(newSize);
        }
    };

    const from = getPageIndex() * getPageSize() + 1;
    const to = Math.min((getPageIndex() + 1) * getPageSize(), totalItems ?? table.getFilteredRowModel().rows.length);
    const total = totalItems ?? table.getFilteredRowModel().rows.length;

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <span className="font-medium">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s) selected
                    </span>
                )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${getPageSize()}`}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={getPageSize()} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {getPageIndex() + 1} of {getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={handleFirstPage}
                        disabled={!canPreviousPage}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={handlePreviousPage}
                        disabled={!canPreviousPage}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={handleNextPage}
                        disabled={!canNextPage}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={handleLastPage}
                        disabled={!canNextPage}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
                {total > 0 && (
                    <div className="hidden text-sm text-muted-foreground sm:block">
                        Showing {from.toLocaleString()} to {to.toLocaleString()} of{' '}
                        {total.toLocaleString()} entries
                    </div>
                )}
            </div>
        </div>
    );
}
