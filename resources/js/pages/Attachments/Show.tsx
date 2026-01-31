import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Martyr } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Download,
    Edit,
    Eye,
    FileText,
    Hash,
    Image,
    User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Attachment {
    id: number;
    martyr_id: number;
    attachment_type: string;
    file_path: string;
    original_filename: string;
    mime_type: string;
    file_size: number;
    description: string | null;
    created_at: string;
    formatted_file_size: string;
}

interface Props {
    martyr: Martyr;
    attachment: Attachment;
    attachmentTypes: Record<string, string>;
}

export default function Show({ martyr, attachment, attachmentTypes }: Props) {
    const { t, i18n } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.title'),
            href: '/martyrs',
        },
        {
            title: martyr.full_name,
            href: `/martyrs/${martyr.id}`,
        },
        {
            title: t('attachments'),
            href: `/martyrs/${martyr.id}/attachments`,
        },
        {
            title: attachment.original_filename,
            href: `/martyrs/${martyr.id}/attachments/${attachment.id}`,
        },
    ];

    const getFileIcon = (mimeType: string, size: number = 48) => {
        if (mimeType.startsWith('image/')) {
            return <Image size={size} className="text-blue-500" />;
        }
        return <FileText size={size} className="text-gray-500" />;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            i18n.language === 'ar' ? 'ar' : 'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${attachment.original_filename} - ${martyr.full_name}`}
            />

            <div className="flex h-full min-h-screen flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/martyrs/${martyr.id}/attachments`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {attachment.original_filename}
                            </h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                {martyr.full_name} -{' '}
                                {attachmentTypes[attachment.attachment_type] ||
                                    attachment.attachment_type}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/martyrs/${martyr.id}/attachments/${attachment.id}/edit`}
                        >
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Edit size={16} />
                                {t('edit')}
                            </Button>
                        </Link>
                        <a
                            href={`/storage/${attachment.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Eye size={16} />
                                {t('view_file')}
                            </Button>
                        </a>
                        <a href={`/storage/${attachment.file_path}`} download>
                            <Button className="flex items-center gap-2">
                                <Download size={16} />
                                {t('download_file')}
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* File Preview */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('view_file')}
                            </h2>

                            {attachment.mime_type.startsWith('image/') ? (
                                <div className="flex justify-center">
                                    <img
                                        src={`/storage/${attachment.file_path}`}
                                        alt={attachment.original_filename}
                                        className="h-auto max-h-96 max-w-full rounded-lg border border-gray-200 object-contain dark:border-gray-600"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-4 rounded-full bg-gray-50 p-6 dark:bg-gray-700">
                                        {getFileIcon(attachment.mime_type, 64)}
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {attachment.original_filename}
                                    </h3>
                                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                                        {attachment.mime_type}
                                    </p>
                                    <div className="flex gap-3">
                                        <a
                                            href={`/storage/${attachment.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                        >
                                            <Eye size={16} />
                                            {t('view_file')}
                                        </a>
                                        <a
                                            href={`/storage/${attachment.file_path}`}
                                            download
                                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                                        >
                                            <Download size={16} />
                                            {t('download_file')}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* File Information */}
                    <div className="space-y-6">
                        {/* File Details */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('martyrs.details')}
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                        {getFileIcon(attachment.mime_type, 20)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {t('file_name')}
                                        </p>
                                        <p className="text-sm break-all text-gray-900 dark:text-gray-100">
                                            {attachment.original_filename}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                                        <Hash
                                            size={20}
                                            className="text-green-600 dark:text-green-400"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {t('attachment_type')}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {attachmentTypes[
                                                attachment.attachment_type
                                            ] || attachment.attachment_type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
                                        <FileText
                                            size={20}
                                            className="text-purple-600 dark:text-purple-400"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {t('file_size')}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {attachment.formatted_file_size}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20">
                                        <Calendar
                                            size={20}
                                            className="text-orange-600 dark:text-orange-400"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {t('upload_date')}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {formatDate(attachment.created_at)}
                                        </p>
                                    </div>
                                </div>

                                {attachment.description && (
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                                            <FileText
                                                size={20}
                                                className="text-gray-600 dark:text-gray-400"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {t('description')}
                                            </p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {attachment.description}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Martyr Information */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('martyrs.martyr_info')}
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                        <User
                                            size={20}
                                            className="text-blue-600 dark:text-blue-400"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {t('martyrs.full_name')}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {martyr.full_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                                        <Hash
                                            size={20}
                                            className="text-green-600 dark:text-green-400"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {t('martyrs.national_id')}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {martyr.national_id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
