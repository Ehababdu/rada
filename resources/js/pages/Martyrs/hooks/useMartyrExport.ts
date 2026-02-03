import { useEffect, useState } from 'react';
import type { Filters } from '../types/martyr';

interface UseMartyrExportProps {
    cleanFilters: (f: Filters) => Record<string, string>;
    localFilters: Filters;
    visibleColumns: string[];
    selectedRows: Record<string, boolean>;
}

export function useMartyrExport({
    cleanFilters,
    localFilters,
    visibleColumns,
    selectedRows,
}: UseMartyrExportProps) {
    const [latestExportAvailable, setLatestExportAvailable] = useState<boolean | null>(null);
    const [latestExportUrl, setLatestExportUrl] = useState<string | null>(null);

    // Check Export Status - Only once on mount
    useEffect(() => {
        let mounted = true;
        let timeoutId: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const res = await fetch('/martyrs/export/status');
                const data = await res.json();
                if (mounted) {
                    setLatestExportAvailable(!!data.exists);
                    setLatestExportUrl(data.url);
                }
            } catch {
                if (mounted) setLatestExportAvailable(false);
            }
        };

        // Initial check
        checkStatus();

        // Set up periodic checks with longer intervals
        timeoutId = setTimeout(() => {
            if (mounted) checkStatus();
        }, 30000); // Check every 30 seconds instead of constantly

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
        };
    }, []); // Empty dependency array - only run once

    const handleExport = async (e: React.MouseEvent) => {
        e.preventDefault();
        const payload = cleanFilters(localFilters);
        try {
            const params = new URLSearchParams(payload);
            params.append('sync', '1');
            if (visibleColumns.length)
                params.append('columns', visibleColumns.join(','));

            // Add selected row IDs if any are selected
            const selectedIds = Object.keys(selectedRows).filter(key => selectedRows[key]);
            if (selectedIds.length > 0) {
                params.append('ids', selectedIds.join(','));
            }

            window.open(`/martyrs/export?${params.toString()}`, '_blank');
        } catch {
            // Ignore errors
        }
    };

    return {
        latestExportAvailable,
        latestExportUrl,
        handleExport,
    };
}