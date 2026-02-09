import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { Filters } from '../types/martyr';

interface UseMartyrExportProps {
    cleanFilters: (f: Filters) => Record<string, string>;
    localFilters: Filters;
    exportColumns: string[];
    selectedRows: Record<string, boolean>;
}

export function useMartyrExport({
    cleanFilters,
    localFilters,
    exportColumns,
    selectedRows,
}: UseMartyrExportProps) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const handleExport = async (e: React.MouseEvent) => {
        e.preventDefault();
        const payload = cleanFilters(localFilters);
        try {
            const params = new URLSearchParams(payload);
            if (exportColumns.length)
                params.append('columns', exportColumns.join(','));

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

            // Convert URLSearchParams to object for route params
            const queryObj: Record<string, string> = {};
            for (const [key, value] of params.entries()) {
                queryObj[key] = value;
            }

            window.open(route('martyrs.export', queryObj, true), '_blank');
        } catch {
            toast({
                title: t('common.error'),
                description: t('martyrs.export_failed'),
                variant: 'destructive',
            });
        }
    };

    return {
        handleExport,
    };
}
