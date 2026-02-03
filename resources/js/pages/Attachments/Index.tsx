import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Paperclip, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StatsOverview } from './components/stats-overview';
import { getColumns } from './components/table-columns';
import { Attachment, AttachmentStats } from './types';

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
    attachmentStats: AttachmentStats;
    filters: {
        search?: string;
        type?: string;
        per_page?: number;
    };
}

export default function Index({
    martyr,
    attachments,
    attachmentTypes,
    attachmentStats,
    filters,
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { can } = usePermissions('attachments');
    const canCreate = can('canCreate');
    const canDelete = can('canDelete');
    const canRead = can('canRead');
    const canUpdate = can('canUpdate');

    React.useEffect(() => {
        if (!canRead) {
            router.visit(dashboard.definition?.url ?? '/dashboard');
            return;
        }
    }, [canRead]);

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = (id: number) => {
        setDeletingId(id);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (deletingId) {
            setIsLoading(true);
            router.delete(`/martyrs/${martyr.id}/attachments/${deletingId}`, {
                onSuccess: () => {
                    toast({ title: t('attachment_deleted_successfully') });
                    setDeleteOpen(false);
                    setDeletingId(null);
                    setIsLoading(false);
                    router.reload({ only: ['attachments', 'attachmentStats'] });
                },
                onError: () => {
                    setIsLoading(false);
                },
            });
        }
    };

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

    const columns = useMemo(
        () =>
            getColumns({
                t,
                martyrId: martyr.id,
                canUpdate,
                canDelete,
                onDelete: handleDelete,
            }),
        [t, martyr.id, canUpdate, canDelete],
    );

    // إذا لم يكن لدى المستخدم صلاحية القراءة، لا نعرض شيئاً
    if (!canRead) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-muted-foreground">
                        {t('common.access_denied') || 'غير مسموح بالوصول'}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        {t('common.no_permission') ||
                            'ليس لديك صلاحية لعرض هذه الصفحة'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${t('attachments.attachments')} - ${martyr.full_name}`}
            />

            <div
                className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                            <Paperclip className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('attachments.attachments')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('attachments.attachments_for')}{' '}
                                <span className="font-semibold text-foreground">
                                    {martyr.full_name}
                                </span>
                            </p>
                        </div>
                    </div>
                    {canCreate && (
                        <Button asChild className="shrink-0 shadow-sm">
                            <Link
                                href={`/martyrs/${martyr.id}/attachments/create`}
                            >
                                <Plus
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'ml-2' : 'mr-2',
                                    )}
                                />
                                {t('attachments.add_attachment') ||
                                    'إضافة مرفق'}
                            </Link>
                        </Button>
                    )}
                </div>

                <StatsOverview
                    stats={attachmentStats}
                    t={t}
                    attachmentTypes={attachmentTypes}
                    martyrId={martyr.id}
                    canCreate={canCreate}
                />

                {/* Data Table Section */}
                <Card className="overflow-hidden border-none shadow-sm">
                    <CardContent className="p-0">
                        <DataTable
                            columns={columns}
                            data={attachments.data}
                            searchKey="type"
                            searchPlaceholder={
                                t('attachments.search_by_type') ||
                                'البحث حسب النوع...'
                            }
                            enablePagination={true}
                            pageSize={attachments.per_page}
                            totalItems={attachments.total}
                            currentPage={attachments.current_page}
                            totalPages={attachments.last_page}
                            onPageChange={(page: number) => {
                                const params = new URLSearchParams(
                                    window.location.search,
                                );
                                params.set('page', page.toString());
                                router.visit(
                                    `/martyrs/${martyr.id}/attachments?${params.toString()}`,
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            onPageSizeChange={(pageSize: number) => {
                                const params = new URLSearchParams(
                                    window.location.search,
                                );
                                params.set('per_page', pageSize.toString());
                                params.delete('page');
                                router.visit(
                                    `/martyrs/${martyr.id}/attachments?${params.toString()}`,
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            pageSizeOptions={[
                                { value: 10, label: '10' },
                                { value: 25, label: '25' },
                                { value: 50, label: '50' },
                                { value: 100, label: '100' },
                                {
                                    value: 1000,
                                    label: t('pagination.all') || 'الكل',
                                },
                            ]}
                        />
                    </CardContent>
                </Card>

                {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            <span className="text-sm text-muted-foreground">
                                {t('common.loading') || 'جاري التحميل...'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('attachments.delete_attachment') || 'حذف المرفق'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('attachments.delete_confirmation') ||
                                'هل أنت متأكد من حذف هذا المرفق؟ لا يمكن التراجع عن هذا الإجراء.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter
                        className={cn('gap-2', isRTL && 'sm:flex-row-reverse')}
                    >
                        <AlertDialogCancel>
                            {t('common.cancel') || 'إلغاء'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('attachments.delete') || 'حذف'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
