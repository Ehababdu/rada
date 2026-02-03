import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import {
    createCustomColumn,
    createSortableColumn,
    formatCurrency,
    formatDate,
} from '@/lib/table-utils';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook for creating table columns with translations and common patterns
 */
export function useTableColumns<TData extends Record<string, unknown>>(
    resource: string,
    actions?: {
        onView?: (item: TData) => void;
        onEdit?: (item: TData) => void;
        onDelete?: (item: TData) => void;
    },
): ColumnDef<TData, any>[] {
    const { t } = useTranslation();

    const columns = useMemo<ColumnDef<TData, any>[]>(() => {
        const baseColumns: ColumnDef<TData, any>[] = [];

        // Add resource-specific columns
        switch (resource) {
            case 'martyrs':
                baseColumns.push(
                    createSortableColumn(
                        'full_name',
                        t('martyrs.fullName'),
                        ({ row }) => (
                            <div className="font-medium">
                                {row.original.full_name}
                            </div>
                        ),
                        (row) => row.full_name,
                    ),
                    createSortableColumn(
                        'national_id',
                        t('martyrs.nationalId'),
                        ({ row }) => (
                            <div className="font-mono text-sm">
                                {row.original.national_id}
                            </div>
                        ),
                        (row) => row.national_id,
                    ),
                    createCustomColumn(
                        'military_rank',
                        t('martyrs.militaryRank'),
                        ({ row }) => (
                            <Badge variant="outline">
                                {row.original.military_rank?.name_ar ||
                                    t('common.unknown')}
                            </Badge>
                        ),
                        (row) => row.military_rank?.name_ar || '',
                    ),
                    createSortableColumn(
                        'martyr_date',
                        t('martyrs.martyrDate'),
                        ({ row }) => formatDate(row.original.martyr_date),
                        (row) => new Date(row.martyr_date || 0).getTime(),
                    ),
                    createSortableColumn(
                        'created_at',
                        t('common.createdAt'),
                        ({ row }) => formatDate(row.original.created_at),
                        (row) => new Date(row.created_at || 0).getTime(),
                    ),
                );
                break;

            case 'compensations':
                baseColumns.push(
                    createCustomColumn(
                        'martyr_name',
                        t('compensations.martyr'),
                        ({ row }) => (
                            <div>
                                <div className="font-medium">
                                    {row.original.martyr_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {row.original.martyr_national_id}
                                </div>
                            </div>
                        ),
                        (row) => row.martyr_name,
                    ),
                    createCustomColumn(
                        'recipient_name',
                        t('compensations.recipientName'),
                        ({ row }) => row.original.recipient_name,
                        (row) => row.recipient_name,
                    ),
                    createCustomColumn(
                        'amount',
                        t('compensations.amount'),
                        ({ row }) => (
                            <div className="font-medium text-green-600">
                                {formatCurrency(row.original.amount)}
                            </div>
                        ),
                        (row) => row.amount,
                    ),
                    createCustomColumn(
                        'receipt_date',
                        t('compensations.receiptDate'),
                        ({ row }) => formatDate(row.original.receipt_date),
                        (row) => row.receipt_date,
                    ),
                    createCustomColumn(
                        'created_at',
                        t('common.createdAt'),
                        ({ row }) => formatDate(row.original.created_at),
                        (row) => row.created_at,
                    ),
                );
                break;

            case 'promotions':
                baseColumns.push(
                    createCustomColumn(
                        'martyr_name',
                        t('promotions.martyr'),
                        ({ row }) => (
                            <div>
                                <div className="font-medium">
                                    {row.original.martyr_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {row.original.martyr_national_id}
                                </div>
                            </div>
                        ),
                        (row) => row.martyr_name,
                    ),
                    createCustomColumn(
                        'from_rank',
                        t('promotions.fromRank'),
                        ({ row }) => (
                            <Badge variant="outline">
                                {row.original.from_rank?.name_ar ||
                                    t('common.unknown')}
                            </Badge>
                        ),
                        (row) => row.from_rank?.name_ar || '',
                    ),
                    createCustomColumn(
                        'to_rank',
                        t('promotions.toRank'),
                        ({ row }) => (
                            <Badge variant="secondary">
                                {row.original.to_rank?.name_ar ||
                                    t('common.unknown')}
                            </Badge>
                        ),
                        (row) => row.to_rank?.name_ar || '',
                    ),
                    createCustomColumn(
                        'promotion_date',
                        t('promotions.promotionDate'),
                        ({ row }) => formatDate(row.original.promotion_date),
                        (row) => row.promotion_date,
                    ),
                    createCustomColumn(
                        'created_at',
                        t('common.createdAt'),
                        ({ row }) => formatDate(row.original.created_at),
                        (row) => row.created_at,
                    ),
                );
                break;

            default:
                // Generic columns for unknown resources
                baseColumns.push(
                    createCustomColumn(
                        'name',
                        t('common.name'),
                        ({ row }) => row.original.name || t('common.unknown'),
                        (row) => row.name || '',
                    ),
                    createCustomColumn(
                        'created_at',
                        t('common.createdAt'),
                        ({ row }) => formatDate(row.original.created_at),
                        (row) => row.created_at,
                    ),
                );
        }

        // Add actions column if actions are provided
        if (actions && (actions.onView || actions.onEdit || actions.onDelete)) {
            baseColumns.push(
                createCustomColumn(
                    'actions',
                    t('common.actions'),
                    ({ row }) => (
                        <DataTableRowActions
                            row={row}
                            onView={actions.onView}
                            onEdit={actions.onEdit}
                            onDelete={actions.onDelete}
                        />
                    ),
                    () => '',
                ),
            );
        }

        return baseColumns;
    }, [resource, actions, t]);

    return columns;
}
