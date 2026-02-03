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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as attachmentTypesDestroy,
    edit as attachmentTypesEdit,
    index as attachmentTypesIndex,
} from '@/routes/attachment-types';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, SquarePen, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AttachmentType {
    id: number;
    label: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    attachmentType: AttachmentType;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Show({ attachmentType, flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const handleDelete = () => {
        router.delete(attachmentTypesDestroy.url(attachmentType.id), {
            onSuccess: () => {
                toast({
                    title: 'تم الحذف',
                    description: 'تم حذف نوع المرفق بنجاح',
                });
            },
            onError: () => {
                toast({
                    title: 'خطأ',
                    description: 'حدث خطأ أثناء حذف نوع المرفق',
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
            title: attachmentType.label,
            href: `/attachment-types/${attachmentType.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={attachmentType.label} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={attachmentTypesIndex()}>
                                <ArrowLeft className="h-4 w-4" />
                                العودة
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold">
                                {attachmentType.label}
                            </h1>
                            <p className="text-muted-foreground">
                                عرض تفاصيل نوع المرفق
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={attachmentTypesEdit(attachmentType.id)}>
                                <SquarePen className="h-4 w-4" />
                                تعديل
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                    حذف
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        تأكيد الحذف
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        هل أنت متأكد من حذف نوع المرفق "
                                        {attachmentType.label}"؟ هذا الإجراء لا
                                        يمكن التراجع عنه.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        حذف
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>معلومات نوع المرفق</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                الاسم
                            </Label>
                            <p>{attachmentType.label}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    تاريخ الإنشاء
                                </Label>
                                <p>
                                    {new Date(
                                        attachmentType.created_at,
                                    ).toLocaleDateString('ar')}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    تاريخ آخر تحديث
                                </Label>
                                <p>
                                    {new Date(
                                        attachmentType.updated_at,
                                    ).toLocaleDateString('ar')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
