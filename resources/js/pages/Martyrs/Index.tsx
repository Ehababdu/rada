import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';

// Icons
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Columns,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    User,
} from 'lucide-react';

const MARITAL_STATUS_SINGLE = 1;

// Helper functions for optimized rendering
const getLocalizedName = (item: any, isRTL: boolean) => {
    if (!item) return '-';
    if (typeof item === 'string') return item;
    return isRTL ? (item.name_ar ?? item.name_en ?? '-') : (item.name_en ?? item.name_ar ?? '-');
};

const getBankBranchName = (item: any) => {
    return item?.name_ar || '-';
};

const getEmploymentStatusName = (item: any) => {
    return item?.name || '-';
};

interface Martyr {
    id: number;
    file_number: string | null;
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
    job_grade?:
    | { id: number; name_ar: string; name_en?: string }
    | string
    | null;
    bank?: { id: number; name_ar: string } | null;
    branch?: { id: number; name_ar: string } | null;
    employment_status?: {
        id: number;
        name?: string;
        name_ar?: string;
        name_en?: string;
    } | null;
    parents_status?: { id: number; name_ar: string; name_en: string } | null;
    marital_status?: { id: number; name_ar: string; name_en: string } | null;
    employer?: { id: number; name_ar: string; name_en?: string } | null;
    employer_location?: {
        id: number;
        name_ar: string;
        name_en?: string;
    } | null;
    previous_employer?: {
        id: number;
        name_ar: string;
        name_en?: string;
    } | null;
    previous_employer_location?: {
        id: number;
        name_ar: string;
        name_en?: string;
    } | null;

    wife_status?: string | null;

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
    military_number?: string;
    military_rank?: string;
    branch?: string;
    decision_number?: string;
    has_martyr_decision?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    per_page?: string;
    employer_id?: string;
    previous_employer_id?: string;
    decision_date_from?: string;
    status?: string;
    wife_status?: string;
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
    branches?: Array<{ id: number; name_ar: string; bank_id: number }>;
    employers?: Array<{ id: number; name_ar: string; name_en?: string }>;
    previousEmployers?: Array<{ id: number; name_ar: string; name_en?: string }>;
}

