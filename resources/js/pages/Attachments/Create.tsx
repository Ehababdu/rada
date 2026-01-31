import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import Progress from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index as attachmentTypesIndex } from '@/routes/attachment-types';
import { type BreadcrumbItem, type Martyr } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Settings, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Record<string, string>;
    placeholder: string;
    error?: string;
    required?: boolean;
}

// Replaced inline SearchableSelect with `Combobox` component (see components/ui/combobox.tsx)

interface Props {
    martyr: Martyr;
    attachmentTypes: Record<string, string>;
}

export default function Create({ martyr, attachmentTypes }: Props) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        attachment_type: '',
        file: null as File | null,
        description: '',
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [remoteOptions, setRemoteOptions] =
        useState<Record<string, string>>(attachmentTypes);
    const queryDebounceRef = useRef<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
            title: t('add_attachment'),
            href: `/martyrs/${martyr.id}/attachments/create`,
        },
    ];

    // Initialize with attachment types from props (from AttachmentTypeController)
    useEffect(() => {
        setRemoteOptions(attachmentTypes);
    }, [attachmentTypes]);

    // Set attachment type from query parameter if present
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        if (type && remoteOptions[type]) {
            setData('attachment_type', type);
        }
    }, [remoteOptions, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/martyrs/${martyr.id}/attachments`, {
            onProgress: (progressEvent?: any) => {
                const total =
                    typeof progressEvent?.total === 'number'
                        ? progressEvent.total
                        : progressEvent?.lengthComputable
                          ? progressEvent.total
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
                reset();
                setUploadProgress(null);
            },
            onError: () => {
                setUploadProgress(null);
            },
        });
    };

    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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
                // If no search query, use all attachment types from props
                setRemoteOptions(attachmentTypes);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch from API only when searching
                const res = await fetch(
                    `/api/attachment-types?search=${encodeURIComponent(q)}`,
                );
                if (!res.ok) {
                    console.error('API error:', res.status);
                    // Fallback to filtered props
                    const filtered = Object.fromEntries(
                        Object.entries(attachmentTypes).filter(([_, label]) =>
                            label.toLowerCase().includes(q.toLowerCase()),
                        ),
                    );
                    setRemoteOptions(filtered);
                    setIsLoading(false);
                    return;
                }
                const json = await res.json();
                setRemoteOptions(json);
            } catch (err) {
                console.error('Fetch error:', err);
                // Fallback to filtered props
                const filtered = Object.fromEntries(
                    Object.entries(attachmentTypes).filter(([_, label]) =>
                        label.toLowerCase().includes(q.toLowerCase()),
                    ),
                );
                setRemoteOptions(filtered);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('add_attachment')} - ${martyr.full_name}`} />

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
                            {t('add_attachment')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {martyr.full_name} - {martyr.national_id}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Attachment Type */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-muted-foreground">
                                    {t('attachment_type')}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Link
                                    href={
                                        attachmentTypesIndex.definition?.url ??
                                        attachmentTypesIndex()
                                    }
                                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                                >
                                    <Settings size={14} />
                                    {t('manage_attachment_types') ||
                                        'إدارة أنواع المرفقات'}
                                </Link>
                            </div>
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

                        {/* File Upload */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                {t('file')}{' '}
                                <span className="text-red-500">*</span>
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
                                                    // eslint-disable-next-line @next/next/no-img-element
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
                                                        )}
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
                                <Upload size={16} />
                                {processing
                                    ? t('martyrs.loading')
                                    : t('upload_attachment')}
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
