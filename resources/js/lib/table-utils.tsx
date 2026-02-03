import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Column, ColumnDef, Row, Table } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import React from 'react';

/**
 * Utility functions for table operations
 */

/**
 * Create a sortable column with custom cell renderer
 */
export function createSortableColumn<TData, TValue>(
    id: string,
    header: string,
    cell: (props: {
        getValue: () => TValue;
        row: Row<TData>;
        column: Column<TData, TValue>;
        table: Table<TData>;
    }) => React.ReactNode,
    accessorFn: (row: TData) => TValue,
): ColumnDef<TData, TValue> {
    return {
        id,
        accessorFn,
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className={cn(
                        '-ml-4 h-8 data-[state=open]:bg-accent',
                        isSorted && 'text-foreground',
                    )}
                >
                    <span>{header}</span>
                    {isSorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === 'desc' && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {!isSorted && (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            );
        },
        cell,
        enableSorting: true,
    };
}

/**
 * Create a column with custom cell renderer
 */
export function createCustomColumn<TData, TValue>(
    id: string,
    header: string,
    cell: (props: {
        getValue: () => TValue;
        row: Row<TData>;
        column: Column<TData, TValue>;
        table: Table<TData>;
    }) => React.ReactNode,
    accessorFn: (row: TData) => TValue,
): ColumnDef<TData, TValue> {
    return {
        id,
        accessorFn,
        header,
        cell,
        enableSorting: false,
    };
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency = 'EGP'): string {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency,
    }).format(value);
}

/**
 * Format dates
 */
export function formatDate(
    date: string | Date | null | undefined,
    locale = 'ar-EG',
): string {
    if (!date) return '-';
    try {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(date));
    } catch {
        console.warn('Invalid date value:', date);
        return '-';
    }
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const target = new Date(date);
    const diffInMs = now.getTime() - target.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'اليوم';
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`;
    if (diffInDays < 365) return `منذ ${Math.floor(diffInDays / 30)} أشهر`;
    return `منذ ${Math.floor(diffInDays / 365)} سنوات`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Create status badge variants
 */
export function getStatusVariant(
    status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
        case 'active':
        case 'نشط':
            return 'default';
        case 'inactive':
        case 'غير نشط':
        case 'vacation':
            return 'secondary';
        case 'pending':
        case 'معلق':
            return 'outline';
        case 'cancelled':
        case 'ملغي':
        case 'rejected':
        case 'مرفوض':
            return 'destructive';
        default:
            return 'secondary';
    }
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

/**
 * Generate table export data
 */
export function generateExportData<TData>(
    data: TData[],
    columns: ColumnDef<TData, unknown>[],
    filename: string,
): void {
    const headers = columns
        .filter((col) => col.id && col.header)
        .map((col) => String(col.header));

    const rows = data.map((item) =>
        columns
            .filter((col) => col.id)
            .map((col) => {
                const value = (item as Record<string, unknown>)[col.id!];
                return String(value || '');
            }),
    );

    const csvContent = [headers, ...rows]
        .map((row) =>
            row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','),
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
}

/**
 * Export data to Excel format
 */
export function exportToExcel<TData>(data: TData[], tableName: string): void {
    // TODO: Implement Excel export
    console.log('Exporting to Excel:', data.length, 'records from', tableName);
}

/**
 * Export data to PDF format
 */
export function exportToPDF<TData>(data: TData[], tableName: string): void {
    // TODO: Implement PDF export
    console.log('Exporting to PDF:', data.length, 'records from', tableName);
}
