import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    AlertDialog,
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';

// Icons
import { 
    Filter, Search, Plus, Eye, Edit, Download, ArrowUpDown, MoreHorizontal, 
    Columns, Trash2, FileText, User, UserX, UserCheck, AlertCircle, FileStack
} from 'lucide-react';

interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    address: string;
    children_count: number | null;
    military_number: string | null;
    bank_account_number?: string | null;
    agent_name: string | null;
    agent_phone: string | null;
    agent_relationship?: string | null;
    profile_image?: string | null;
    agent_passport_number?: string | null;
    national_id_file?: string | null;
    art_image?: string | null;
    death_date: string | null;
    has_martyr_decision: boolean;
    decision_number: string | null;
    decision_date?: string | null;

    // Relations
    military_rank?: { id: number; name_ar: string; name_en: string } | null;
    job_grade?: { id: number; name_ar: string; name_en?: string } | string | null;
    bank?: { id: number; name_ar: string } | null;
    branch?: { id: number; name_ar: string } | null;
    employment_status?: { id: number; name?: string; name_ar?: string; name_en?: string } | null;
    parents_status?: { id: number; name_ar: string; name_en: string } | null;
    marital_status?: { id: number; name_ar: string; name_en: string } | null;
    employer?: { id: number; name_ar: string; name_en?: string } | null;
    employer_location?: { id: number; name_ar: string; name_en?: string } | null;
    previous_employer?: { id: number; name_ar: string; name_en?: string } | null;
    previous_employer_location?: { id: number; name_ar: string; name_en?: string } | null;

    wife_status?: string | null;
    wife_remarried?: boolean;

    military_rank_id?: number | null;
    bank_id?: number | null;
    branch_id?: number | null;
    employment_status_id?: number | null;
    parents_status_id?: number | null;
    marital_status_id?: number | null;

    status: string;
    created_at: string;
    updated_at: string;
}

interface Filters {
    [key: string]: string | undefined;
    search?: string;
    marital_status_id?: string;
    employment_status_id?: string;
    bank_id?: string;
    branch_id?: string;
    parents_status_id?: string;
    death_date_from?: string;
    death_date_to?: string;
    military_number?: string;
    military_rank?: string;
    branch?: string;
    decision_number?: string;
    has_martyr_decision?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
}

