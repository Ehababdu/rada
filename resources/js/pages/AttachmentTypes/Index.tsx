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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    create as attachmentTypesCreate,
    destroy as attachmentTypesDestroy,
    edit as attachmentTypesEdit,
    index as attachmentTypesIndex,
    show as attachmentTypesShow,
} from '@/routes/attachment-types';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FileType,
    FilterX,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
        from: number;
        to: number;
    };
}

export default function Index({ attachmentTypes }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { can } = usePermissions('attachment-types');

    React.useEffect(() => {
        if (!can('canRead')) {
            router.visit('/dashboard');
        }
    }, [can]);

    if (!can('canRead')) return null;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attachment_types.title'),
            href: attachmentTypesIndex.url(),
        },
    ];

    const handleDelete = () => {
        if (deleteId) {
            router.delete(attachmentTypesDestroy(deleteId), {
                onSuccess: () => {
                    toast({
                        title: t('success'),
                        description: t('attachment_types.deleted'),
                    });
                    setDeleteId(null);
                },
                onError: () => {
                    toast({
                        title: t('error'),
                        description: t('attachment_types.delete_error'),
                        variant: 'destructive',
                    });
                    setDeleteId(null);
                },
            });
        }
    };

    const filteredData = attachmentTypes.data.filter((type) =>
        type.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('attachment_types.title')} />

                <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Header Section - Unified Design */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <FileType className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('attachment_types.title')}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('attachment_types.description')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {can('canCreate') && (
                                <Button
                                    asChild
                                    className="transition-all hover:scale-105"
                                >
                                    <Link href={attachmentTypesCreate()}>
                                        <Plus
                                            className={cn(
                                                'h-4 w-4',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        {t('attachment_types.create')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex min-w-[300px] flex-1 items-center gap-2">
                            {/* Search */}
                            <div className="relative w-full max-w-sm">
                                <Search
                                    className={cn(
                                        'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                        isRTL ? 'right-3' : 'left-3',
                                    )}
                                />
                                <Input
                                    placeholder={t('attachment_types.search')}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className={cn(
                                        'transition-all focus:ring-2 focus:ring-primary/20',
                                        isRTL ? 'pr-10' : 'pl-10',
                                    )}
                                />
                            </div>

                            {/* Clear Filters */}
                            {searchTerm && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSearchTerm('')}
                                            className="text-muted-foreground"
                                        >
                                            <FilterX className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('reset')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        #
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        {t('attachment_types.name')}
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            'py-4',
                                            isRTL ? 'text-right' : 'text-left',
                                        )}
                                    >
                                        {t('created_at')}
                                    </TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <FileType className="h-12 w-12 opacity-10" />
                                                <p className="text-lg font-medium">
                                                    {t('no_results')}
                                                </p>
                                                <p className="text-sm">
                                                    {t(
                                                        'attachment_types.no_types',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((attachmentType) => (
                                        <TableRow
                                            key={attachmentType.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell>
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {attachmentType.id}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {attachmentType.label}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(
                                                    attachmentType.created_at,
                                                ).toLocaleDateString(
                                                    isRTL ? 'ar-EG' : 'en-US',
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align={
                                                            isRTL
                                                                ? 'start'
                                                                : 'end'
                                                        }
                                                        className="w-44"
                                                    >
                                                        <DropdownMenuLabel>
                                                            {t('actions')}
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {can('canRead') && (
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={attachmentTypesShow(
                                                                        attachmentType.id,
                                                                    )}
                                                                    className="flex cursor-pointer items-center"
                                                                >
                                                                    <Eye
                                                                        className={cn(
                                                                            'h-4 w-4 text-muted-foreground',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t('view')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can('canUpdate') && (
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={attachmentTypesEdit(
                                                                        attachmentType.id,
                                                                    )}
                                                                    className="flex cursor-pointer items-center"
                                                                >
                                                                    <Edit
                                                                        className={cn(
                                                                            'h-4 w-4 text-muted-foreground',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t('edit')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {can('canDelete') && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        setDeleteId(
                                                                            attachmentType.id,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2
                                                                        className={cn(
                                                                            'h-4 w-4',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t(
                                                                        'delete',
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {attachmentTypes.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing')}{' '}
                                <span className="font-bold text-foreground">
                                    {attachmentTypes.from}
                                </span>{' '}
                                {t('to')}{' '}
                                <span className="font-bold text-foreground">
                                    {attachmentTypes.to}
                                </span>{' '}
                                {t('of')}{' '}
                                <span className="font-bold text-foreground">
                                    {attachmentTypes.total}
                                </span>{' '}
                                {t('records')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get(attachmentTypesIndex.url(), {
                                            page:
                                                attachmentTypes.current_page -
                                                1,
                                        })
                                    }
                                    disabled={
                                        attachmentTypes.current_page === 1
                                    }
                                >
                                    {isRTL ? (
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    ) : (
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                    )}
                                    {t('previous')}
                                </Button>

                                <div className="mx-2 flex items-center gap-1">
                                    <Badge
                                        variant="outline"
                                        className="h-8 min-w-[32px] justify-center"
                                    >
                                        {attachmentTypes.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        /
                                    </span>
                                    <span className="text-sm font-medium">
                                        {attachmentTypes.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get(attachmentTypesIndex.url(), {
                                            page:
                                                attachmentTypes.current_page +
                                                1,
                                        })
                                    }
                                    disabled={
                                        attachmentTypes.current_page ===
                                        attachmentTypes.last_page
                                    }
                                >
                                    {t('next')}
                                    {isRTL ? (
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog
                        open={!!deleteId}
                        onOpenChange={() => setDeleteId(null)}
                    >
                        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    {t('confirm_delete')}
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                    className={cn(
                                        isRTL ? 'text-right' : 'text-left',
                                    )}
                                >
                                    {t('attachment_types.confirm_delete')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                                <AlertDialogCancel>
                                    {t('cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {t('delete')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}
