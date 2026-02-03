import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Progress from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index as attachmentTypesIndex } from '@/routes/attachment-types';
import { type BreadcrumbItem, type Martyr } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Settings, Upload, File, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface Props {
    martyr: Martyr;
    attachmentTypes: Record<string, string>;
}

export default function Create({ martyr, attachmentTypes }: Props) {
    const { errors } = usePage().props;
    const { toast } = useToast();
    const [attachment_type, setAttachmentType] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [remoteOptions, setRemoteOptions] = useState(attachmentTypes);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryDebounceRef = useRef<number | null>(null);

    useEffect(() => {
        // Set attachment type from query parameter if present
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        if (type && remoteOptions[type]) {
            setAttachmentType(type);
        }
    }, [remoteOptions]);

    useEffect(() => {
        return () => {
            if (queryDebounceRef.current) {
                window.clearTimeout(queryDebounceRef.current);
            }
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAttachmentTypeChange = (value: string) => {
        setAttachmentType(value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

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
                setIsLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                // Fallback to filtered props
                const filtered = Object.fromEntries(
                    Object.entries(attachmentTypes).filter(([_, label]) =>
                        label.toLowerCase().includes(q.toLowerCase()),
                    ),
                );
                setRemoteOptions(filtered);
                setIsLoading(false);
            }
        }, 300); // 300ms debounce
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('attachment_type', attachment_type);
        formData.append('description', description);
        if (file) {
            formData.append('file', file);
        }

        router.post(`/martyrs/${martyr.id}/attachments`, formData, {
            // ensure Inertia sends the payload as multipart/form-data
            forceFormData: true,
            // Inertia progress event provides progress in event.detail.progress (0-100)
            onProgress: (event: any) => {
                const p = event?.detail?.progress ?? null;
                setUploadProgress(p !== null ? Math.round(p) : null);
            },
            onSuccess: (page: any) => {
                toast({ title: 'تم إضافة المرفق بنجاح', variant: 'success' });
                setProcessing(false);
                setUploadProgress(null);
            },
            onError: () => {
                setProcessing(false);
                setUploadProgress(null);
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'الشهداء',
            href: '/martyrs',
        },
        {
            title: martyr.full_name,
            href: `/martyrs/${martyr.id}`,
        },
        {
            title: 'المرفقات',
            href: `/martyrs/${martyr.id}/attachments`,
        },
        {
            title: 'إضافة مرفق',
            href: `/martyrs/${martyr.id}/attachments/create`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`إضافة مرفق - ${martyr.full_name}`} />

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
                            إضافة مرفق
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {martyr.full_name} - {martyr.national_id}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">خطأ في التحقق</h3>
                                    <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-300">
                                        {Object.values(errors).map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Attachment Type */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-muted-foreground">
                                        نوع المرفق{' '}
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
                                        إدارة أنواع المرفقات
                                    </Link>
                                </div>
                                <Combobox
                                    value={attachment_type}
                                    onChange={handleAttachmentTypeChange}
                                    options={remoteOptions}
                                    onQueryChange={handleQuery}
                                    isLoading={isLoading}
                                    placeholder="اختر خيار"
                                />
                                {errors.attachment_type && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.attachment_type}</p>
                                )}
                            </div>

                            {/* File Upload */}
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                    الملف{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="space-y-4">
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    {errors.file && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file}</p>
                                    )}
                                    {file && (
                                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                                            <File size={24} className="text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemoveFile}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                    الوصف
                                </Label>
                                <Textarea
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    rows={4}
                                    className="border-border"
                                    placeholder="وصف اختياري"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
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
                                        ? 'جاري التحميل...'
                                        : 'رفع المرفق'}
                                </Button>
                                <Link href={`/martyrs/${martyr.id}/attachments`}>
                                    <Button type="button" variant="outline">
                                        إلغاء
                                    </Button>
                                </Link>
                            </div>
                            {uploadProgress !== null && (
                                <div className="mt-3">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            جاري الرفع — {uploadProgress}%
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
