import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index as permissionsIndex, create as permissionsCreate, show as permissionsShow, edit as permissionsEdit, destroy as permissionsDestroy } from '@/routes/permissions';
import { Plus, Search, Eye, SquarePen, Trash2, RotateCcw, MoreHorizontal, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
}

interface Props {
    paginatedPermissions: PaginatedResponse<Permission>;
    filters: {
        search: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

// دالة الـ Debounce المحلية لمنع تضارب الاستيرادات
function customDebounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default function Index({
    paginatedPermissions: permissions,
    filters = { search: '' },
    flash
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { can } = usePermissions('permissions');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('permissions.title'), href: permissionsIndex.url() },
    ];

    // States
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");

    // Debounced Search logic
    const debouncedSearch = useCallback(
        customDebounce((query: string) => {
            router.get(permissionsIndex.url(), 
                { search: query }, 
                { preserveState: true, replace: true }
            );
        }, 300),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const resetSearch = () => {
        setSearchQuery('');
        router.get(permissionsIndex.url(), {}, { preserveState: true });
    };

    const handleDelete = (permission: Permission) => {
        router.delete(permissionsDestroy(permission.id).url, {
            onSuccess: () => {
                toast({ title: t('success'), variant: 'default' });
                setDeleteDialogOpen(false);
                setPermissionToDelete(null);
            },
            onError: () => toast({ title: t('error'), variant: 'destructive' }),
        });
    };

    useEffect(() => {
        if (flash?.success) toast({ title: flash.success });
        if (flash?.error) toast({ title: flash.error, variant: 'destructive' });
    }, [flash, toast]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('permissions.title')} />

            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Shield className="h-6 w-6 text-primary" />
                            {t('permissions.title')}
                        </h1>
                        <p className="text-muted-foreground">{t('permissions.description')}</p>
                    </div>
                    {can('canCreate') && (
                        <Button asChild className="gap-2 shadow-sm">
                            <Link href={permissionsCreate.url()}>
                                <Plus className="h-4 w-4" />
                                {t('permissions.create')}
                            </Link>
                        </Button>
                    )}
                </div>

                <Card className="border-none shadow-sm border">
                    <CardHeader className="pb-4 border-b mb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-semibold">{t('permissions.list')}</CardTitle>
                            
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-72">
                                    <Search className={cn(
                                        "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                                        isRTL ? "right-3" : "left-3"
                                    )} />
                                    <Input
                                        placeholder={t('common.search')}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className={cn("bg-muted/50", isRTL ? "pr-9" : "pl-9")}
                                    />
                                </div>
                                {searchQuery && (
                                    <Button variant="ghost" onClick={resetSearch} size="icon">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="rounded-lg border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className={isRTL ? "text-right" : "text-left"}>{t('permissions.name')}</TableHead>
                                        <TableHead className={isRTL ? "text-right" : "text-left"}>{t('permissions.guard_name')}</TableHead>
                                        <TableHead className={isRTL ? "text-right" : "text-left"}>{t('common.created_at')}</TableHead>
                                        <TableHead className="w-[80px] text-center">{t('common.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                {t('common.no_data')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        permissions.data.map((permission) => (
                                            <TableRow key={permission.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium font-mono text-sm">{permission.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-normal uppercase text-[10px]">
                                                        {permission.guard_name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(permission.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-40">
                                                            {can('canViewDetails') && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={permissionsShow(permission.id).url} className="flex items-center">
                                                                        <Eye className="mr-2 h-4 w-4" /> {t('common.view')}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can('canUpdate') && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={permissionsEdit(permission.id).url} className="flex items-center">
                                                                        <SquarePen className="mr-2 h-4 w-4" /> {t('common.edit')}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can('canDelete') && (
                                                                <>
                                                                    <div className="h-px bg-muted my-1" />
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setPermissionToDelete(permission);
                                                                            setDeleteDialogOpen(true);
                                                                        }}
                                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
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

                        {/* Professional Pagination Section */}
                        {permissions.last_page > 1 && (
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                                <p className="text-xs text-muted-foreground">
                                    {t('common.showing')} <span className="font-bold text-foreground">{permissions.from}</span> {t('common.to')} <span className="font-bold text-foreground">{permissions.to}</span> {t('common.of')} <span className="font-bold text-foreground">{permissions.total}</span>
                                </p>
                                <div className="flex items-center gap-1">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={permissions.current_page === 1}
                                        onClick={() => router.get(permissionsIndex.url(), { 
                                            search: searchQuery, 
                                            page: permissions.current_page - 1 
                                        }, { preserveState: true })}
                                    >
                                        {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                    </Button>
                                    <div className="px-4 py-1.5 rounded-md bg-primary/5 border text-xs font-medium">
                                        {t('common.page')} {permissions.current_page} / {permissions.last_page}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={permissions.current_page === permissions.last_page}
                                        onClick={() => router.get(permissionsIndex.url(), { 
                                            search: searchQuery, 
                                            page: permissions.current_page + 1 
                                        }, { preserveState: true })}
                                    >
                                        {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('common.confirm_delete')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('permissions.confirm_delete', { name: permissionToDelete?.name })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className={cn("gap-2", isRTL && "sm:flex-row-reverse")}>
                            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => permissionToDelete && handleDelete(permissionToDelete)}
                                className="bg-red-600 hover:bg-red-700 text-white border-none"
                            >
                                {t('common.delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}