import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import Progress from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Martyr } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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

export default function Edit({ martyr, attachment, attachmentTypes }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, setData, post, processing, errors } = useForm({
        attachment_type: attachment.attachment_type,
        file: null as File | null,
        description: attachment.description || '',
        _method: 'PUT',
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [remoteOptions, setRemoteOptions] =
        useState<Record<string, string>>(attachmentTypes);
    const queryDebounceRef = useRef<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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
        {
            title: t('edit'),
            href: `/martyrs/${martyr.id}/attachments/${attachment.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/martyrs/${martyr.id}/attachments/${attachment.id}`, {
            onProgress: (progressEvent?: unknown) => {
                const event = progressEvent as { total?: number; lengthComputable?: boolean };
                const total =
                    typeof event?.total === 'number'
                        ? event.total
                        : event?.lengthComputable
                          ? event.total
                          : undefined;
                const loaded =
                    typeof progressEvent?.loaded === 'number'
                        ? progressEvent.loaded
                        : undefined;
                if (
                    typeof total === 'number' &&
                    typeof loaded === 'number' &&
                    total > 0
                ) {
                    setUploadProgress(Math.round((loaded / total) * 100));
                }
            },
            onSuccess: () => {
                toast({ title: 'تم تحديث المرفق بنجاح', variant: 'success' });
                setUploadProgress(null);
            },
            onError: () => {
                setUploadProgress(null);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setData('file', null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setData('file', file);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (file.type.startsWith('image/'))
                setPreviewUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (queryDebounceRef.current)
                window.clearTimeout(queryDebounceRef.current);
        };
    }, [previewUrl]);

    const handleQuery = (q: string) => {
        if (queryDebounceRef.current) {
            window.clearTimeout(queryDebounceRef.current);
        }

        // debounce
        queryDebounceRef.current = window.setTimeout(async () => {
            if (!q) {
                setRemoteOptions(attachmentTypes);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(
                    `/api/attachment-types?search=${encodeURIComponent(q)}`,
                );
                if (!res.ok) {
                    console.error('API error:', res.status);
                    setRemoteOptions({});
                    setIsLoading(false);
                    return;
                }
                const json = await res.json();
                console.log('Search results for:', q, json);
                setRemoteOptions(json);
            } catch (err) {
                console.error('Fetch error:', err);
                setRemoteOptions({});
            } finally {
                setIsLoading(false);
            }
        }, 0); // immediate for testing
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('edit')} - ${attachment.original_filename}`} />

            <div className="flex h-full min-h-screen flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-4 text-foreground md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
                    <Link
                        href={`/martyrs/${martyr.id}/attachments`}
                        className="text-primary hover:text-primary/80"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {t('edit')} {t('attachment_type').toLowerCase()}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {martyr.full_name} - {attachment.original_filename}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Attachment Type */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                {t('attachment_type')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <Combobox
                                value={data.attachment_type}
                                onChange={(value) =>
                                    setData('attachment_type', value)
                                }
                                options={remoteOptions}
                                onQueryChange={handleQuery}
                                isLoading={isLoading}
                                placeholder={t('martyrs.select_option')}
                                error={errors.attachment_type}
                            />
                            {errors.attachment_type && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.attachment_type}
                                </p>
                            )}
                        </div>

                        {/* Current File Info */}
                        <div className="rounded-lg border border-border bg-muted/50 p-4">
                            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                                {t('current_file')}
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted p-2">
                                    <FileText
                                        size={24}
                                        className="text-muted-foreground"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {attachment.original_filename}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {attachment.formatted_file_size} •{' '}
                                        {attachment.mime_type}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <a
                                        href={`/storage/${attachment.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        {t('view')}
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {/* File Upload (Optional) */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                {t('file')} ({t('martyrs.optional')})
                            </label>
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={onDrop}
                                className={`rounded-lg border p-4 transition-colors ${dragActive ? 'border-primary bg-accent/50' : 'border-dashed border-border/50'} `}
                                aria-label={t('file_drop_area')}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="hidden"
                                    id="file-upload"
                                    aria-hidden
                                />

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-18 w-18 items-center justify-center rounded-md bg-muted p-2">
                                            {data.file ? (
                                                data.file.type.startsWith(
                                                    'image/',
                                                ) && previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt={data.file.name}
                                                        className="max-h-16 rounded object-contain"
                                                    />
                                                ) : (
                                                    <FileText size={40} />
                                                )
                                            ) : (
                                                <Upload
                                                    size={40}
                                                    className="text-muted-foreground"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            {data.file ? (
                                                <>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {data.file.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(
                                                            data.file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{' '}
                                                        MB
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {t(
                                                            'select_or_drop_file',
                                                        )}{' '}
                                                        ({t('martyrs.optional')}
                                                        )
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t(
                                                            'allowed_file_types',
                                                        )}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!data.file && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                {t('choose_file')}
                                            </Button>
                                        )}

                                        {data.file && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={handleRemoveFile}
                                                    className="text-destructive"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {errors.file && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.file}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                {t('description')}
                            </Label>
                            <Textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={4}
                                className={`${errors.description ? 'border-destructive' : 'border-border'}`}
                                placeholder={t('martyrs.optional_description')}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 border-t border-gray-200 pt-4 dark:border-gray-600">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                <Save size={16} />
                                {processing ? t('martyrs.loading') : t('save')}
                            </Button>
                            <Link href={`/martyrs/${martyr.id}/attachments`}>
                                <Button type="button" variant="outline">
                                    {t('cancel')}
                                </Button>
                            </Link>
                        </div>
                        {uploadProgress !== null && (
                            <div className="mt-3">
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('uploading')} — {uploadProgress}%
                                    </span>
                                </div>
                                <Progress value={uploadProgress} />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
