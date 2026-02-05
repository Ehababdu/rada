import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const { toast } = useToast();
    const [latestExportAvailable, setLatestExportAvailable] = useState<
        boolean | null
    >(null);
    const [latestExportUrl, setLatestExportUrl] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const checkStatus = async () => {
            try {
                const response = await fetch('/martyrs/export/status');
                if (!response.ok) return;

                const data = await response.json();
                if (mounted) {
                    setLatestExportAvailable(data.exists);
                    setLatestExportUrl(data.exists ? data.url : null);
                }
            } catch (error) {
                console.error('Failed to check export status:', error);
            }
        };

        // Initial check
        checkStatus();

        // Set up periodic checks with longer intervals
        const timeoutId = setTimeout(() => {
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
            const selectedIds = Object.keys(selectedRows).filter(
                (key) => selectedRows[key],
            );
            if (selectedIds.length > 0) {
                params.append('ids', selectedIds.join(','));
            }

            toast({
                title: t('martyrs.export_started'),
                description: t('martyrs.export_started_description'),
                variant: 'default',
            });

            window.open(`/martyrs/export?${params.toString()}`, '_blank');
        } catch {
            toast({
                title: t('common.error'),
                description: t('martyrs.export_failed'),
                variant: 'destructive',
            });
        }
    };

    return {
        latestExportAvailable,
        latestExportUrl,
        handleExport,
    };
}
