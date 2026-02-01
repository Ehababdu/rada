import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import Progress from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index as attachmentTypesIndex } from '@/routes/attachment-types';
import { type BreadcrumbItem, type Martyr } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Settings, Upload } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import '../../../css/filepond-custom.css';

// Register FilePond plugins as recommended in the official documentation
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

interface Props {
    martyr: Martyr;
    attachmentTypes: Record<string, string>;
}

export default function Create({ martyr, attachmentTypes }: Props) {
    const [attachment_type, setAttachmentType] = useState('');
    const [files, setFiles] = useState<any[]>([]);
    const [description, setDescription] = useState('');
    const [remoteOptions, setRemoteOptions] = useState(attachmentTypes);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const pondRef = useRef<FilePond | null>(null);
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

    const handleInit = () => {
        console.log("FilePond instance has initialised", pondRef.current);
    };

    const handleFileUpdate = (fileItems: any[]) => {
        setFiles(fileItems);
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

        router.post(`/martyrs/${martyr.id}/attachments`, {
            attachment_type,
            file: files.length > 0 ? files[0].file : null,
            description,
        }, {
            onProgress: (progress: any) => {
                setUploadProgress(progress.percentage);
            },
            onSuccess: () => {
                setAttachmentType('');
                setFiles([]);
                setDescription('');
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
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                    الملف{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <FilePond
                                    ref={pondRef}
                                    files={files}
                                    onupdatefiles={handleFileUpdate}
                                    oninit={handleInit}
                                    allowMultiple={false}
                                    allowReorder={true}
                                    maxFiles={1}
                                    server={null}
                                    name="file"
                                    acceptedFileTypes={[
                                        'application/pdf',
                                        'application/msword',
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                        'image/jpeg',
                                        'image/png',
                                        'image/jpg'
                                    ]}
                                    maxFileSize="10MB"
                                    labelIdle='اسحب الملف هنا أو <span class="filepond--label-action">تصفح</span>'
                                    labelFileProcessing="جاري المعالجة"
                                    labelFileProcessingComplete="تم الانتهاء"
                                    labelFileProcessingAborted="تم الإلغاء"
                                    labelFileProcessingError="خطأ في المعالجة"
                                    labelTapToCancel="اضغط للإلغاء"
                                    labelTapToRetry="اضغط لإعادة المحاولة"
                                    labelTapToUndo="اضغط للتراجع"
                                    instantUpload={false}
                                    stylePanelLayout="compact"
                                    styleLoadIndicatorPosition="center bottom"
                                    styleProgressIndicatorPosition="right bottom"
                                    styleButtonRemoveItemPosition="left bottom"
                                    styleButtonProcessItemPosition="right bottom"
                                />
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
