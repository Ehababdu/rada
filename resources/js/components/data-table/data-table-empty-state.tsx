import { Button } from '@/components/ui/button';
import { FileSearch, Plus, RefreshCw } from 'lucide-react';

interface DataTableEmptyStateProps {
    /**
     * Current search query
     */
    searchQuery?: string;

    /**
     * Whether filters are active
     */
    isFiltered?: boolean;

    /**
     * Callback to reset filters/search
     */
    onReset?: () => void;

    /**
     * Callback for primary action (e.g., "Add new")
     */
    onPrimaryAction?: () => void;

    /**
     * Primary action button text
     */
    primaryActionText?: string;

    /**
     * Custom empty message
     */
    emptyMessage?: string;

    /**
     * Custom empty description
     */
    emptyDescription?: string;
}

export function DataTableEmptyState({
    searchQuery,
    isFiltered = false,
    onReset,
    onPrimaryAction,
    primaryActionText = 'Add New',
    emptyMessage,
    emptyDescription,
}: DataTableEmptyStateProps) {
    // Determine the message based on context
    const message = searchQuery
        ? `No results found for "${searchQuery}"`
        : isFiltered
          ? 'No results match your filters'
          : emptyMessage || 'No data available';

    const description = searchQuery
        ? 'Try adjusting your search terms'
        : isFiltered
          ? 'Try removing some filters to see more results'
          : emptyDescription || 'Get started by adding your first item';

    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex animate-in flex-col items-center gap-6 text-center duration-500 fade-in-50">
                {/* Icon with gradient background */}
                <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
                    <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30">
                        <FileSearch className="size-10 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {message}
                    </h3>
                    <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {(searchQuery || isFiltered) && onReset && (
                        <Button
                            variant="outline"
                            onClick={onReset}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="size-4" />
                            Clear filters
                        </Button>
                    )}

                    {!searchQuery && !isFiltered && onPrimaryAction && (
                        <Button
                            onClick={onPrimaryAction}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Plus className="size-4" />
                            {primaryActionText}
                        </Button>
                    )}
                </div>

                {/* Helpful tips */}
                {(searchQuery || isFiltered) && (
                    <div className="mt-4 max-w-md rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            <strong>Tip:</strong> Use fuzzy search for partial
                            matches. Try searching with different keywords or
                            check your spelling.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