interface Props {
    martyrs: {
        data: Martyr[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: Filters;
    maritalStatuses: Array<{ id: number; name_ar: string; name_en: string }>;
    employmentStatuses: Array<{ id: number; name: string }>;
    banks: Array<{ id: number; name_ar: string }>;
    parentsStatuses: Array<{ id: number; name_ar: string; name_en: string }>;
    militaryRanks?: Array<{ id: number; name_ar: string; name_en: string }>;
    branches?: Array<{ id: number; name_ar: string }>;
}

export default function Index({ martyrs, filters, maritalStatuses, employmentStatuses, banks, parentsStatuses, militaryRanks = [], branches = [] }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { can } = usePermissions('martyrs');
    const { can: canAttachments } = usePermissions('attachments');
    
    const canViewAttachments = canAttachments('canRead');
    const canViewDetails = can('canViewDetails');
    const canUpdate = can('canUpdate');
    const canDelete = can('canDelete');
    const canCreate = can('canCreate');
    const canExport = can('canExport');

    // State
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isColumnsDialogOpen, setIsColumnsDialogOpen] = useState(false);
    const [latestExportAvailable, setLatestExportAvailable] = useState<boolean | null>(null);
    const [latestExportUrl, setLatestExportUrl] = useState<string | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Columns Configuration
    const availableColumns = [
        { key: 'id', label: 'ID', required: true },
        { key: 'full_name', label: t('martyrs.full_name'), required: true },
        { key: 'national_id', label: t('martyrs.national_id'), required: true },
        { key: 'address', label: t('martyrs.address'), required: false },
        { key: 'status', label: t('martyrs.status'), required: false },
        { key: 'children_count', label: t('martyrs.children_count'), required: false },
        { key: 'military_rank', label: t('martyrs.military_rank'), required: false },
        { key: 'job_grade', label: t('martyrs.job_grade'), required: false },
        { key: 'employment_status', label: t('martyrs.employment_status'), required: false },
        { key: 'marital_status', label: t('martyrs.marital_status'), required: false },
        { key: 'wife_status', label: t('martyrs.wife_status'), required: false },
        { key: 'military_number', label: t('martyrs.military_number'), required: false },
        { key: 'parents_status', label: t('martyrs.parents_status'), required: false },
        { key: 'bank', label: t('martyrs.bank'), required: false },
        { key: 'branch', label: t('martyrs.branch'), required: false },
        { key: 'employer', label: t('martyrs.employer'), required: false },
        { key: 'employer_location', label: t('martyrs.employer_location'), required: false },
        { key: 'previous_employer', label: t('martyrs.previous_employer'), required: false },
        { key: 'previous_employer_location', label: t('martyrs.previous_employer_location'), required: false },
        { key: 'bank_account_number', label: t('martyrs.bank_account_number'), required: false },
        { key: 'death_date', label: t('martyrs.death_date'), required: false },
        { key: 'has_martyr_decision', label: t('martyrs.decision'), required: false },
        { key: 'decision_number', label: t('martyrs.decision_number'), required: false },
        { key: 'decision_date', label: t('martyrs.decision_date'), required: false },
        { key: 'agent_name', label: t('martyrs.agent_name'), required: false },
        { key: 'agent_phone', label: t('martyrs.agent_phone'), required: false },
        { key: 'agent_passport_number', label: t('martyrs.agent_passport_number'), required: false },
        { key: 'agent_relationship', label: t('martyrs.agent_relationship'), required: false },
        
        ...(canViewAttachments ? [{ key: 'attachments', label: t('martyrs.attachments'), required: false }] : []),
        { key: 'actions', label: t('martyrs.actions'), required: true },
    ];

    const [visibleColumns, setVisibleColumns] = useState<string[]>(() => availableColumns.map(c => c.key));
    const VISIBLE_COLUMNS_KEY = 'martyrs_visible_columns';

    // Persist Columns
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem(VISIBLE_COLUMNS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as string[];
                const allowed = new Set(availableColumns.map(c => c.key));
                const valid = parsed.filter(k => allowed.has(k));
                if (valid.length) setVisibleColumns(valid);
            }
        } catch {}
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') localStorage.setItem(VISIBLE_COLUMNS_KEY, JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    // Check Export Status
    useEffect(() => {
        let mounted = true;
        fetch('/martyrs/export/status')
            .then(res => res.json())
            .then(data => {
                if (mounted) {
                    setLatestExportAvailable(!!data.exists);
                    setLatestExportUrl(data.url);
                }
            })
            .catch(() => mounted && setLatestExportAvailable(false));
        return () => { mounted = false; };
    }, []);

    // Filter Logic
    const handleFilterChange = (key: keyof Filters, value: string) => {
        const newValue = value === 'all' ? '' : value;
        setLocalFilters(prev => ({ ...prev, [key]: newValue }));
    };

