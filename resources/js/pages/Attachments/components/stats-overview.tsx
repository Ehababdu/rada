import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Download, Eye, FileText, Upload } from 'lucide-react';
import { useState } from 'react';
import { AttachmentStats } from '../types';
import { formatFileSize, getFileIcon } from './utils';

interface StatsOverviewProps {
    stats: AttachmentStats;
    t: (key: string, params?: unknown) => string;
    martyrId: number;
    canCreate: boolean;
}

export function StatsOverview({
    stats,
    t,
    martyrId,
    canCreate,
}: StatsOverviewProps) {
    const [uploadedModalOpen, setUploadedModalOpen] = useState(false);
    const [notUploadedModalOpen, setNotUploadedModalOpen] = useState(false);

    const isComplete = stats.uploadedCount === stats.total;
    const completionPercentage = Math.round(
        (stats.uploadedCount / (stats.total || 1)) * 100,
    );

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Uploaded Card */}
            <Card className="border-l-4 border-l-emerald-500 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {t('attachments.uploaded_data')}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.uploadedCount}
                    </div>
                    <p className="mb-4 text-xs text-muted-foreground">
                        {t('attachments.attachments')}
                    </p>

                    <Dialog
                        open={uploadedModalOpen}
                        onOpenChange={setUploadedModalOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-full text-xs"
                            >
                                <Eye className="mr-2 h-3 w-3" />
                                {t('attachments.view_details')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {t('attachments.uploaded_data')}
                                </DialogTitle>
                                <DialogDescription>
                                    {t('attachments.uploaded_data_description')}
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[60vh] pr-4">
                                <div className="space-y-3">
                                    {stats.uploaded.map((attachment) => {
                                        const FileIcon = getFileIcon(
                                            attachment.mime_type,
                                        );
                                        return (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center justify-between rounded-lg border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-md bg-secondary/50 p-2">
                                                        <FileIcon className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="max-w-[200px] truncate text-sm font-medium sm:max-w-md">
                                                            {
                                                                attachment.original_filename
                                                            }
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>
                                                                {attachment.attachment_type_label ||
                                                                    attachment
                                                                        .attachment_type
                                                                        ?.label}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {formatFileSize(
                                                                    attachment.file_size,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`/storage/${attachment.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`/storage/${attachment.file_path}`}
                                                            download={
                                                                attachment.original_filename
                                                            }
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Not Uploaded Card */}
            <Card className="border-l-4 border-l-rose-500 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {t('attachments.not_uploaded_data')}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.notUploadedCount}
                    </div>
                    <p className="mb-4 text-xs text-muted-foreground">
                        {t('attachments.attachments')}
                    </p>

                    <Dialog
                        open={notUploadedModalOpen}
                        onOpenChange={setNotUploadedModalOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-full border-rose-200 text-xs text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950"
                            >
                                <Eye className="mr-2 h-3 w-3" />
                                {t('attachments.view_details')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-rose-600">
                                    {t('attachments.not_uploaded_data')}
                                </DialogTitle>
                                <DialogDescription>
                                    {t(
                                        'attachments.not_uploaded_data_description',
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[60vh] pr-4">
                                <div className="space-y-3">
                                    {stats.notUploaded.map((type, idx) => (
                                        <div
                                            key={type.id || idx}
                                            className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/50 p-3 dark:border-rose-900 dark:bg-rose-950/20"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-md bg-rose-100 p-2 dark:bg-rose-900/50">
                                                    <FileText className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-rose-900 dark:text-rose-100">
                                                        {type.full_name}
                                                    </p>
                                                    <p className="text-xs text-rose-600 dark:text-rose-300">
                                                        {t(
                                                            'attachments.required_document',
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {canCreate && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-rose-200 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/martyrs/${martyrId}/attachments/create?type=${type.id}`}
                                                    >
                                                        <Upload className="mr-2 h-3 w-3" />
                                                        {t(
                                                            'attachments.upload_now',
                                                        )}
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Completion Status */}
            <Card
                className={cn(
                    'border-l-4 shadow-sm transition-shadow hover:shadow-md',
                    isComplete ? 'border-l-green-500' : 'border-l-amber-500',
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {isComplete
                            ? t('attachments.data_complete') ||
                              'مستوفي البيانات'
                            : t('attachments.data_incomplete') ||
                              'غير مستوفي البيانات'}
                    </CardTitle>
                    <div
                        className={cn(
                            'h-2 w-2 rounded-full',
                            isComplete
                                ? 'animate-pulse bg-green-500'
                                : 'bg-amber-500',
                        )}
                    />
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-end justify-between">
                        <div className="text-2xl font-bold">
                            {completionPercentage}%
                        </div>
                        <span className="mb-1 text-xs text-muted-foreground">
                            {stats.uploadedCount} / {stats.total}
                        </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                            className={cn(
                                'h-full transition-all duration-500 ease-out',
                                isComplete ? 'bg-green-500' : 'bg-amber-500',
                            )}
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        {isComplete
                            ? t('attachments.all_documents_uploaded') ||
                              'تم تحميل جميع المستندات المطلوبة'
                            : t('attachments.missing_documents', {
                                  count: stats.notUploadedCount,
                              }) || `متبقي ${stats.notUploadedCount} مستند`}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
