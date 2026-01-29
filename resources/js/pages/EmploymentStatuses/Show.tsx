import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { index as employmentStatusesIndex, show as employmentStatusesShow, edit as employmentStatusesEdit, destroy as employmentStatusesDestroy } from '@/routes/employment-statuses';
import { ArrowLeft, SquarePen, Trash2 } from 'lucide-react';

interface EmploymentStatus {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    employmentStatus: EmploymentStatus;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Show({ employmentStatus, flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const handleDelete = () => {
        router.delete(employmentStatusesDestroy(employmentStatus.id).url, {
            onSuccess: () => {
                toast(t('success'), {
                    variant: 'default',
                });
            },
            onError: () => {
                toast(t('error'), {
                    variant: 'destructive',
                });
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('employment_statuses.title'),
            href: employmentStatusesIndex.url(),
        },
        {
            title: employmentStatus.name,
            href: employmentStatusesShow(employmentStatus.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employmentStatus.name} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={employmentStatusesIndex.url()}>
                                <ArrowLeft className="h-4 w-4" />
                                {t('back')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{employmentStatus.name}</h1>
                            <p className="text-muted-foreground">
                                {t('employment_statuses.show_description')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={employmentStatusesEdit(employmentStatus.id).url}>
                                <SquarePen className="h-4 w-4" />
                                {t('edit')}
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                    {t('delete')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('confirm_delete')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('confirm_delete_description')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {t('delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('employment_statuses.details')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('employment_statuses.name')}
                                    </label>
                                    <p className="text-sm">{employmentStatus.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('created_at')}
                                    </label>
                                    <p className="text-sm">{employmentStatus.created_at}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {t('updated_at')}
                                    </label>
                                    <p className="text-sm">{employmentStatus.updated_at}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}