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
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    create as employmentStatusesCreate,
    destroy as employmentStatusesDestroy,
    edit as employmentStatusesEdit,
    index as employmentStatusesIndex,
    show as employmentStatusesShow,
} from '@/routes/employment-statuses';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EmploymentStatus {
    id: number;
    name: string;
    created_at: string;
}

interface Props {
    employmentStatuses: {
        data: EmploymentStatus[];
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
    filters: {
        search?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Index({ employmentStatuses, filters, flash }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(
            employmentStatusesIndex.url(),
            { search },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(employmentStatusesDestroy(id).url, {
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
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employment_statuses.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('employment_statuses.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('employment_statuses.description')}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={employmentStatusesCreate.url()}>
                            <Plus className="h-4 w-4" />
                            {t('employment_statuses.create')}
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('employment_statuses.list')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t('search')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSearch()
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Button onClick={handleSearch} variant="outline">
                                {t('search')}
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t('employment_statuses.name')}
                                        </TableHead>
                                        <TableHead>{t('created_at')}</TableHead>
                                        <TableHead className="w-[100px]">
                                            {t('actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employmentStatuses.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-center text-muted-foreground"
                                            >
                                                {t('no_data')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        employmentStatuses.data.map(
                                            (employmentStatus) => (
                                                <TableRow
                                                    key={employmentStatus.id}
                                                >
                                                    <TableCell className="font-medium">
                                                        {employmentStatus.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            employmentStatus.created_at
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        employmentStatusesShow(
                                                                            employmentStatus.id,
                                                                        ).url
                                                                    }
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        employmentStatusesEdit(
                                                                            employmentStatus.id,
                                                                        ).url
                                                                    }
                                                                >
                                                                    <SquarePen className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            {t(
                                                                                'confirm_delete',
                                                                            )}
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            {t(
                                                                                'confirm_delete_description',
                                                                            )}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            {t(
                                                                                'cancel',
                                                                            )}
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    employmentStatus.id,
                                                                                )
                                                                            }
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        >
                                                                            {t(
                                                                                'delete',
                                                                            )}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {employmentStatuses.last_page > 1 && (
                            <div className="mt-4 flex justify-center">
                                <div className="flex gap-1">
                                    {employmentStatuses.links.map(
                                        (link, index) => (
                                            <Button
                                                key={index}
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                asChild={link.url !== null}
                                                disabled={link.url === null}
                                            >
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        preserveScroll
                                                    >
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    </Link>
                                                ) : (
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )}
                                            </Button>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
