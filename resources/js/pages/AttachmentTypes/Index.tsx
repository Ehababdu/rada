import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { index as attachmentTypesIndex, create as attachmentTypesCreate, show as attachmentTypesShow, edit as attachmentTypesEdit, destroy as attachmentTypesDestroy } from '@/routes/attachment-types';
import { Plus, Search, Eye, SquarePen, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';

interface AttachmentType {
    id: number;
    label: string;
    created_at: string;
}

interface Props {
    attachmentTypes: {
        data: AttachmentType[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function Index({ attachmentTypes }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const { can } = usePermissions('attachment-types');
    const canCreate = can('canCreate');
    const canDelete = can('canDelete');
    const canRead = can('canRead');
    const canUpdate = can('canUpdate');

    React.useEffect(() => {
        if (!canRead) {
            router.visit('/dashboard');
        }
    }, [canRead]);

    if (!canRead) return null; // Prevent rendering while redirecting

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'أنواع المرفقات',
            href: attachmentTypesIndex.url(),
        },
    ];

    const handleDelete = (attachmentType: AttachmentType) => {
        router.delete(attachmentTypesDestroy(attachmentType.id), {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="أنواع المرفقات" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">أنواع المرفقات</h1>
                        <p className="text-muted-foreground">
                            إدارة أنواع المرفقات المتاحة في النظام
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href={attachmentTypesCreate()}>
                                <Plus className="h-4 w-4" />
                                إضافة نوع مرفق جديد
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>أنواع المرفقات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="البحث في أنواع المرفقات..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead>تاريخ الإنشاء</TableHead>
                                    <TableHead className="w-[100px]">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attachmentTypes.data
                                    .filter((type) =>
                                        type.label.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((attachmentType) => (
                                    <TableRow key={attachmentType.id}>
                                        <TableCell>{attachmentType.label}</TableCell>
                                        <TableCell>
                                            {new Date(attachmentType.created_at).toLocaleDateString('ar')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {canRead && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={attachmentTypesShow(attachmentType.id)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {canUpdate && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={attachmentTypesEdit(attachmentType.id)}>
                                                            <SquarePen className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {canDelete && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    هل أنت متأكد من حذف نوع المرفق "{attachmentType.label}"؟
                                                                    هذا الإجراء لا يمكن التراجع عنه.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(attachmentType)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    حذف
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {attachmentTypes.data.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                لا توجد أنواع مرفقات
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}