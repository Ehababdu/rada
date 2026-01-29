import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { index as attachmentTypesIndex, create as attachmentTypesCreate, store as attachmentTypesStore } from '@/routes/attachment-types';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

interface Props {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Create({ flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        label: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(attachmentTypesStore.url(), {
            onSuccess: () => {
                toast({
                    title: 'تم الإنشاء',
                    description: 'تم إضافة نوع المرفق بنجاح',
                });
            },
            onError: () => {
                toast({
                    title: 'خطأ',
                    description: 'حدث خطأ أثناء إضافة نوع المرفق',
                    variant: 'destructive',
                });
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'أنواع المرفقات',
            href: attachmentTypesIndex.url(),
        },
        {
            title: 'إضافة نوع مرفق جديد',
            href: attachmentTypesCreate.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة نوع مرفق جديد" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={attachmentTypesIndex.url()}>
                            <ArrowLeft className="h-4 w-4" />
                            العودة
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">إضافة نوع مرفق جديد</h1>
                        <p className="text-muted-foreground">
                            أضف نوع مرفق جديد للنظام
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
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="مثال: شهادة الميلاد"
                                    required
                                />
                                {errors.label && (
                                    <p className="text-sm text-destructive">{errors.label}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    الاسم الذي سيظهر للمستخدمين
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    إضافة نوع المرفق
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => reset()}
                                    disabled={processing}
                                >
                                    إعادة تعيين
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}