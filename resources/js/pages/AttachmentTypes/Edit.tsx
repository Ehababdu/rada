import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    edit as attachmentTypesEdit,
    index as attachmentTypesIndex,
} from '@/routes/attachment-types';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

interface AttachmentType {
    id: number;
    label: string;
}

interface Props {
    attachmentType: AttachmentType;
    flash: {
        success?: string;
        error?: string;
        message?: string;
    };
}

export default function Edit({ attachmentType, flash }: Props) {
    const { toast } = useToast();

    useEffect(() => {
        if (flash?.success) {
            toast({ title: flash.success, variant: 'success' });
        }
        if (flash?.error) {
            toast({ title: flash.error, variant: 'destructive' });
        }
        if (flash?.message) {
            toast({ title: flash.message, variant: 'success' });
        }
    }, [flash, toast]);

    const { data, setData, put, processing, errors } = useForm({
        label: attachmentType.label,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/attachment-types/${attachmentType.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'أنواع المرفقات',
            href: attachmentTypesIndex.url(),
        },
        {
            title: 'تعديل نوع المرفق',
            href: attachmentTypesEdit.url(attachmentType.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تعديل نوع المرفق" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={attachmentTypesIndex()}>
                            <ArrowLeft className="h-4 w-4" />
                            العودة
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">
                            تعديل نوع المرفق
                        </h1>
                        <p className="text-muted-foreground">
                            تعديل معلومات نوع المرفق
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>معلومات نوع المرفق</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="label">الاسم</Label>
                                <Input
                                    id="label"
                                    type="text"
                                    value={data.label}
                                    onChange={(e) =>
                                        setData('label', e.target.value)
                                    }
                                    placeholder="مثال: شهادة الميلاد"
                                    required
                                />
                                {errors.label && (
                                    <p className="text-sm text-destructive">
                                        {errors.label}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    الاسم الذي سيظهر للمستخدمين
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    تحديث نوع المرفق
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
