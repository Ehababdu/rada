import { MoreHorizontal, Trash2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

interface BulkAction<TData> {
    label: string;
    action: (selectedRows: TData[]) => void;
    variant?: 'default' | 'destructive';
    confirmMessage?: string;
}

interface BulkActionsProps<TData> {
    bulkActions: BulkAction<TData>[];
    selectedRows: TData[];
    onClearSelection: () => void;
}

export function BulkActions<TData>({
    bulkActions,
    selectedRows,
    onClearSelection,
}: BulkActionsProps<TData>) {
    const { t } = useTranslation();
    const [confirmAction, setConfirmAction] = React.useState<{
        action: BulkAction<TData>;
        isOpen: boolean;
    } | null>(null);

    const handleAction = (action: BulkAction<TData>) => {
        if (action.confirmMessage) {
            setConfirmAction({ action, isOpen: true });
        } else {
            action.action(selectedRows);
            onClearSelection();
        }
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction.action.action(selectedRows);
            onClearSelection();
            setConfirmAction(null);
        }
    };

    if (selectedRows.length === 0) return null;

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    {selectedRows.length} {t('dataTable.selected')}
                </span>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            {t('dataTable.actions')}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {bulkActions.map((action, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => handleAction(action)}
                                className={
                                    action.variant === 'destructive'
                                        ? 'text-destructive focus:text-destructive'
                                        : ''
                                }
                            >
                                {action.variant === 'destructive' && (
                                    <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm" onClick={onClearSelection}>
                    {t('dataTable.clearSelection')}
                </Button>
            </div>

            {confirmAction && (
                <ConfirmDialog
                    open={confirmAction.isOpen}
                    onOpenChange={(open) => {
                        if (!open) setConfirmAction(null);
                    }}
                    onConfirm={handleConfirm}
                    title={t('confirm.title')}
                    description={
                        confirmAction.action.confirmMessage ||
                        t('confirm.defaultMessage')
                    }
                    confirmText={confirmAction.action.label}
                    type={
                        confirmAction.action.variant === 'destructive'
                            ? 'danger'
                            : 'warning'
                    }
                />
            )}
        </>
    );
}
