import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onDuplicate?: (row: TData) => void;
    customActions?: Array<{
        label: string;
        icon?: React.ReactNode;
        onClick: (row: TData) => void;
        variant?: 'default' | 'destructive';
    }>;
}

export function DataTableRowActions<TData>({
    row,
    onView,
    onEdit,
    onDelete,
    onDuplicate,
    customActions = [],
}: DataTableRowActionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {onView && (
                    <DropdownMenuItem onClick={() => onView(row.original)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                )}

                {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                )}

                {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(row.original)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                    </DropdownMenuItem>
                )}

                {customActions.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        {customActions.map((action, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => action.onClick(row.original)}
                                className={
                                    action.variant === 'destructive'
                                        ? 'text-red-600 focus:text-red-600 dark:text-red-400'
                                        : ''
                                }
                            >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </>
                )}

                {onDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original)}
                            className="text-red-600 focus:text-red-600 dark:text-red-400"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
