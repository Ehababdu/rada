import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Download, Edit, Trash2, MoreHorizontal, Upload, FileImage, FileVideo, FileAudio, File } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { dashboard } from '@/routes';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Attachment {
    id: number;
    martyr_id: number;
    attachment_type: {
        id: number;
        label: string;
        created_at: string;
        updated_at: string;
    };
    attachment_type_label?: string;
    file_path: string;
    original_filename: string;
    mime_type: string;
    file_size: number;
    description?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    martyr: {
        id: number;
        full_name: string;
    };
    attachments: {
        data: Attachment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    attachmentTypes: Record<string, string>;
    filters: {
        search?: string;
        type?: string;
    };
}

export default function Index({ martyr, attachments, attachmentTypes, filters }: Props) {
    const { t } = useTranslation();
    const { can } = usePermissions('attachments');
    const canCreate = can('canCreate');
    const canDelete = can('canDelete');
    const canRead = can('canRead');
    const canUpdate = can('canUpdate');

    React.useEffect(() => {
        if (!canRead) {
            router.visit(dashboard.definition?.url ?? '/dashboard');
        }
    }, [canRead]);

    if (!canRead) return null; // Prevent rendering while redirecting

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.martyrs'),
            href: '/martyrs',
        },
        {
            title: martyr.full_name,
            href: `/martyrs/${martyr.id}`,
        },
        {
            title: t('attachments.attachments'),
            href: `/martyrs/${martyr.id}/attachments`,
        },
    ];

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // Function to get file icon based on MIME type
    const getFileIcon = (mimeType: string) => {
        if (mimeType?.startsWith('image/')) return FileImage;
        if (mimeType?.startsWith('video/')) return FileVideo;
        if (mimeType?.startsWith('audio/')) return FileAudio;
        return FileText;
    };

    // Function to format file size
    const formatFileSize = (bytes: number) => {
        if (!bytes) return '';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };
    const [uploadedModalOpen, setUploadedModalOpen] = useState(false);
    const [notUploadedModalOpen, setNotUploadedModalOpen] = useState(false);

    // Calculate attachment statistics and separate data
    const attachmentStats = React.useMemo(() => {
        const allTypes = Object.keys(attachmentTypes);
        const uploaded: Attachment[] = [];
        const notUploaded: any[] = [];

        allTypes.forEach(type => {
            const attachment = attachments.data.find(att => att.attachment_type.id === parseInt(type));
            if (attachment && attachment.file_path && attachment.file_path.trim() !== '') {
                uploaded.push(attachment);
            } else {
                // Create a placeholder attachment for required documents that haven't been uploaded
                notUploaded.push({
                    id: attachment ? attachment.id : null,
                    martyr_id: martyr.id,
                    attachment_type: type,
                    file_path: null,
                    original_filename: null,
                    mime_type: null,
                    file_size: null,
                    description: attachment ? attachment.description : null,
                    created_at: attachment ? attachment.created_at : null,
                    updated_at: attachment ? attachment.updated_at : null,
                });
            }
        });

        return {
            uploaded,
            notUploaded,
            uploadedCount: uploaded.length,
            notUploadedCount: notUploaded.length,
            total: allTypes.length
        };
    }, [attachments.data, attachmentTypes, martyr.id]);

    const columns = React.useMemo<ColumnDef<Attachment, any>[]>(() => [
        {
            id: 'type',
            accessorKey: 'attachment_type',
            header: t('attachments.type') || 'النوع',
            cell: ({ row }) => {
                const type = row.original.attachment_type.id;
                const label = row.original.attachment_type_label || row.original.attachment_type.label;
                const FileIcon = getFileIcon(row.original.mime_type);
                return (
                    <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
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
                const hasFile = row.original.file_path && row.original.file_path.trim() !== '';
                return (
                    <Badge variant={hasFile ? "default" : "destructive"} className={hasFile ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-white dark:border-green-700" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-white dark:border-red-700"}>
                        {hasFile ? (t('attachments.file_uploaded') || 'تم التحميل') : (t('attachments.file_not_uploaded') || 'لم يتم التحميل')}
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
                    <span className="text-sm text-muted-foreground">
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
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <a
                                href={`/storage/${attachment.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                            >
                                <Eye className="h-4 w-4" />
                                {t('attachments.view_file') || 'عرض'}
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <a
                                href={`/storage/${attachment.file_path}`}
                                download={attachment.original_filename}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                {t('attachments.download') || 'تحميل'}
                            </a>
                        </Button>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: t('attachments.actions') || 'الإجراءات',
            cell: ({ row }) => {
                const attachment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t('attachments.open_menu') || 'فتح القائمة'}</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/martyrs/${martyr.id}/attachments/${attachment.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('attachments.show') || 'عرض'}
                                </Link>
                            </DropdownMenuItem>
                            {canUpdate && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/martyrs/${martyr.id}/attachments/${attachment.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        {t('attachments.edit') || 'تعديل'}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onSelect={() => {
                                        setDeletingId(attachment.id);
                                        setDeleteOpen(true);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('attachments.delete') || 'حذف'}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [attachmentTypes, t, martyr.id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('attachments.attachments')} - ${martyr.full_name}`} />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('attachments.delete_attachment') || 'حذف المرفق'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('attachments.delete_confirmation') || 'هل أنت متأكد من حذف هذا المرفق؟ لا يمكن التراجع عن هذا الإجراء.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('common.cancel') || 'إلغاء'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deletingId) {
                                    router.delete(`/martyrs/${martyr.id}/attachments/${deletingId}`, {
                                        onSuccess: () => {
                                            setDeleteOpen(false);
                                            setDeletingId(null);
                                        },
                                    });
                                }
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('attachments.delete') || 'حذف'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {t('attachments.attachments_for')} {martyr.full_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('attachments.total_attachments')}: {attachments.total}
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Link href={`/martyrs/${martyr.id}/attachments/create`}>
                                <Upload className="h-4 w-4 mr-2" />
                                {t('attachments.add_attachment') || 'إضافة مرفق'}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Attachment Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Uploaded Data Card */}
                    <Card className="border border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                    <FileText className="h-3 w-3 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xs text-green-800 dark:text-green-200">
                                        {t('attachments.uploaded_data')}
                                    </CardTitle>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        {attachmentStats.uploadedCount} {t('attachments.attachments')}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Dialog open={uploadedModalOpen} onOpenChange={setUploadedModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900">
                                        <Eye className="h-3 w-3 mr-1" />
                                        {t('attachments.view_details')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-green-800 dark:text-green-200">
                                            {t('attachments.uploaded_data')} ({attachmentStats.uploadedCount})
                                        </DialogTitle>
                                        <DialogDescription>
                                            {t('attachments.uploaded_data_description')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-3">
                                        {attachmentStats.uploaded.map((attachment) => {
                                            const FileIcon = getFileIcon(attachment.mime_type);
                                            return (
                                                <div key={attachment.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                                                    <div className="flex items-center gap-3">
                                                        <FileIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-sm text-green-800 dark:text-green-200 truncate">{attachment.original_filename}</p>
                                                            <p className="text-xs text-muted-foreground truncate">نوع: {attachment.attachment_type_label || attachmentTypes[attachment.attachment_type.id] || attachment.attachment_type.label}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-green-600 dark:text-green-400">{formatFileSize(attachment.file_size)}</span>
                                                                {attachment.description && (
                                                                    <span className="text-xs text-green-700 dark:text-green-300">• {attachment.description}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={`/storage/${attachment.file_path}`} target="_blank" rel="noopener noreferrer" title={t('attachments.view_file')}>
                                                                <Eye className="h-3 w-3" />
                                                            </a>
                                                        </Button>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={`/storage/${attachment.file_path}`} download={attachment.original_filename} title={t('attachments.download')}>
                                                                <Download className="h-3 w-3" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Not Uploaded Data Card */}
                    <Card className="border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                    <FileText className="h-3 w-3 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xs text-red-800 dark:text-red-200">
                                        {t('attachments.not_uploaded_data')}
                                    </CardTitle>
                                    <p className="text-xs text-red-600 dark:text-red-400">
                                        {attachmentStats.notUploadedCount} {t('attachments.attachments')}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Dialog open={notUploadedModalOpen} onOpenChange={setNotUploadedModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900">
                                        <Eye className="h-3 w-3 mr-1" />
                                        {t('attachments.view_details')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-red-800 dark:text-red-200">
                                            {t('attachments.not_uploaded_data')} ({attachmentStats.notUploadedCount})
                                        </DialogTitle>
                                        <DialogDescription>
                                            {t('attachments.not_uploaded_data_description')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-3">
                                        {attachmentStats.notUploaded.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-sm text-red-800 dark:text-red-200">نوع: {attachmentTypes[attachment.attachment_type] || attachment.attachment_type}</p>
                                                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{t('attachments.required_document')}</p>
                                                        {attachment.description && (
                                                            <p className="text-xs text-red-700 dark:text-red-300 mt-1 italic truncate">{attachment.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {canCreate && (
                                                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900" asChild>
                                                            <Link href={attachment.id ? `/martyrs/${martyr.id}/attachments/${attachment.id}/edit` : `/martyrs/${martyr.id}/attachments/create?type=${attachment.attachment_type.id}`}>
                                                                <Upload className="h-3 w-3 mr-1" />
                                                                {t('attachments.upload_now')}
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Overall Status Card */}
                    <Card className={cn(
                        "border",
                        attachmentStats.uploadedCount === attachmentStats.total
                            ? "border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800"
                            : "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800"
                    )}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center",
                                    attachmentStats.uploadedCount === attachmentStats.total
                                        ? "bg-green-100 dark:bg-green-900"
                                        : "bg-yellow-100 dark:bg-yellow-900"
                                )}>
                                    {attachmentStats.uploadedCount === attachmentStats.total ? (
                                        <FileText className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <FileText className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                    )}
                                </div>
                                <div>
                                    <CardTitle className={cn(
                                        "text-xs",
                                        attachmentStats.uploadedCount === attachmentStats.total
                                            ? "text-green-800 dark:text-green-200"
                                            : "text-yellow-800 dark:text-yellow-200"
                                    )}>
                                        {attachmentStats.uploadedCount === attachmentStats.total
                                            ? (t('attachments.data_complete') || 'مستوفي البيانات')
                                            : (t('attachments.data_incomplete') || 'غير مستوفي البيانات')
                                        }
                                    </CardTitle>
                                    <p className={cn(
                                        "text-xs",
                                        attachmentStats.uploadedCount === attachmentStats.total
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-yellow-600 dark:text-yellow-400"
                                    )}>
                                        {attachmentStats.uploadedCount} / {attachmentStats.total} {t('attachments.attachments')}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-center">
                                <div className={cn(
                                    "inline-flex items-center justify-center w-12 h-12 rounded-full mb-2",
                                    attachmentStats.uploadedCount === attachmentStats.total
                                        ? "bg-green-100 dark:bg-green-900"
                                        : "bg-yellow-100 dark:bg-yellow-900"
                                )}>
                                    <span className={cn(
                                        "text-lg font-bold",
                                        attachmentStats.uploadedCount === attachmentStats.total
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-yellow-600 dark:text-yellow-400"
                                    )}>
                                        {Math.round((attachmentStats.uploadedCount / attachmentStats.total) * 100)}%
                                    </span>
                                </div>
                                <p className={cn(
                                    "text-xs",
                                    attachmentStats.uploadedCount === attachmentStats.total
                                        ? "text-green-700 dark:text-green-300"
                                        : "text-yellow-700 dark:text-yellow-300"
                                )}>
                                    {attachmentStats.uploadedCount === attachmentStats.total
                                        ? (t('attachments.all_documents_uploaded') || 'تم تحميل جميع المستندات المطلوبة')
                                        : (t('attachments.missing_documents', { count: attachmentStats.notUploadedCount }) || `متبقي ${attachmentStats.notUploadedCount} مستند`)
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('attachments.attachments_list') || 'قائمة المرفقات'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={attachments.data}
                            searchKey="type"
                            searchPlaceholder={t('attachments.search_by_type') || 'البحث حسب النوع...'}
                            showPagination={true}
                        />
                    </CardContent>
                </Card>

                {/* Custom Pagination for server-side pagination */}
                {attachments.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {t('pagination.showing', {
                                from: attachments.from,
                                to: attachments.to,
                                total: attachments.total,
                            })}
                        </p>
                        <div className="flex items-center space-x-2">
                            {attachments.current_page > 1 && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/martyrs/${martyr.id}/attachments?page=${attachments.current_page - 1}`}>
                                        {t('pagination.previous')}
                                    </Link>
                                </Button>
                            )}

                            <span className="text-sm">
                                {t('pagination.page')} {attachments.current_page} {t('pagination.of')} {attachments.last_page}
                            </span>

                            {attachments.current_page < attachments.last_page && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/martyrs/${martyr.id}/attachments?page=${attachments.current_page + 1}`}>
                                        {t('pagination.next')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
