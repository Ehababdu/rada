import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Download, Eye } from 'lucide-react';
import { Attachment } from '../types';
import { AttachmentActions } from './attachment-actions';
import { formatFileSize, getFileIcon } from './utils';

interface GetColumnsProps {
    t: (key: string) => string;
    martyrId: number;
    canUpdate: boolean;
    canDelete: boolean;
    onDelete: (id: number) => void;
    // attachmentTypes: Record<string, string>; // Not strictly needed if labels are in data, but good for fallbacks
}

export const getColumns = ({
    t,
    martyrId,
    canUpdate,
    canDelete,
    onDelete,
}: GetColumnsProps): ColumnDef<Attachment>[] => [
    {
        id: 'type',
        accessorKey: 'attachment_type',
        header: t('attachments.type') || 'النوع',
        cell: ({ row }) => {
            const label =
                row.original.attachment_type_label ||
                row.original.attachment_type.label;
            const FileIcon = getFileIcon(row.original.mime_type);
            return (
                <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs font-normal">
                        {label}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'status',
        accessorKey: 'file_path',
        header: t('attachments.status') || 'الحالة',
        cell: ({ row }) => {
            const hasFile =
                row.original.file_path && row.original.file_path.trim() !== '';
            return (
                <Badge
                    variant={hasFile ? 'outline' : 'destructive'}
                    className={
                        hasFile
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400'
                    }
                >
                    {hasFile
                        ? t('attachments.file_uploaded') || 'تم التحميل'
                        : t('attachments.file_not_uploaded') ||
                          'لم يتم التحميل'}
                </Badge>
            );
        },
    },
    {
        id: 'file_size',
        accessorKey: 'file_size',
        header: t('attachments.file_size') || 'حجم الملف',
        cell: ({ row }) => {
            const fileSize = row.original.file_size;
            return (
                <span className="font-mono text-sm text-muted-foreground">
                    {fileSize ? formatFileSize(fileSize) : '-'}
                </span>
            );
        },
    },
    {
        id: 'view',
        header: t('attachments.view') || 'عرض المرفق',
        cell: ({ row }) => {
            const attachment = row.original;
            return (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-primary"
                        asChild
                    >
                        <a
                            href={`/storage/${attachment.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Eye className="mr-1 h-4 w-4" />
                            {t('attachments.view_file') || 'عرض'}
                        </a>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-primary"
                        asChild
                    >
                        <a
                            href={`/storage/${attachment.file_path}`}
                            download={attachment.original_filename}
                        >
                            <Download className="mr-1 h-4 w-4" />
                            {t('attachments.download') || 'تحميل'}
                        </a>
                    </Button>
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <AttachmentActions
                attachment={row.original}
                martyrId={martyrId}
                canUpdate={canUpdate}
                canDelete={canDelete}
                onDelete={onDelete}
                t={t}
            />
        ),
    },
];
