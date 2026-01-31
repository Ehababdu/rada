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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    create as rolesCreate,
    destroy as rolesDestroy,
    edit as rolesEdit,
    index as rolesIndex,
    show as rolesShow,
} from '@/routes/roles';
import {
    type BreadcrumbItem,
    type PaginatedResponse,
    type SharedData,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    MoreHorizontal,
    Plus,
    Search,
    SquarePen,
    Trash2,
    Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Role {
    id: number;
    name: string;
    display_name: string | null;
    description: string | null;
    guard_name: string;
    created_at: string;
    permissions_count?: number;
    users_count?: number;
    permissions?: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    paginatedRoles: PaginatedResponse<Role>;
    filters: {
        search: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T;
}

export default function Index({
    paginatedRoles: roles,
    filters = { search: '' },
    flash,
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { auth, flash: pageFlash } = usePage<SharedData>().props;
    const { can } = usePermissions('permissions');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('roles.title', 'الأدوار'),
            href: rolesIndex.url(),
        },
    ];

    // Server-side states
    const [pageIndex, setPageIndex] = useState(
        Number(roles.current_page) - 1 || 0,
    );
    const [pageSize, setPageSize] = useState(roles.per_page);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            router.get(
                rolesIndex.url(),
                { search: query },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 300),
        [],
    );

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle delete
    const handleDelete = (role: Role) => {
        setRoleToDelete(role);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!roleToDelete) return;

        router.delete(rolesDestroy.url(roleToDelete.id), {
            onSuccess: () => {
                toast({
                    title: t('common.success'),
                    description: t(
                        'roles.deleted_successfully',
                        'تم حذف الدور بنجاح',
                    ),
                });
                setDeleteDialogOpen(false);
                setRoleToDelete(null);
            },
            onError: (errors) => {
                toast({
                    title: t('common.error'),
                    description:
                        errors.error ||
                        t('roles.delete_failed', 'فشل في حذف الدور'),
                    variant: 'destructive',
                });
            },
        });
    };

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: t('common.success'),
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast({
                title: t('common.error'),
                description: flash.error,
                variant: 'destructive',
            });
        }
    }, [flash, toast, t]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('roles.title', 'الأدوار')} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {t('roles.title', 'الأدوار')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t(
                                'roles.description',
                                'إدارة الأدوار والصلاحيات في النظام',
                            )}
                        </p>
                    </div>
                    {can('canCreate') && (
                        <Button asChild>
                            <Link href={rolesCreate.url()}>
                                <Plus className="h-4 w-4" />
                                {t('roles.create_role', 'إنشاء دور جديد')}
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('roles.list', 'قائمة الأدوار')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t('common.search', 'البحث...')}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t('roles.name', 'الاسم')}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'roles.display_name',
                                                'الاسم المعروض',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'roles.permissions_count',
                                                'عدد الصلاحيات',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'roles.users_count',
                                                'عدد المستخدمين',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                'common.created_at',
                                                'تاريخ الإنشاء',
                                            )}
                                        </TableHead>
                                        <TableHead className="w-[70px]">
                                            {t('common.actions', 'الإجراءات')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-24 text-center"
                                            >
                                                {t(
                                                    'roles.no_roles',
                                                    'لا توجد أدوار',
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.data.map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="font-medium">
                                                    <Badge variant="outline">
                                                        {role.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {role.display_name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <span>
                                                            {role.permissions_count ||
                                                                0}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        <span>
                                                            {role.users_count ||
                                                                0}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        role.created_at,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {can('canRead') && (
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={rolesShow.url(
                                                                            role.id,
                                                                        )}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        {t(
                                                                            'common.view',
                                                                            'عرض',
                                                                        )}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can(
                                                                'canUpdate',
                                                            ) && (
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={rolesEdit.url(
                                                                            role.id,
                                                                        )}
                                                                    >
                                                                        <SquarePen className="h-4 w-4" />
                                                                        {t(
                                                                            'common.edit',
                                                                            'تعديل',
                                                                        )}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can('canDelete') &&
                                                                role.users_count ===
                                                                    0 && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                role,
                                                                            )
                                                                        }
                                                                        className="text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                        {t(
                                                                            'common.delete',
                                                                            'حذف',
                                                                        )}
                                                                    </DropdownMenuItem>
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

                        {/* Pagination would go here */}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('roles.confirm_delete', 'تأكيد الحذف')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                'roles.delete_confirmation',
                                'هل أنت متأكد من حذف هذا الدور؟ هذا الإجراء لا يمكن التراجع عنه.',
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('common.cancel', 'إلغاء')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('common.delete', 'حذف')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
