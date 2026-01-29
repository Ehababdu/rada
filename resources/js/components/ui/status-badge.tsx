import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all',
    {
        variants: {
            variant: {
                default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
                info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
                success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                overdue: 'bg-red-600 text-white dark:bg-red-700',
            },
            size: {
                sm: 'text-[10px] px-2 py-0.5',
                default: 'text-xs px-2.5 py-0.5',
                lg: 'text-sm px-3 py-1',
            },
            animated: {
                true: 'animate-pulse',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            animated: false,
        },
    }
);

export interface StatusBadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
    /**
     * Icon to display before the text
     */
    icon?: React.ReactNode;

    /**
     * Auto-detect variant from status string
     */
    status?: string;
}

/**
 * Smart status badge with auto-detection of variant based on status
 */
export function StatusBadge({
    className,
    variant,
    size,
    animated,
    icon,
    status,
    children,
    ...props
}: StatusBadgeProps) {
    // Auto-detect variant if status is provided
    const autoVariant = status ? detectStatusVariant(status) : variant;

    return (
        <span
            className={cn(
                statusBadgeVariants({ variant: autoVariant, size, animated }),
                className
            )}
            {...props}
        >
            {icon && <span className="size-3">{icon}</span>}
            {children || status}
        </span>
    );
}

/**
 * Detect variant from status string
 */
function detectStatusVariant(
    status: string
): NonNullable<VariantProps<typeof statusBadgeVariants>['variant']> {
    const statusLower = status.toLowerCase();

    // Active states
    if (
        statusLower.includes('active') ||
        statusLower.includes('enabled') ||
        statusLower.includes('live')
    ) {
        return 'active';
    }

    // Inactive states
    if (
        statusLower.includes('inactive') ||
        statusLower.includes('disabled') ||
        statusLower.includes('suspended')
    ) {
        return 'inactive';
    }

    // Pending states
    if (
        statusLower.includes('pending') ||
        statusLower.includes('waiting') ||
        statusLower.includes('queued')
    ) {
        return 'pending';
    }

    // Overdue
    if (statusLower.includes('overdue') || statusLower.includes('متأخر') || statusLower.includes('متأخرة')) {
        return 'overdue';
    }

    // Processing states
    if (
        statusLower.includes('processing') ||
        statusLower.includes('in_progress') ||
        statusLower.includes('ongoing')
    ) {
        return 'processing';
    }

    // Completed states
    if (
        statusLower.includes('completed') ||
        statusLower.includes('done') ||
        statusLower.includes('finished')
    ) {
        return 'completed';
    }

    // Error states
    if (
        statusLower.includes('error') ||
        statusLower.includes('failed') ||
        statusLower.includes('rejected')
    ) {
        return 'error';
    }

    // Warning states
    if (
        statusLower.includes('warning') ||
        statusLower.includes('alert') ||
        statusLower.includes('attention')
    ) {
        return 'warning';
    }

    // Success states
    if (
        statusLower.includes('success') ||
        statusLower.includes('approved') ||
        statusLower.includes('verified')
    ) {
        return 'success';
    }

    // Info states
    if (
        statusLower.includes('info') ||
        statusLower.includes('draft') ||
        statusLower.includes('review')
    ) {
        return 'info';
    }

    return 'default';
}
