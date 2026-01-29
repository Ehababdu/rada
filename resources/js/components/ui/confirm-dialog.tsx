import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export interface ConfirmDialogProps {
    /**
     * Whether the dialog is open
     */
    open: boolean;

    /**
     * Callback when the dialog should close
     */
    onOpenChange: (open: boolean) => void;

    /**
     * Callback when the user confirms
     */
    onConfirm: () => void | Promise<void>;

    /**
     * Dialog title
     */
    title?: string;

    /**
     * Dialog description
     */
    description?: string;

    /**
     * Type of confirmation
     */
    type?: 'danger' | 'warning' | 'info' | 'success';

    /**
     * Confirm button text
     */
    confirmText?: string;

    /**
     * Cancel button text
     */
    cancelText?: string;

    /**
     * Whether the confirm action is loading
     */
    loading?: boolean;
}

const typeConfig = {
    danger: {
        icon: XCircle,
        iconColor: 'text-red-600 dark:text-red-400',
        confirmVariant: 'destructive' as const,
    },
    warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        confirmVariant: 'default' as const,
    },
    info: {
        icon: Info,
        iconColor: 'text-blue-600 dark:text-blue-400',
        confirmVariant: 'default' as const,
    },
    success: {
        icon: CheckCircle,
        iconColor: 'text-green-600 dark:text-green-400',
        confirmVariant: 'default' as const,
    },
};

/**
 * A reusable confirmation dialog component
 * Replaces native window.confirm() with a beautiful UI
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    type = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
}: ConfirmDialogProps) {
    const config = typeConfig[type];
    const Icon = config.icon;

    const handleConfirm = async () => {
        await onConfirm();
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-full bg-${type === 'danger' ? 'red' : type === 'warning' ? 'yellow' : type === 'success' ? 'green' : 'blue'}-100 dark:bg-${type === 'danger' ? 'red' : type === 'warning' ? 'yellow' : type === 'success' ? 'green' : 'blue'}-900/20`}>
                            <Icon className={`size-5 ${config.iconColor}`} />
                        </div>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-2">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className={
                            config.confirmVariant === 'destructive'
                                ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                                : ''
                        }
                    >
                        {loading ? 'Loading...' : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/**
 * Hook to use confirm dialog
 *  
 * Usage:
 * ```tsx
 * const { confirm, ConfirmDialog } = useConfirm();
 * 
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'Delete item?',
 *     description: 'This will permanently delete the item.',
 *   });
 *   
 *   if (confirmed) {
 *     // Do delete
 *   }
 * };
 * 
 * return (
 *   <>
 *     <Button onClick={handleDelete}>Delete</Button>
 *     <ConfirmDialog />
 *   </>
 * );
 * ```
 */
export function useConfirm() {
    const [state, setState] = React.useState<{
        open: boolean;
        props: Partial<ConfirmDialogProps>;
        resolve: ((value: boolean) => void) | null;
    }>({
        open: false,
        props: {},
        resolve: null,
    });

    const confirm = React.useCallback((props: Partial<ConfirmDialogProps> = {}) => {
        return new Promise<boolean>((resolve) => {
            setState({
                open: true,
                props,
                resolve,
            });
        });
    }, []);

    const handleConfirm = React.useCallback(async () => {
        state.resolve?.(true);
        setState((s) => ({ ...s, open: false }));
    }, [state.resolve]);

    const handleCancel = React.useCallback(() => {
        state.resolve?.(false);
        setState((s) => ({ ...s, open: false }));
    }, [state.resolve]);

    const ConfirmDialogComponent = React.useCallback(
        () => (
            <ConfirmDialog
                open={state.open}
                onOpenChange={(open) => {
                    if (!open) handleCancel();
                }}
                onConfirm={handleConfirm}
                {...state.props}
            />
        ),
        [state, handleConfirm, handleCancel]
    );

    return {
        confirm,
        ConfirmDialog: ConfirmDialogComponent,
    };
}

// Add React import
import React from 'react';