export default function Index({
    martyrs,
    filters,
    maritalStatuses,
    employmentStatuses,
    banks,
    parentsStatuses,
    militaryRanks = [],
    branches = [],
    employers = [],
    previousEmployers = [],
}: Props) {
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
    const [latestExportAvailable, setLatestExportAvailable] = useState<
        boolean | null
    >(null);
    const [latestExportUrl, setLatestExportUrl] = useState<string | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [filteredBranches, setFilteredBranches] = useState(branches);

    const isUserChange = useRef(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update localFilters when filters prop changes (from server)
    useEffect(() => {
        // Deep compare/check to prevent loop
        const filtersChanged = JSON.stringify(localFilters) !== JSON.stringify(filters);
        if (filtersChanged) {
            setLocalFilters(filters);
        }
    }, [filters]);

    // Columns Configuration
    const availableColumns = useMemo(
        () => [
            { key: '#', label: '#', required: true },
            { key: 'full_name', label: t('martyrs.full_name'), required: true },
            { key: 'file_number', label: t('martyrs.file_number'), required: true },
            {
                key: 'national_id',
                label: t('martyrs.national_id'),
                required: true,
            },
            { key: 'address', label: t('martyrs.address'), required: false },
            {
                key: 'children_count',
                label: t('martyrs.children_count'),
                required: false,
            },
            {
                key: 'military_rank',
                label: t('martyrs.military_rank'),
                required: true,
            },
            {
                key: 'job_grade',
                label: t('martyrs.job_grade'),
                required: true,
            },
            {
                key: 'employment_status',
                label: t('martyrs.employment_status'),
                required: true,
            },
            {
                key: 'marital_status',
                label: t('martyrs.marital_status'),
                required: true,
            },
            {
                key: 'wife_status',
                label: t('martyrs.wife_status'),
                required: false,
            },
            {
                key: 'military_number',
                label: t('martyrs.military_number'),
                required: true,
            },
            {
                key: 'parents_status',
                label: t('martyrs.parents_status'),
                required: false,
            },
            { key: 'bank', label: t('martyrs.bank'), required: false },
            { key: 'branch', label: t('martyrs.branch'), required: false },
            { key: 'employer', label: t('martyrs.employer'), required: true },
            {
                key: 'employer_location',
                label: t('martyrs.employer_location'),
                required: false,
            },
            {
                key: 'previous_employer',
                label: t('martyrs.previous_employer'),
                required: false,
            },
            {
                key: 'previous_employer_location',
                label: t('martyrs.previous_employer_location'),
                required: false,
            },
            {
                key: 'bank_account_number',
                label: t('martyrs.bank_account_number'),
                required: false,
            },
            {
                key: 'death_date',
                label: t('martyrs.death_date'),
                required: false,
            },
            {
                key: 'has_martyr_decision',
                label: t('martyrs.decision'),
                required: true,
            },
            {
                key: 'decision_number',
                label: t('martyrs.decision_number'),
                required: false,
            },
            {
                key: 'decision_date',
                label: t('martyrs.decision_date'),
                required: false,
            },
            {
                key: 'agent_name',
                label: t('martyrs.agent_name'),
                required: true,
            },
            {
                key: 'agent_phone',
                label: t('martyrs.agent_phone'),
                required: false,
            },
            {
                key: 'agent_passport_number',
                label: t('martyrs.agent_passport_number'),
                required: false,
            },
            {
                key: 'agent_relationship',
                label: t('martyrs.agent_relationship'),
                required: false,
            },
            { key: 'status', label: t('martyrs.status'), required: false },

            ...(canViewAttachments
                ? [
                    {
                        key: 'attachments',
                        label: t('martyrs.attachments'),
                        required: true,
                    },
                ]
                : []),
            { key: 'actions', label: t('martyrs.actions'), required: true },
        ],
        [t, canViewAttachments],
    );

    const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
        availableColumns.map((c) => c.key),
    );
    const VISIBLE_COLUMNS_KEY = 'martyrs_visible_columns';

    const basicKeys = useMemo(() =>
        availableColumns
            .filter((col) =>
                ['#', 'file_number', 'full_name', 'national_id', 'military_rank', 'job_grade', 'marital_status', 'employment_status', 'employer', 'has_martyr_decision', 'agent_name', 'military_number', ...(canViewAttachments ? ['attachments'] : [])].includes(col.key),
            )
            .map((c) => c.key),
        [availableColumns, canViewAttachments],
    );

    const additionalKeys = useMemo(() =>
        availableColumns
            .filter((col) => !basicKeys.includes(col.key))
            .map((c) => c.key),
        [availableColumns, basicKeys],
    );

    const areAllBasicSelected = basicKeys.length > 0 && basicKeys.every((k) => visibleColumns.includes(k));
    const areSomeBasicSelected = basicKeys.some((k) => visibleColumns.includes(k)) && !areAllBasicSelected;
    const areAllAdditionalSelected = additionalKeys.length > 0 && additionalKeys.every((k) => visibleColumns.includes(k));
    const areSomeAdditionalSelected = additionalKeys.some((k) => visibleColumns.includes(k)) && !areAllAdditionalSelected;

    // Persist Columns
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem(VISIBLE_COLUMNS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as string[];
                const allowed = new Set(availableColumns.map((c) => c.key));
                const valid = parsed.filter((k) => allowed.has(k));
                if (valid.length) {
                    setVisibleColumns((prev) => {
                        const combined = [...new Set([...prev, ...valid])];
                        return combined.filter((k) => allowed.has(k));
                    });
                }
            }
        } catch {
            // Ignore errors
        }
    }, [availableColumns]);

    useEffect(() => {
        if (typeof window !== 'undefined')
            localStorage.setItem(
                VISIBLE_COLUMNS_KEY,
                JSON.stringify(visibleColumns),
            );
    }, [visibleColumns]);

    // Check Export Status
    useEffect(() => {
        let mounted = true;
        fetch('/martyrs/export/status')
            .then((res) => res.json())
            .then((data) => {
                if (mounted) {
                    setLatestExportAvailable(!!data.exists);
                    setLatestExportUrl(data.url);
                }
            })
            .catch(() => mounted && setLatestExportAvailable(false));
        return () => {
            mounted = false;
        };
    }, []);

    // Filter branches based on selected bank
    useEffect(() => {
        if (localFilters.bank_id && localFilters.bank_id !== 'all') {
            const bankId = parseInt(localFilters.bank_id);
            setFilteredBranches(branches.filter(branch => branch.bank_id === bankId));
            // Clear branch filter if selected branch doesn't belong to the new bank
            if (localFilters.branch_id && localFilters.branch_id !== 'all') {
                const branchExists = branches.some(branch =>
                    branch.id === parseInt(localFilters.branch_id as string) &&
                    branch.bank_id === bankId
                );
                if (!branchExists) {
                    handleFilterChange('branch_id', '');
                }
            }
        } else {
            setFilteredBranches(branches);
        }
    }, [localFilters.bank_id, branches]);

    // Filter Logic
    const triggerSearch = useCallback((search: string) => {
        const cleaned = cleanFilters({ ...localFilters, search });
        router.get('/martyrs', cleaned, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [localFilters]);

    const handleSearchChange = (value: string) => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(
            () => triggerSearch(value),
            400,
        );
    };

    const handleFilterChange = (key: keyof Filters, value: string) => {
        const newValue = value === 'all' ? '' : value;
        const newFilters = { ...localFilters, [key]: newValue };
        setLocalFilters(newFilters);
        isUserChange.current = true;
    };

    const cleanFilters = (f: Filters) => {
        return Object.entries(f).reduce<Record<string, string>>(
            (acc, [k, v]) => {
                if (v && v.trim() !== '') acc[k] = v;
                return acc;
            },
            {},
        );
    };

    useEffect(() => {
        if (isUserChange.current) {
            isUserChange.current = false;
            const cleaned = cleanFilters(localFilters);
            if (Object.keys(cleaned).length > 0) {
                router.get('/martyrs', cleaned, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }
    }, [localFilters]);

    const clearFilters = () => {
        setLocalFilters({});
        router.get(
            '/martyrs',
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    // Columns Definition
    const columns = useMemo<ColumnDef<Martyr>[]>(
        () => [
            {
                id: '#',
                accessorKey: '#',
                header: '#',
                cell: ({ row }: { row: { index: number } }) => (
                    <span className="font-mono text-xs text-muted-foreground">
                        {row.index + 1}
                    </span>
                ),
            },
            {
                id: 'full_name',
                accessorKey: 'full_name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="-ml-4"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        {t('martyrs.full_name')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }: { row: { original: Martyr } }) => (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage
                                src={
                                    row.original.profile_image
                                        ? `/storage/${row.original.profile_image}`
                                        : undefined
                                }
                                alt={row.original.full_name}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {row.original.full_name.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <Link
                                href={`/martyrs/${row.original.id}`}
                                className="font-medium hover:underline"
                            >
                                {row.original.full_name}
                            </Link>
                        </div>
                    </div>
                ),
            },
            {
                id: 'file_number',
                accessorKey: 'file_number',
                header: t('martyrs.file_number'),
                cell: ({ row }: { row: { original: Martyr } }) => (
                    <div className="font-medium text-sm">
                        {row.original.file_number || '-'}
                    </div>
                ),
            },
            {
                id: 'national_id',
                accessorKey: 'national_id',
                header: t('martyrs.national_id'),
                cell: ({ row }: { row: { original: Martyr } }) => (
                    <div className="w-fit rounded bg-muted/50 px-2 py-1 font-mono text-sm">
                        {row.original.national_id}
                    </div>
                ),
            },
            {
                id: 'military_number',
                accessorKey: 'military_number',
                header: t('martyrs.military_number'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.military_number ? (
                        <div className="font-mono text-sm">
                            {row.original.military_number}
                        </div>
                    ) : (
                        '-'
                    ),
            },
            {
                id: 'military_rank',
                accessorKey: 'military_rank',
                header: t('martyrs.military_rank'),
                cell: ({ row }: { row: { original: Martyr } }) => getLocalizedName(row.original.military_rank, isRTL),
            },
            {
                id: 'job_grade',
                accessorKey: 'job_grade',
                header: t('martyrs.job_grade'),
                cell: ({ row }: { row: { original: Martyr } }) => getLocalizedName(row.original.job_grade, isRTL),
            },
            {
                id: 'children_count',
                accessorKey: 'children_count',
                header: t('martyrs.children_count'),
                cell: ({ row }: { row: { original: Martyr } }) => row.original.children_count ?? 0,
            },
            {
                id: 'marital_status',
                accessorKey: 'marital_status',
                header: t('martyrs.marital_status'),
                cell: ({ row }: { row: { original: Martyr } }) => getLocalizedName(row.original.marital_status, isRTL),
            },
            {
                id: 'employment_status',
                accessorKey: 'employment_status',
                header: t('martyrs.employment_status'),
                cell: ({ row }: { row: { original: Martyr } }) => getEmploymentStatusName(row.original.employment_status),
            },
            {
                id: 'bank',
                accessorKey: 'bank',
                header: t('martyrs.bank'),
                cell: ({ row }: { row: { original: Martyr } }) => getBankBranchName(row.original.bank),
            },
            {
                id: 'branch',
                accessorKey: 'branch',
                header: t('martyrs.branch'),
                cell: ({ row }: { row: { original: Martyr } }) => getBankBranchName(row.original.branch),
            },
            {
                id: 'employer',
                accessorKey: 'employer',
                header: t('martyrs.employer'),
                cell: ({ row }: { row: { original: Martyr } }) => getLocalizedName(row.original.employer, isRTL),
            },
            {
                id: 'employer_location',
                accessorKey: 'employer_location',
                header: t('martyrs.employer_location'),
                cell: ({ row }: { row: { original: Martyr } }) => getLocalizedName(row.original.employer_location, isRTL),
            },
            {
                id: 'previous_employer',
                accessorKey: 'previous_employer',
                header: t('martyrs.previous_employer'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.previous_employer
                        ? isRTL
                            ? row.original.previous_employer.name_ar
                            : row.original.previous_employer.name_en ||
                            row.original.previous_employer.name_ar
                        : '-',
            },
            {
                id: 'previous_employer_location',
                accessorKey: 'previous_employer_location',
                header: t('martyrs.previous_employer_location'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.previous_employer_location
                        ? isRTL
                            ? row.original.previous_employer_location.name_ar
                            : row.original.previous_employer_location.name_en ||
                            row.original.previous_employer_location.name_ar
                        : '-',
            },
            {
                id: 'bank_account_number',
                accessorKey: 'bank_account_number',
                header: t('martyrs.bank_account_number'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.bank_account_number ? (
                        <span className="font-mono">
                            {row.original.bank_account_number}
                        </span>
                    ) : (
                        '-'
                    ),
            },
            {
                id: 'address',
                accessorKey: 'address',
                header: t('martyrs.address'),
                cell: ({ row }: { row: { original: Martyr } }) => (
                    <span
                        className="max-w-[200px] truncate"
                        title={row.original.address}
                    >
                        {row.original.address}
                    </span>
                ),
            },
            {
                id: 'wife_status',
                accessorKey: 'wife_status',
                header: t('martyrs.wife_status'),
                cell: ({ row }: { row: { original: Martyr } }) => {
                    const { wife_status } = row.original;
                    if (!wife_status || wife_status.trim() === '') {
                        return '-';
                    }
                    const isMarried = wife_status === 'متزوجة';
                    return (
                        <Badge variant={isMarried ? 'destructive' : 'secondary'}>
                            {wife_status}
                        </Badge>
                    );
                },
            },
            {
                id: 'has_martyr_decision',
                accessorKey: 'has_martyr_decision',
                header: t('martyrs.decision'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.has_martyr_decision ? (
                        <Badge className="bg-green-600">
                            {t('martyrs.yes')}
                        </Badge>
                    ) : (
                        <Badge variant="destructive">{t('martyrs.no')}</Badge>
                    ),
            },
            {
                id: 'decision_number',
                accessorKey: 'decision_number',
                header: t('martyrs.decision_number'),
                cell: ({ row }: { row: { original: Martyr } }) => row.original.decision_number || '-',
            },
            {
                id: 'decision_date',
                accessorKey: 'decision_date',
                header: t('martyrs.decision_date'),
                cell: ({ row }: { row: { original: Martyr } }) => row.original.decision_date ? row.original.decision_date.split('T')[0] : '-',
            },
            {
                id: 'death_date',
                accessorKey: 'death_date',
                header: t('martyrs.death_date'),
                cell: ({ row }: { row: { original: Martyr } }) => row.original.death_date ? row.original.death_date.split('T')[0] : '-',
            },
            {
                id: 'agent_name',
                accessorKey: 'agent_name',
                header: t('martyrs.agent_name'),
                cell: ({ row }: { row: { original: Martyr } }) => row.original.agent_name || '-',
            },
            {
                id: 'agent_phone',
                accessorKey: 'agent_phone',
                header: t('martyrs.agent_phone'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.agent_phone ? (
                        <span className="font-mono" dir="ltr">
                            {row.original.agent_phone}
                        </span>
                    ) : (
                        '-'
                    ),
            },
            {
                id: 'agent_passport_number',
                accessorKey: 'agent_passport_number',
                header: t('martyrs.agent_passport_number'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.agent_passport_number ? (
                        <span className="font-mono">
                            {row.original.agent_passport_number}
                        </span>
                    ) : (
                        '-'
                    ),
            },
            {
                id: 'agent_relationship',
                accessorKey: 'agent_relationship',
                header: t('martyrs.agent_relationship'),
                cell: ({ row }: { row: { original: Martyr } }) => row.original.agent_relationship || '-',
            },
            {
                id: 'parents_status',
                accessorKey: 'parents_status',
                header: t('martyrs.parents_status'),
                cell: ({ row }: { row: { original: Martyr } }) =>
                    row.original.parents_status
                        ? isRTL
                            ? row.original.parents_status.name_ar
                            : row.original.parents_status.name_en
                        : '-',
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: t('martyrs.status'),
                cell: ({ row }: { row: { original: Martyr } }) => {
                    const status = row.original.status;
                    const variants: Record<
                        string,
                        'default' | 'secondary' | 'destructive' | 'outline'
                    > = {
                        active: 'default',
                        inactive: 'secondary',
                        pending: 'outline',
                        complete: 'default',
                        incomplete: 'destructive',
                    };
                    return (
                        <Badge variant={variants[status] || 'secondary'}>
                            {t(`martyrs.status.${status}`) || status}
                        </Badge>
                    );
                },
            },
            ...(canViewAttachments
                ? [
                    {
                        id: 'attachments',
                        header: t('martyrs.attachments'),
                        cell: ({ row }: { row: { original: Martyr } }) => (
                            <Button variant="link" size="sm" asChild>
                                <Link
                                    href={`/martyrs/${row.original.id}/attachments`}
                                >
                                    {t('martyrs.view_attachments')}
                                </Link>
                            </Button>
                        ),
                    },
                ]
                : []),
            {
                id: 'actions',
                header: '',
                cell: ({ row }: { row: { original: Martyr } }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                {t('actions')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {canViewDetails && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/martyrs/${row.original.id}`}
                                        className="flex cursor-pointer items-center"
                                    >
                                        <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {t('martyrs.view')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {canUpdate && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/martyrs/${row.original.id}/edit`}
                                        className="flex cursor-pointer items-center"
                                    >
                                        <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {t('martyrs.edit')}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setDeletingId(row.original.id);
                                        setDeleteOpen(true);
                                    }}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('martyrs.delete')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [t, isRTL, canViewAttachments, canViewDetails, canUpdate, canDelete],
    );

    const filteredColumns = columns.filter(
        (col) =>
            visibleColumns.includes(col.id as string) || col.id === 'actions',
    );

    const handleExport = async (e: React.MouseEvent) => {
        e.preventDefault();
        const payload = cleanFilters(localFilters);
        try {
            const params = new URLSearchParams(payload);
            params.append('sync', '1');
            if (visibleColumns.length)
                params.append('columns', visibleColumns.join(','));

            // Add selected row IDs if any are selected
            const selectedIds = Object.keys(selectedRows).filter(key => selectedRows[key]);
            if (selectedIds.length > 0) {
                params.append('ids', selectedIds.join(','));
            }

            window.open(`/martyrs/export?${params.toString()}`, '_blank');
        } catch {
            // Ignore errors
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('martyrs.title'), href: '/martyrs' },
    ];

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('martyrs.title')} />

                <div className="space-y-6 p-6">
                    {/* Header Stats / Info */}
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <User className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {t('martyrs.title')}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {canCreate && (
                                <Button asChild className="transition-all hover:scale-105">
                                    <Link href="/martyrs/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('martyrs.create')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        {/* Search */}
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t('martyrs.search_placeholder')}
                                    className="bg-background pl-9 transition-all focus:ring-2 focus:ring-primary/20"
                                    defaultValue={filters.search || ''}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                            {/* Per Page */}
                            <Select
                                value={localFilters.per_page || '10'}
                                onValueChange={(value) => handleFilterChange('per_page', value)}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="all">الكل</SelectItem>

                                </SelectContent>
                            </Select>

                            {/* Filters Sheet */}
                            <Sheet
                                open={isFiltersOpen}
                                onOpenChange={setIsFiltersOpen}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SheetTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                title={t(
                                                    'martyrs.filters.advanced',
                                                )}
                                                className="transition-colors hover:bg-accent"
                                            >
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </SheetTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('martyrs.filters.advanced')}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <SheetContent
                                    side={isRTL ? 'left' : 'right'}
                                    className="w-full p-0 sm:max-w-md"
                                >
                                    <SheetHeader className="border-b p-6">
                                        <SheetTitle>
                                            {t('martyrs.filters.advanced')}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {t(
                                                'martyrs.filters.advanced_description',
                                            )}
                                        </SheetDescription>
                                    </SheetHeader>
                                    <ScrollArea className="h-[calc(100vh-10rem)] p-6">
                                        <div className="grid gap-6">
                                            {/* Filters Fields */}
                                            <div className="space-y-4">
                                                {/* Military Rank */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        {t(
                                                            'martyrs.military_rank',
                                                        )}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            localFilters.military_rank ||
                                                            'all'
                                                        }
                                                        onValueChange={(v) =>
                                                            handleFilterChange(
                                                                'military_rank',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'martyrs.select',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">
                                                                {t(
                                                                    'martyrs.all',
                                                                )}
                                                            </SelectItem>
                                                            {militaryRanks.map(
                                                                (r) => (
                                                                    <SelectItem
                                                                        key={
                                                                            r.id
                                                                        }
                                                                        value={String(
                                                                            r.id,
                                                                        )}
                                                                    >
                                                                        {isRTL
                                                                            ? r.name_ar
                                                                            : r.name_en}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {/* Marital Status */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t(
                                                                'martyrs.marital_status',
                                                            )}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.marital_status_id ||
                                                                'all'
                                                            }
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                handleFilterChange(
                                                                    'marital_status_id',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'martyrs.select',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    {t(
                                                                        'martyrs.all',
                                                                    )}
                                                                </SelectItem>
                                                                {maritalStatuses.map(
                                                                    (s) => (
                                                                        <SelectItem
                                                                            key={
                                                                                s.id
                                                                            }
                                                                            value={String(
                                                                                s.id,
                                                                            )}
                                                                        >
                                                                            {isRTL
                                                                                ? s.name_ar
                                                                                : s.name_en}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Wife Status */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t(
                                                                'martyrs.wife_status',
                                                            )}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.wife_status ||
                                                                'all'
                                                            }
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                handleFilterChange(
                                                                    'wife_status',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'martyrs.select',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    {t(
                                                                        'martyrs.all',
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value="أرملة">
                                                                    {t(
                                                                        'martyrs.wife_status.widow',
                                                                    ) ||
                                                                        'أرملة'}
                                                                </SelectItem>
                                                                <SelectItem value="متزوجة">
                                                                    {t(
                                                                        'martyrs.wife_status.married',
                                                                    ) ||
                                                                        'متزوجة'}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {/* Employment Status */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t(
                                                                'martyrs.employment_status',
                                                            )}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.employment_status_id ||
                                                                'all'
                                                            }
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                handleFilterChange(
                                                                    'employment_status_id',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'martyrs.select',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    {t(
                                                                        'martyrs.all',
                                                                    )}
                                                                </SelectItem>
                                                                {employmentStatuses.map(
                                                                    (s) => (
                                                                        <SelectItem
                                                                            key={
                                                                                s.id
                                                                            }
                                                                            value={String(
                                                                                s.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                s.name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Bank */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t('martyrs.bank')}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.bank_id ||
                                                                'all'
                                                            }
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                handleFilterChange(
                                                                    'bank_id',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'martyrs.select',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    {t(
                                                                        'martyrs.all',
                                                                    )}
                                                                </SelectItem>
                                                                {banks.map(
                                                                    (b) => (
                                                                        <SelectItem
                                                                            key={
                                                                                b.id
                                                                            }
                                                                            value={String(
                                                                                b.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                b.name_ar
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Branch - dependent on selected bank */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        {t('martyrs.branch')}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            localFilters.branch_id ||
                                                            'all'
                                                        }
                                                        onValueChange={(v) =>
                                                            handleFilterChange(
                                                                'branch_id',
                                                                v,
                                                            )
                                                        }
                                                        disabled={!localFilters.bank_id || localFilters.bank_id === 'all'}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={
                                                                    !localFilters.bank_id || localFilters.bank_id === 'all'
                                                                        ? t('martyrs.select_bank_first')
                                                                        : t('martyrs.select')
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">
                                                                {t('martyrs.all')}
                                                            </SelectItem>
                                                            {filteredBranches.map((b) => (
                                                                <SelectItem
                                                                    key={b.id}
                                                                    value={String(b.id)}
                                                                >
                                                                    {b.name_ar}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {/* Employer */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t('martyrs.employer')}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.employer_id ||
                                                                'all'
                                                            }
                                                            onValueChange={(v) =>
                                                                handleFilterChange(
                                                                    'employer_id',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'martyrs.select',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    {t('martyrs.all')}
                                                                </SelectItem>
                                                                {employers.map((e) => (
                                                                    <SelectItem
                                                                        key={e.id}
                                                                        value={String(e.id)}
                                                                    >
                                                                        {isRTL ? e.name_ar : (e.name_en || e.name_ar)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Previous Employer */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t('martyrs.previous_employer')}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.previous_employer_id ||
                                                                'all'
                                                            }
                                                            onValueChange={(v) =>
                                                                handleFilterChange(
                                                                    'previous_employer_id',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'martyrs.select',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    {t('martyrs.all')}
                                                                </SelectItem>
                                                                {previousEmployers.map((e) => (
                                                                    <SelectItem
                                                                        key={e.id}
                                                                        value={String(e.id)}
                                                                    >
                                                                        {isRTL ? e.name_ar : (e.name_en || e.name_ar)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        {t('martyrs.status')}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            localFilters.status ||
                                                            'all'
                                                        }
                                                        onValueChange={(v) =>
                                                            handleFilterChange(
                                                                'status',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'martyrs.select',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">
                                                                {t('martyrs.all')}
                                                            </SelectItem>
                                                            <SelectItem value="active">
                                                                {t('martyrs.status.active')}
                                                            </SelectItem>
                                                            <SelectItem value="inactive">
                                                                {t('martyrs.status.inactive')}
                                                            </SelectItem>
                                                            <SelectItem value="pending">
                                                                {t('martyrs.status.pending')}
                                                            </SelectItem>
                                                            <SelectItem value="complete">
                                                                {t('martyrs.status.complete')}
                                                            </SelectItem>
                                                            <SelectItem value="incomplete">
                                                                {t('martyrs.status.incomplete')}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <Separator />

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {/* Death Date Year */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t('martyrs.death_date_year')}
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            placeholder={t('martyrs.death_date_year_placeholder')}
                                                            value={localFilters.death_date_from || ''}
                                                            onChange={(e) =>
                                                                handleFilterChange('death_date_from', e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    {/* Decision Date */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t('martyrs.decision_date_year')}
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            placeholder={t('martyrs.decision_date_year_placeholder')}
                                                            value={localFilters.decision_date_from || ''}
                                                            onChange={(e) =>
                                                                handleFilterChange('decision_date_from', e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t(
                                                                'martyrs.has_martyr_decision',
                                                            )}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.has_martyr_decision ||
                                                                'all'
                                                            }
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                handleFilterChange(
                                                                    'has_martyr_decision',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    {t(
                                                                        'martyrs.all',
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value="1">
                                                                    {t(
                                                                        'martyrs.yes',
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value="0">
                                                                    {t(
                                                                        'martyrs.no',
                                                                    )}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>
                                                            {t(
                                                                'martyrs.sort_by',
                                                            )}
                                                        </Label>
                                                        <Select
                                                            value={
                                                                localFilters.sort ||
                                                                '-created_at'
                                                            }
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                handleFilterChange(
                                                                    'sort',
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="-created_at">
                                                                    {t(
                                                                        'martyrs.sort.newest',
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value="created_at">
                                                                    {t(
                                                                        'martyrs.sort.oldest',
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value="full_name">
                                                                    {t(
                                                                        'martyrs.sort.name_asc',
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value="-full_name">
                                                                    {t(
                                                                        'martyrs.sort.name_desc',
                                                                    )}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    <div className="border-t bg-muted/20 p-6">
                                        <Button
                                            onClick={clearFilters}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                                            {t('martyrs.filters.clear_all')}
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Columns Dialog */}
                            <Dialog
                                open={isColumnsDialogOpen}
                                onOpenChange={setIsColumnsDialogOpen}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                title={t(
                                                    'martyrs.show_columns',
                                                )}
                                            >
                                                <Columns className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('martyrs.show_columns')}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {t('martyrs.show_columns')}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {t(
                                                'martyrs.show_columns_description',
                                            )}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-[300px] rounded-md border p-4">
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Basic Information Columns */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-sm text-muted-foreground">
                                                        {t('martyrs.basic_information')}
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            id="select-basic"
                                                            checked={areAllBasicSelected}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setVisibleColumns([
                                                                        ...new Set([
                                                                            ...visibleColumns,
                                                                            ...basicKeys,
                                                                        ]),
                                                                    ]);
                                                                } else {
                                                                    const toRemove = basicKeys.filter((k) => {
                                                                        const col = availableColumns.find((c) => c.key === k);
                                                                        return col ? !col.required : true;
                                                                    });
                                                                    setVisibleColumns(
                                                                        visibleColumns.filter((c) => !toRemove.includes(c)),
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                {availableColumns
                                                    .filter(col => ['id', 'full_name', 'national_id', 'military_rank', 'job_grade', 'marital_status', 'employment_status', 'employer', 'has_martyr_decision', 'agent_name', 'military_number', ...(canViewAttachments ? ['attachments'] : [])].includes(col.key))
                                                    .map((col) => (
                                                        <div
                                                            key={col.key}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Checkbox
                                                                id={`col-${col.key}`}
                                                                checked={visibleColumns.includes(
                                                                    col.key,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) => {
                                                                    if (checked)
                                                                        setVisibleColumns(
                                                                            [
                                                                                ...visibleColumns,
                                                                                col.key,
                                                                            ],
                                                                        );
                                                                    else if (
                                                                        !col.required
                                                                    )
                                                                        setVisibleColumns(
                                                                            visibleColumns.filter(
                                                                                (c) =>
                                                                                    c !==
                                                                                    col.key,
                                                                            ),
                                                                        );
                                                                }}
                                                                disabled={col.required}
                                                            />
                                                            <Label
                                                                htmlFor={`col-${col.key}`}
                                                                className={cn(
                                                                    col.required &&
                                                                    'text-muted-foreground italic',
                                                                )}
                                                            >
                                                                {col.label}{' '}
                                                                {col.required && '*'}
                                                            </Label>
                                                        </div>
                                                    ))}
                                            </div>

                                            {/* Additional Information Columns */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-sm text-muted-foreground">
                                                        {t('martyrs.additional_information')}
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            id="select-additional"
                                                            checked={areAllAdditionalSelected}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setVisibleColumns([
                                                                        ...new Set([
                                                                            ...visibleColumns,
                                                                            ...additionalKeys,
                                                                        ]),
                                                                    ]);
                                                                } else {
                                                                    const toRemove = additionalKeys.filter((k) => {
                                                                        const col = availableColumns.find((c) => c.key === k);
                                                                        return col ? !col.required : true;
                                                                    });
                                                                    setVisibleColumns(
                                                                        visibleColumns.filter((c) => !toRemove.includes(c)),
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                {availableColumns
                                                    .filter(col => !['id', 'full_name', 'national_id', 'military_rank', 'job_grade', 'marital_status', 'employment_status', 'employer', 'has_martyr_decision', 'agent_name', 'military_number', ...(canViewAttachments ? ['attachments'] : [])].includes(col.key))
                                                    .map((col) => (
                                                        <div
                                                            key={col.key}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Checkbox
                                                                id={`col-${col.key}`}
                                                                checked={visibleColumns.includes(
                                                                    col.key,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) => {
                                                                    if (checked)
                                                                        setVisibleColumns(
                                                                            [
                                                                                ...visibleColumns,
                                                                                col.key,
                                                                            ],
                                                                        );
                                                                    else if (
                                                                        !col.required
                                                                    )
                                                                        setVisibleColumns(
                                                                            visibleColumns.filter(
                                                                                (c) =>
                                                                                    c !==
                                                                                    col.key,
                                                                            ),
                                                                        );
                                                                }}
                                                                disabled={col.required}
                                                            />
                                                            <Label
                                                                htmlFor={`col-${col.key}`}
                                                                className={cn(
                                                                    col.required &&
                                                                    'text-muted-foreground italic',
                                                                )}
                                                            >
                                                                {col.label}{' '}
                                                                {col.required && '*'}
                                                            </Label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    <DialogFooter>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                setVisibleColumns(
                                                    availableColumns.map(
                                                        (c) => c.key,
                                                    ),
                                                )
                                            }
                                        >
                                            {t('martyrs.reset_columns')}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setIsColumnsDialogOpen(false)
                                            }
                                        >
                                            {t('martyrs.done')}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <div className="mx-1 hidden h-6 w-px bg-border md:block" />

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
                                        <DropdownMenuItem
                                            onClick={handleExport}
                                        >
                                            <FileText className="mr-2 h-4 w-4" />{' '}
                                            {t('martyrs.export_excel')}
                                        </DropdownMenuItem>
                                        {latestExportAvailable && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    window.open(
                                                        latestExportUrl || '',
                                                        '_blank',
                                                    )
                                                }
                                            >
                                                <Download className="mr-2 h-4 w-4" />{' '}
                                                {t('martyrs.download_latest')}
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={filteredColumns}
                        data={martyrs.data}
                        columnVisibility={availableColumns.reduce(
                            (acc, col) => ({
                                ...acc,
                                [col.key]: visibleColumns.includes(
                                    col.key,
                                ),
                            }),
                            {},
                        )}
                        enableRowSelection={true}
                        rowSelection={selectedRows}
                        onRowSelectionChange={setSelectedRows}
                    />

                    {/* Pagination */}
                    {martyrs.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                            <div className="order-2 text-sm text-muted-foreground sm:order-1">
                                {t('showing')}{' '}
                                <span className="font-bold text-foreground">
                                    {martyrs.from}
                                </span>{' '}
                                {t('to')}{' '}
                                <span className="font-bold text-foreground">
                                    {martyrs.to}
                                </span>{' '}
                                {t('of')}{' '}
                                <span className="font-bold text-foreground">
                                    {martyrs.total}
                                </span>{' '}
                                {t('records')}
                            </div>
                            <div className="order-1 flex items-center gap-2 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get('/martyrs', {
                                            page: martyrs.current_page - 1,
                                            ...cleanFilters(localFilters),
                                        })
                                    }
                                    disabled={martyrs.current_page === 1}
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
                                        {martyrs.current_page}
                                    </Badge>
                                    <span className="text-muted-foreground">/</span>
                                    <span className="text-sm font-medium">
                                        {martyrs.last_page}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get('/martyrs', {
                                            page: martyrs.current_page + 1,
                                            ...cleanFilters(localFilters),
                                        })
                                    }
                                    disabled={
                                        martyrs.current_page ===
                                        martyrs.last_page
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
                </div>

                {/* Delete Alert Dialog */}
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {t('martyrs.confirm_delete')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-destructive">
                                {t('martyrs.delete_warning_message') ||
                                    'This action cannot be undone. This will permanently delete the martyr record.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    if (deletingId) {
                                        setIsDeleting(true);
                                        try {
                                            await router.delete(
                                                `/martyrs/${deletingId}`,
                                                {
                                                    onSuccess: () => {
                                                        toast({
                                                            title: t(
                                                                'martyrs.deleted_successfully',
                                                            ),
                                                            variant: 'default',
                                                        });
                                                        setDeleteOpen(false);
                                                        setDeletingId(null);
                                                    },
                                                },
                                            );
                                        } finally {
                                            setIsDeleting(false);
                                        }
                                    }
                                }}
                                disabled={isDeleting}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                {isDeleting ? t('deleting') : t('delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </AppLayout>
        </TooltipProvider>
    );
}