    const cleanFilters = (f: Filters) => {
        return Object.entries(f).reduce<Record<string, string>>((acc, [k, v]) => {
            if (v && v.trim() !== '') acc[k] = v;
            return acc;
        }, {});
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/martyrs', cleanFilters(localFilters), { preserveState: true, preserveScroll: true });
        }, 300);
        return () => clearTimeout(timeout);
    }, [localFilters]);

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/martyrs', {}, { preserveState: true, preserveScroll: true });
    };

    // Columns Definition
    const columns = useMemo<ColumnDef<Martyr>[]>(() => [
        {
            id: 'id',
            accessorKey: 'id',
            header: '#',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>
        },
        {
            id: 'full_name',
            accessorKey: 'full_name',
            header: ({ column }) => (
                <Button variant="ghost" className="-ml-4" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    {t('martyrs.full_name')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={row.original.profile_image ? `/storage/${row.original.profile_image}` : undefined} alt={row.original.full_name} className="object-cover" />
                        <AvatarFallback>{row.original.full_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Link href={`/martyrs/${row.original.id}`} className="font-medium hover:underline">{row.original.full_name}</Link>
                    </div>
                </div>
            )
        },
        {
            id: 'national_id',
            accessorKey: 'national_id',
            header: t('martyrs.national_id'),
            cell: ({ row }) => <div className="font-mono text-sm bg-muted/50 px-2 py-1 rounded w-fit">{row.original.national_id}</div>
        },
        {
            id: 'military_number',
            accessorKey: 'military_number',
            header: t('martyrs.military_number'),
            cell: ({ row }) => row.original.military_number ? <div className="font-mono text-sm">{row.original.military_number}</div> : '-'
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: t('martyrs.status'),
            cell: ({ row }) => {
                const status = row.original.status;
                const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                    active: 'default',
                    inactive: 'secondary',
                    pending: 'outline',
                    complete: 'default',
                    incomplete: 'destructive'
                };
                return <Badge variant={variants[status] || 'secondary'}>{t(`martyrs.status.${status}`) || status}</Badge>;
            }
        },
        {
            id: 'military_rank',
            accessorKey: 'military_rank',
            header: t('martyrs.military_rank'),
            cell: ({ row }) => row.original.military_rank ? (isRTL ? row.original.military_rank.name_ar : row.original.military_rank.name_en) : '-'
        },
        {
            id: 'job_grade',
            accessorKey: 'job_grade',
            header: t('martyrs.job_grade'),
            cell: ({ row }) => {
                 const j = row.original.job_grade;
                 if(!j) return '-';
                 if(typeof j === 'string') return j;
                 return isRTL ? (j.name_ar ?? j.name_en) : (j.name_en ?? j.name_ar);
            }
        },
        {
            id: 'children_count',
            accessorKey: 'children_count',
            header: t('martyrs.children_count'),
            cell: ({ row }) => row.original.children_count ?? 0
        },
        {
            id: 'marital_status',
            accessorKey: 'marital_status',
            header: t('martyrs.marital_status'),
            cell: ({ row }) => row.original.marital_status ? (isRTL ? row.original.marital_status.name_ar : row.original.marital_status.name_en) : '-'
        },
        {
            id: 'employment_status',
            accessorKey: 'employment_status',
            header: t('martyrs.employment_status'),
            cell: ({ row }) => row.original.employment_status?.name || '-'
        },
        {
            id: 'bank',
            accessorKey: 'bank',
            header: t('martyrs.bank'),
            cell: ({ row }) => row.original.bank?.name_ar || '-'
        },
        {
            id: 'branch',
            accessorKey: 'branch',
            header: t('martyrs.branch'),
            cell: ({ row }) => row.original.branch?.name_ar || '-'
        },
        {
            id: 'employer',
            accessorKey: 'employer',
            header: t('martyrs.employer'),
            cell: ({ row }) => row.original.employer ? (isRTL ? row.original.employer.name_ar : (row.original.employer.name_en || row.original.employer.name_ar)) : '-'
        },
        {
            id: 'employer_location',
            accessorKey: 'employer_location',
            header: t('martyrs.employer_location'),
            cell: ({ row }) => row.original.employer_location ? (isRTL ? row.original.employer_location.name_ar : (row.original.employer_location.name_en || row.original.employer_location.name_ar)) : '-'
        },
        {
            id: 'previous_employer',
            accessorKey: 'previous_employer',
            header: t('martyrs.previous_employer'),
            cell: ({ row }) => row.original.previous_employer ? (isRTL ? row.original.previous_employer.name_ar : (row.original.previous_employer.name_en || row.original.previous_employer.name_ar)) : '-'
        },
        {
            id: 'previous_employer_location',
            accessorKey: 'previous_employer_location',
            header: t('martyrs.previous_employer_location'),
            cell: ({ row }) => row.original.previous_employer_location ? (isRTL ? row.original.previous_employer_location.name_ar : (row.original.previous_employer_location.name_en || row.original.previous_employer_location.name_ar)) : '-'
        },
        {
            id: 'bank_account_number',
            accessorKey: 'bank_account_number',
            header: t('martyrs.bank_account_number'),
            cell: ({ row }) => row.original.bank_account_number ? <span className="font-mono">{row.original.bank_account_number}</span> : '-'
        },
        {
            id: 'address',
            accessorKey: 'address',
            header: t('martyrs.address'),
            cell: ({ row }) => <span className="truncate max-w-[200px]" title={row.original.address}>{row.original.address}</span>
        },
        {
            id: 'wife_status',
            accessorKey: 'wife_status',
            header: t('martyrs.wife_status'),
            cell: ({ row }) => {
                if (row.original.marital_status_id !== 1) return <span className="text-muted-foreground">-</span>;
                return row.original.wife_status ? (
                    <Badge variant={row.original.wife_status === 'متزوجة' ? 'destructive' : 'secondary'}>
                        {row.original.wife_status}
                    </Badge>
                ) : '-';
            }
        },
        {
            id: 'has_martyr_decision',
            accessorKey: 'has_martyr_decision',
            header: t('martyrs.decision'),
            cell: ({ row }) => row.original.has_martyr_decision ? <Badge className="bg-green-600">{t('martyrs.yes')}</Badge> : <Badge variant="destructive">{t('martyrs.no')}</Badge>
        },
        {
            id: 'decision_number',
            accessorKey: 'decision_number',
            header: t('martyrs.decision_number'),
            cell: ({ row }) => row.original.decision_number || '-'
        },
        {
            id: 'decision_date',
            accessorKey: 'decision_date',
            header: t('martyrs.decision_date'),
            cell: ({ row }) => row.original.decision_date || '-'
        },
        {
            id: 'death_date',
            accessorKey: 'death_date',
            header: t('martyrs.death_date'),
            cell: ({ row }) => row.original.death_date || '-'
        },
        {
            id: 'agent_name',
            accessorKey: 'agent_name',
            header: t('martyrs.agent_name'),
            cell: ({ row }) => row.original.agent_name || '-'
        },
        {
            id: 'agent_phone',
            accessorKey: 'agent_phone',
            header: t('martyrs.agent_phone'),
            cell: ({ row }) => row.original.agent_phone ? <span className="font-mono" dir="ltr">{row.original.agent_phone}</span> : '-'
        },
        {
            id: 'agent_passport_number',
            accessorKey: 'agent_passport_number',
            header: t('martyrs.agent_passport_number'),
            cell: ({ row }) => row.original.agent_passport_number ? <span className="font-mono">{row.original.agent_passport_number}</span> : '-'
        },
        {
            id: 'agent_relationship',
            accessorKey: 'agent_relationship',
            header: t('martyrs.agent_relationship'),
            cell: ({ row }) => (row.original as any).agent_relationship || '-'
        },  
        {
            id: 'parents_status',
            accessorKey: 'parents_status',
            header: t('martyrs.parents_status'),
            cell: ({ row }) => row.original.parents_status ? (isRTL ? row.original.parents_status.name_ar : row.original.parents_status.name_en) : '-'
        },
        ...(canViewAttachments ? [{
            id: 'attachments',
            header: t('martyrs.attachments'),
            cell: ({ row }: { row: any }) => (
                <Button variant="link" size="sm" asChild>
                    <Link href={`/martyrs/${row.original.id}/attachments`}>{t('martyrs.view_attachments')}</Link>
                </Button>
            )
        }] : []),
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {canViewDetails && (
                            <DropdownMenuItem asChild>
                                <Link href={`/martyrs/${row.original.id}`} className="flex items-center cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {t('martyrs.view')}
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canUpdate && (
                            <DropdownMenuItem asChild>
                                <Link href={`/martyrs/${row.original.id}/edit`} className="flex items-center cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {t('martyrs.edit')}
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem 
                                onClick={() => { setDeletingId(row.original.id); setDeleteOpen(true); }}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('martyrs.delete')}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ], [t, isRTL, visibleColumns]);

    const filteredColumns = columns.filter(col => visibleColumns.includes(col.id as string) || col.id === 'actions');

    const handleExport = async (e: React.MouseEvent) => {
        e.preventDefault();
        const payload = cleanFilters(localFilters);
        try {
            const params = new URLSearchParams(payload);
            params.append('sync', '1');
            if (visibleColumns.length) params.append('columns', visibleColumns.join(','));
            
            window.open(`/martyrs/export?${params.toString()}`, '_blank');
        } catch {}
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('martyrs.title'), href: '/martyrs' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('martyrs.title')} />
            
            <div className="p-6 space-y-6">
                {/* Header Stats / Info */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('martyrs.title')}</h1>
                    <p className="text-muted-foreground">
                        {t('martyrs.description', { count: martyrs.total })}
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder={t('martyrs.search_placeholder')} 
                            className="pl-9 bg-background"
                            value={localFilters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">

                        {/* Filters Sheet */}
                        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" title={t('martyrs.filters.advanced')}>
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={isRTL ? 'left' : 'right'} className="w-full sm:max-w-md p-0">
                                <SheetHeader className="p-6 border-b">
                                    <SheetTitle>{t('martyrs.filters.advanced')}</SheetTitle>
                                    <SheetDescription>{t('martyrs.filters.advanced_description')}</SheetDescription>
                                </SheetHeader>
                                <ScrollArea className="h-[calc(100vh-10rem)] p-6">
                                    <div className="grid gap-6">
                                         {/* Filters Fields */}
                                         <div className="space-y-4">
                                            {/* Military Rank */}
                                            <div className="space-y-2">
                                                <Label>{t('martyrs.military_rank')}</Label>
                                                <Select value={localFilters.military_rank || 'all'} onValueChange={(v) => handleFilterChange('military_rank', v)}>
                                                    <SelectTrigger><SelectValue placeholder={t('martyrs.select')} /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                                        {militaryRanks.map(r => <SelectItem key={r.id} value={String(r.id)}>{isRTL ? r.name_ar : r.name_en}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Marital Status */}
                                                <div className="space-y-2">
                                                    <Label>{t('martyrs.marital_status')}</Label>
                                                    <Select value={localFilters.marital_status_id || 'all'} onValueChange={(v) => handleFilterChange('marital_status_id', v)}>
                                                        <SelectTrigger><SelectValue placeholder={t('martyrs.select')} /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                                            {maritalStatuses.map(s => <SelectItem key={s.id} value={String(s.id)}>{isRTL ? s.name_ar : s.name_en}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Wife Status */}
                                                <div className="space-y-2">
                                                    <Label>{t('martyrs.wife_status')}</Label>
                                                    <Select value={localFilters.wife_status || 'all'} onValueChange={(v) => handleFilterChange('wife_status', v)}>
                                                        <SelectTrigger><SelectValue placeholder={t('martyrs.select')} /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                                            <SelectItem value="أرملة">{t('martyrs.wife_status.widow') || 'أرملة'}</SelectItem>
                                                            <SelectItem value="متزوجة">{t('martyrs.wife_status.married') || 'متزوجة'}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Employment Status */}
                                                <div className="space-y-2">
                                                    <Label>{t('martyrs.employment_status')}</Label>
                                                    <Select value={localFilters.employment_status_id || 'all'} onValueChange={(v) => handleFilterChange('employment_status_id', v)}>
                                                        <SelectTrigger><SelectValue placeholder={t('martyrs.select')} /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                                            {employmentStatuses.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Bank */}
                                                <div className="space-y-2">
                                                    <Label>{t('martyrs.bank')}</Label>
                                                    <Select value={localFilters.bank_id || 'all'} onValueChange={(v) => handleFilterChange('bank_id', v)}>
                                                        <SelectTrigger><SelectValue placeholder={t('martyrs.select')} /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                                            {banks.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.name_ar}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Parents Status */}
                                            <div className="space-y-2">
                                                <Label>{t('martyrs.parents_status')}</Label>
                                                <Select value={localFilters.parents_status_id || 'all'} onValueChange={(v) => handleFilterChange('parents_status_id', v)}>
                                                    <SelectTrigger><SelectValue placeholder={t('martyrs.select')} /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                                        {parentsStatuses.map(s => <SelectItem key={s.id} value={String(s.id)}>{isRTL ? s.name_ar : s.name_en}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Separator />

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>{t('martyrs.has_martyr_decision')}</Label>
                                                    <Select value={localFilters.has_martyr_decision || 'all'} onValueChange={(v) => handleFilterChange('has_martyr_decision', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                                            <SelectItem value="1">{t('martyrs.yes')}</SelectItem>
                                                            <SelectItem value="0">{t('martyrs.no')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>{t('martyrs.sort_by')}</Label>
                                                    <Select value={localFilters.sort || '-created_at'} onValueChange={(v) => handleFilterChange('sort', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="-created_at">{t('martyrs.sort.newest')}</SelectItem>
                                                            <SelectItem value="created_at">{t('martyrs.sort.oldest')}</SelectItem>
                                                            <SelectItem value="full_name">{t('martyrs.sort.name_asc')}</SelectItem>
                                                            <SelectItem value="-full_name">{t('martyrs.sort.name_desc')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                         </div>
                                    </div>
                                </ScrollArea>
                                <div className="p-6 border-t bg-muted/20">
                                    <Button onClick={clearFilters} variant="outline" className="w-full">
                                        <Trash2 className="mr-2 h-4 w-4" /> {t('martyrs.filters.clear_all')}
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Columns Dialog */}
                        <Dialog open={isColumnsDialogOpen} onOpenChange={setIsColumnsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" title={t('martyrs.show_columns')}>
                                    <Columns className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{t('martyrs.show_columns')}</DialogTitle>
                                    <DialogDescription>{t('martyrs.show_columns_description')}</DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="h-[300px] border rounded-md p-4">
                                    <div className="space-y-4">
                                        {availableColumns.map((col) => (
                                            <div key={col.key} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`col-${col.key}`} 
                                                    checked={visibleColumns.includes(col.key)}
                                                    onCheckedChange={(checked) => {
                                                        if(checked) setVisibleColumns([...visibleColumns, col.key]);
                                                        else if(!col.required) setVisibleColumns(visibleColumns.filter(c => c !== col.key));
                                                    }}
                                                    disabled={col.required}
                                                />
                                                <Label htmlFor={`col-${col.key}`} className={cn(col.required && "text-muted-foreground italic")}>
                                                    {col.label} {col.required && "*"}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setVisibleColumns(availableColumns.map(c => c.key))}>
                                        {t('martyrs.reset_columns')}
                                    </Button>
                                    <Button onClick={() => setIsColumnsDialogOpen(false)}>{t('martyrs.done')}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="h-6 w-px bg-border mx-1 hidden md:block" />

                        {/* Export & Create */}
                        {canExport && (
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        {t('martyrs.export')}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleExport}>
                                        <FileText className="mr-2 h-4 w-4" /> {t('martyrs.export_excel')}
                                    </DropdownMenuItem>
                                    {latestExportAvailable && (
                                        <DropdownMenuItem onClick={() => window.open(latestExportUrl || '', '_blank')}>
                                            <Download className="mr-2 h-4 w-4" /> {t('martyrs.download_latest')}
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                             </DropdownMenu>
                        )}

                        {canCreate && (
                            <Button asChild>
                                <Link href="/martyrs/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('martyrs.create')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Data Table Card */}
                <Card className="shadow-sm border-muted">
                    <CardContent className="p-0">
                        <DataTable 
                            columns={filteredColumns} 
                            data={martyrs.data} 
                            columnVisibility={availableColumns.reduce((acc, col) => ({...acc, [col.key]: visibleColumns.includes(col.key)}), {})}
                        />
                    </CardContent>
                </Card>

                {/* Pagination */}
                {martyrs.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            {t('martyrs.pagination.showing', { from: martyrs.from, to: martyrs.to, total: martyrs.total })}
                        </p>
                        <Pagination className="order-1 sm:order-2 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href={martyrs.current_page > 1 ? `/martyrs?page=${martyrs.current_page - 1}` : '#'} className={cn(martyrs.current_page <= 1 && "pointer-events-none opacity-50")} />
                                </PaginationItem>
                                {/* Simple Pagination Logic for brevity */}
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>{martyrs.current_page}</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href={martyrs.current_page < martyrs.last_page ? `/martyrs?page=${martyrs.current_page + 1}` : '#'} className={cn(martyrs.current_page >= martyrs.last_page && "pointer-events-none opacity-50")} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Delete Alert Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('martyrs.confirm_delete')}</AlertDialogTitle>
                        <AlertDialogDescription className="text-destructive">
                            {t('martyrs.delete_warning_message') || "This action cannot be undone. This will permanently delete the martyr record."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => {
                                if(deletingId) {
                                    router.delete(`/martyrs/${deletingId}`, {
                                        onSuccess: () => {
                                            toast({ title: t('martyrs.deleted_successfully'), variant: "default" });
                                            setDeleteOpen(false);
                                        }
                                    });
                                }
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
