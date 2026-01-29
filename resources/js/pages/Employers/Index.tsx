import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/use-permissions';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icons
import {
    Search,
    Settings2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Building2,
    MapPin,
    ArrowUpDown,
    MoreHorizontal,
    Edit,
    Trash2,
    RotateCcw,
    Plus,
    CheckCircle2,
    XCircle,
    AlertTriangle,
} from 'lucide-react';

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    ColumnDef,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface Employer {
    id: number;
    name_ar: string;
    name_en: string;
    location: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    is_active: boolean;
}

interface Props {
    employers: {
        data: Employer[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        is_active: string;
    };
}

export default function Index({ employers, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { can } = usePermissions('employers');

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Alert Dialog State
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('employers.title'), href: '/employers' }];

    // Search Logic (Fixed TS Type)
    const performSearch = useCallback((params: Record<string, any>) => {
        router.get('/employers', params as any, { 
            preserveState: true, 
            replace: true,
            preserveScroll: true 
        });
    }, []);

    const handleSearchInput = (value: string) => {
        setSearchTerm(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            performSearch({ ...filters, search: value });
        }, 400);
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/employers/${deleteId}`, {
                onSuccess: () => {
                    toast({ title: t('bank_deleted_successfully') });
                    setDeleteId(null);
                },
                onFinish: () => setDeleteId(null)
            });
        }
    };

    const columnHelper = createColumnHelper<Employer>();

    const columns = useMemo<ColumnDef<Employer, any>[]>(() => [
        columnHelper.accessor('id', {
            header: "#",
            cell: (info) => <span className="font-mono text-muted-foreground">{info.getValue()}</span>,
        }),
        columnHelper.accessor(isRTL ? 'name_ar' : 'name_en', {
            header: t('employers.name'),
            cell: (info) => {
                const employer = info.row.original;
                const name = info.getValue();
                
                return (
                    <div className="flex flex-col">
                        <span className="font-bold">{name}</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('location', {
            header: t('employers.location'),
            cell: (info) => {
                const employer = info.row.original;
                const location = info.getValue();
                if (!location) return <span className="text-muted-foreground">-</span>;
                
                return (
                    <Link 
                        href={`/employers/${employer.id}/locations`} 
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        <MapPin className="h-4 w-4" />
                        <span>{isRTL ? location.name_ar : location.name_en}</span>
                    </Link>
                );
            },
        }),
        columnHelper.accessor('is_active', {
            header: t('status'),
            cell: (info) => (
                <Badge variant={info.getValue() ? "default" : "secondary"} className="gap-1">
                    {info.getValue() ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {info.getValue() ? t('employers.active') : t('employers.inactive')}
                </Badge>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: t('actions'),
            cell: (info) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-44">
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/employers/${info.row.original.id}`} className="cursor-pointer">
                                <Eye className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} /> {t('view')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/employers/${info.row.original.id}/edit`} className="cursor-pointer">
                                <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} /> {t('edit')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-destructive focus:bg-destructive/10 cursor-pointer" 
                            onClick={() => setDeleteId(info.row.original.id)}
                        >
                            <Trash2 className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} /> {t('delete')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }),
    ], [t, isRTL, columnHelper]);

    const table = useReactTable({
        data: employers.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: { sorting, columnVisibility },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employers.title')} />

            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('employers.title')}</h1>
                        <p className="text-muted-foreground mt-1">{t('employers.manage_employers')}</p>
                    </div>
                    {can('canCreate') && (
                        <Button asChild className="shadow-sm">
                            <Link href="/employers/create">
                                <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                {t('employers.add_employer')}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filter Card */}
                <Card className="border-none shadow-none bg-muted/40">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4", isRTL ? "right-3" : "left-3")} />
                            <Input
                                placeholder={t('employers.search_employers')}
                                value={searchTerm}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                className={cn("bg-background", isRTL ? "pr-10" : "pl-10")}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <Select 
                                value={filters.is_active || "all"} 
                                onValueChange={(val) => performSearch({ ...filters, is_active: val === "all" ? "" : val })}
                            >
                                <SelectTrigger className="w-full md:w-[180px] bg-background">
                                    <SelectValue placeholder={t('banks.all_status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('banks.all_status')}</SelectItem>
                                    <SelectItem value="1">{t('banks.active')}</SelectItem>
                                    <SelectItem value="0">{t('banks.inactive')}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="icon" onClick={() => router.get('/employers')} className="shrink-0 bg-background">
                                <RotateCcw className="h-4 w-4" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-background">
                                        <Settings2 className="h-4 w-4" />
                                        <span className="hidden sm:inline">{t('show_columns')}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table.getAllColumns().filter(c => c.getCanHide()).map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(v) => column.toggleVisibility(!!v)}
                                        >
                                            {t(`banks.${column.id}`) || column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table or Empty Alert */}
                {employers.data.length > 0 ? (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className={cn(isRTL ? "text-right" : "text-left")}>
                                                <div 
                                                    className={cn("flex items-center gap-2", header.column.getCanSort() && "cursor-pointer select-none")}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-muted/20 transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 py-8 flex flex-col items-center text-center gap-2">
                        <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
                        <AlertTitle className="text-lg font-bold">{t('no_results')}</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            {t('employers.no_employers')}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Pagination Section */}
                {employers.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                        <p className="text-sm text-muted-foreground italic">
                            {t('showing')} <span className="font-medium text-foreground">{employers.from}</span> {t('to')} <span className="font-medium text-foreground">{employers.to}</span> {t('of')} <span className="font-medium text-foreground">{employers.total}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => performSearch({ ...filters, page: employers.current_page - 1 })}
                                disabled={employers.current_page === 1}
                            >
                                <ChevronLeft className={cn("h-4 w-4", isRTL ? "ml-1" : "mr-1")} />
                                {t('previous')}
                            </Button>
                            <span className="text-sm font-medium px-4">
                                {employers.current_page} / {employers.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => performSearch({ ...filters, page: employers.current_page + 1 })}
                                disabled={employers.current_page === employers.last_page}
                            >
                                {t('next')}
                                <ChevronRight className={cn("h-4 w-4", isRTL ? "mr-1" : "ml-1")} />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                {t('confirm_delete_employer')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className={cn(isRTL ? "text-right" : "text-left")}>
                                {t('are_you_sure_delete')}
                                <br />
                                <span className="text-xs font-semibold text-muted-foreground mt-2 inline-block">
                                    {t('employers.delete_warning')}
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDelete}
                                className="bg-destructive hover:bg-destructive/90 text-white"
                            >
                                {t('delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </AppLayout>
    );
}