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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    Columns,
    Download,
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    address: string;
    children_count: number | null;
    workplace: string | null;
    previous_workplace?: string | null;
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

    // Relation objects
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

    // Wife status fields
    wife_status?: string | null;

    // Relation ids
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

export default function Index({
    martyrs,
    filters,
    maritalStatuses,
    employmentStatuses,
    banks,
    parentsStatuses,
    militaryRanks = [],
    branches = [],
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { toast } = useToast();
    const { can } = usePermissions('martyrs');

    const { can: canAttachments } = usePermissions('attachments');
    const canViewAttachments = canAttachments('canRead');

    const EMPTY = t('martyrs.not_specified') ?? '-';

    // Permission checks
    const canViewDetails = can('canViewDetails');
    const canUpdate = can('canUpdate');
    const canDelete = can('canDelete');
    const canCreate = can('canCreate');
    const canExport = can('canExport');

    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isColumnsDialogOpen, setIsColumnsDialogOpen] = useState(false);
    const [latestExportAvailable, setLatestExportAvailable] = useState<
        boolean | null
    >(null);
    const [latestExportUrl, setLatestExportUrl] = useState<string | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // attachments column navigates to attachments page by martyr id

    const availableColumns = [
        { key: 'id', label: 'ID', required: true },
        { key: 'full_name', label: t('martyrs.full_name'), required: true },
        { key: 'national_id', label: t('martyrs.national_id'), required: true },
        {
            key: 'address',
            label: t('martyrs.address') || 'Address',
            required: false,
        },
        {
            key: 'children_count',
            label: t('martyrs.children_count') || 'Children',
            required: false,
        },
        {
            key: 'workplace',
            label: t('martyrs.workplace') || 'Workplace',
            required: false,
        },
        {
            key: 'previous_workplace',
            label: t('martyrs.previous_workplace') || 'Previous Workplace',
            required: false,
        },
        {
            key: 'military_number',
            label: t('martyrs.military_number'),
            required: false,
        },
        {
            key: 'bank_account_number',
            label: t('martyrs.bank_account_number') || 'Bank Account',
            required: false,
        },
        {
            key: 'agent_name',
            label: t('martyrs.agent_name') || 'Agent',
            required: false,
        },
        {
            key: 'agent_phone',
            label: t('martyrs.agent_phone') || 'Agent Phone',
            required: false,
        },
        {
            key: 'agent_relationship',
            label: t('martyrs.agent_relationship') || 'Agent Relationship',
            required: false,
        },
        {
            key: 'profile_image',
            label: t('martyrs.profile_image') || 'Profile',
            required: false,
        },
        {
            key: 'agent_passport_number',
            label: t('martyrs.agent_passport_number') || 'Agent Passport',
            required: false,
        },
        {
            key: 'national_id_file',
            label: t('martyrs.national_id_file') || 'ID File',
            required: false,
        },
        {
            key: 'art_image',
            label: t('martyrs.art_image') || 'Art',
            required: false,
        },
        {
            key: 'death_date',
            label: t('martyrs.death_date') || 'Death Date',
            required: false,
        },
        {
            key: 'has_martyr_decision',
            label: t('martyrs.decision') || 'Decision',
            required: false,
        },
        {
            key: 'decision_number',
            label: t('martyrs.decision_number') || 'Decision No.',
            required: false,
        },
        {
            key: 'decision_date',
            label: t('martyrs.decision_date') || 'Decision Date',
            required: false,
        },

        {
            key: 'military_rank',
            label: t('martyrs.military_rank'),
            required: false,
        },
        {
            key: 'job_grade',
            label: t('martyrs.job_grade') || 'الدرجة الوظيفية',
            required: false,
        },
        { key: 'bank', label: t('martyrs.bank'), required: false },
        { key: 'branch', label: t('martyrs.branch'), required: false },
        {
            key: 'employment_status',
            label: t('martyrs.employment_status'),
            required: false,
        },
        {
            key: 'parents_status',
            label: t('martyrs.parents_status'),
            required: false,
        },
        {
            key: 'marital_status',
            label: t('martyrs.marital_status'),
            required: false,
        },
        {
            key: 'wife_status',
            label: t('martyrs.wife_status') || 'حالة الزوجة',
            required: false,
        },

        { key: 'status', label: t('martyrs.status'), required: false },
        ...(canViewAttachments
            ? [
                  {
                      key: 'attachments',
                      label: t('martyrs.attachments') || 'Attachments',
                      required: false,
                  },
              ]
            : []),
        { key: 'actions', label: t('martyrs.actions'), required: true },
    ];

    const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
        availableColumns.map((c) => c.key),
    );

    const VISIBLE_COLUMNS_KEY = 'martyrs_visible_columns';

    // Load saved visible columns from localStorage on mount (validate keys & order)
    React.useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            const raw = window.localStorage.getItem(VISIBLE_COLUMNS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as string[];
                if (
                    Array.isArray(parsed) &&
                    parsed.every((p) => typeof p === 'string')
                ) {
                    const allowed = new Set(availableColumns.map((c) => c.key));
                    // Keep only known keys and preserve order via availableColumns
                    const parsedFiltered = parsed.filter((k) => allowed.has(k));

                    // Ensure required columns are present
                    const set = new Set(parsedFiltered);
                    availableColumns.forEach((c) => {
                        if (c.required) set.add(c.key);
                    });

                    // Order according to availableColumns
                    const ordered = availableColumns
                        .map((c) => (set.has(c.key) ? c.key : null))
                        .filter(Boolean) as string[];

                    setVisibleColumns(
                        ordered.length
                            ? ordered
                            : availableColumns.map((c) => c.key),
                    );
                }
            }
        } catch (e) {
            // ignore
        }
    }, []);

    // Check latest export availability
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch('/martyrs/export/status', {
                    credentials: 'same-origin',
                });
                if (!mounted) return;
                if (!res.ok) {
                    setLatestExportAvailable(false);
                    return;
                }
                const data = await res.json();
                setLatestExportAvailable(Boolean(data.exists));
                setLatestExportUrl(data.url ?? null);
            } catch (e) {
                if (!mounted) return;
                setLatestExportAvailable(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // Persist visible columns whenever they change
    React.useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            window.localStorage.setItem(
                VISIBLE_COLUMNS_KEY,
                JSON.stringify(visibleColumns),
            );
        } catch (e) {
            // ignore
        }
    }, [visibleColumns]);

    const handleColumnToggle = (columnKey: string, checked: boolean) => {
        if (checked) {
            setVisibleColumns((prev) => [...prev, columnKey]);
        } else {
            // Don't allow removing required columns
            const column = availableColumns.find(
                (col) => col.key === columnKey,
            );
            if (column?.required) return;
            setVisibleColumns((prev) =>
                prev.filter((col) => col !== columnKey),
            );
        }
    };

    const resetColumns = () => {
        setVisibleColumns(availableColumns.map((c) => c.key));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.title'),
            href: '/martyrs',
        },
    ];

    const handleFilterChange = (key: keyof Filters, value: string) => {
        const newValue = value === 'all' ? '' : value;
        const newFilters = { ...localFilters, [key]: newValue };
        setLocalFilters(newFilters);
    };

    const handleSearchChange = (value: string) => {
        handleFilterChange('search', value);
    };

    const cleanFilters = (filters: Filters) => {
        return Object.entries(filters).reduce<Record<string, string>>(
            (acc, [k, v]) => {
                if (v === null || v === undefined) return acc;
                if (typeof v === 'string' && v.trim() === '') return acc;
                acc[k] = v as string;
                return acc;
            },
            {},
        );
    };

    // Debounce router calls when filters change
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            const payload = cleanFilters(localFilters);
            router.get('/martyrs', payload, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [localFilters]);

    const clearFilters = () => {
        const emptyFilters: Filters = {};
        setLocalFilters(emptyFilters);
        router.get('/martyrs', cleanFilters(emptyFilters), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <Badge variant="default">
                        {t('martyrs.status.active')}
                    </Badge>
                );
            case 'inactive':
                return (
                    <Badge variant="secondary">
                        {t('martyrs.status.inactive')}
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="outline">
                        {t('martyrs.status.pending')}
                    </Badge>
                );
            case 'complete':
                return (
                    <Badge
                        variant="default"
                        className="border-green-200 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-white"
                    >
                        {t('martyrs.status.complete')}
                    </Badge>
                );
            case 'incomplete':
                return (
                    <Badge
                        variant="destructive"
                        className="border-red-200 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-white"
                    >
                        {t('martyrs.status.incomplete')}
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getDecisionBadge = (hasDecision: boolean) => {
        return hasDecision ? (
            <Badge variant="default">{t('martyrs.has_decision')}</Badge>
        ) : (
            <Badge variant="destructive">{t('martyrs.no_decision')}</Badge>
        );
    };

    const columns = React.useMemo<ColumnDef<Martyr, any>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: t('ID') || 'ID',
                cell: ({ row }) => (
                    <span className="font-mono">{row.original.id}</span>
                ),
            },
            {
                id: 'full_name',
                accessorKey: 'full_name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        {t('martyrs.full_name')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const m = row.original;
                    return (
                        <div className="flex flex-col">
                            <span>{m.full_name}</span>
                            {m.agent_name && (
                                <span className="text-sm text-muted-foreground">
                                    {t('martyrs.agent')}: {m.agent_name}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'national_id',
                accessorKey: 'national_id',
                header: t('martyrs.national_id'),
                cell: ({ row }) => <span>{row.original.national_id}</span>,
            },
            {
                id: 'address',
                accessorKey: 'address',
                header: t('martyrs.address') || 'Address',
                cell: ({ row }) => <span>{row.original.address || '-'}</span>,
            },
            {
                id: 'children_count',
                accessorKey: 'children_count',
                header: t('martyrs.children_count') || 'Children',
                cell: ({ row }) => (
                    <span>{row.original.children_count ?? '-'}</span>
                ),
            },
            {
                id: 'workplace',
                accessorKey: 'workplace',
                header: t('martyrs.workplace') || 'Workplace',
                cell: ({ row }) => <span>{row.original.workplace || '-'}</span>,
            },
            {
                id: 'previous_workplace',
                accessorKey: 'previous_workplace',
                header: t('martyrs.previous_workplace') || 'Previous Workplace',
                cell: ({ row }) => (
                    <span>
                        {(row.original as any).previous_workplace || '-'}
                    </span>
                ),
            },
            {
                id: 'bank_account_number',
                accessorKey: 'bank_account_number',
                header: t('martyrs.bank_account_number') || 'Bank Account',
                cell: ({ row }) => (
                    <span>
                        {(row.original as any).bank_account_number || '-'}
                    </span>
                ),
            },
            {
                id: 'agent_name',
                accessorKey: 'agent_name',
                header: t('martyrs.agent_name') || 'Agent',
                cell: ({ row }) => (
                    <span>{row.original.agent_name || '-'}</span>
                ),
            },
            {
                id: 'agent_phone',
                accessorKey: 'agent_phone',
                header: t('martyrs.agent_phone') || 'Agent Phone',
                cell: ({ row }) => (
                    <span>{row.original.agent_phone || '-'}</span>
                ),
            },
            {
                id: 'agent_relationship',
                accessorKey: 'agent_relationship',
                header: t('martyrs.agent_relationship') || 'Agent Relationship',
                cell: ({ row }) => (
                    <span>
                        {(row.original as any).agent_relationship || '-'}
                    </span>
                ),
            },
            {
                id: 'profile_image',
                accessorKey: 'profile_image',
                header: t('martyrs.profile_image') || 'Profile',
                cell: ({ row }) =>
                    row.original.profile_image ? (
                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                        <img
                            src={row.original.profile_image}
                            alt="profile"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    ),
            },
            {
                id: 'agent_passport_number',
                accessorKey: 'agent_passport_number',
                header: t('martyrs.agent_passport_number') || 'Agent Passport',
                cell: ({ row }) => (
                    <span>
                        {(row.original as any).agent_passport_number || '-'}
                    </span>
                ),
            },
            {
                id: 'national_id_file',
                accessorKey: 'national_id_file',
                header: t('martyrs.national_id_file') || 'ID File',
                cell: ({ row }) =>
                    (row.original as any).national_id_file ? (
                        <a
                            href={(row.original as any).national_id_file}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                        >
                            {t('martyrs.view_file') || 'View'}
                        </a>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    ),
            },
            {
                id: 'art_image',
                accessorKey: 'art_image',
                header: t('martyrs.art_image') || 'Art',
                cell: ({ row }) =>
                    (row.original as any).art_image ? (
                        <img
                            src={(row.original as any).art_image}
                            alt="art"
                            className="h-8 w-12 object-cover"
                        />
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    ),
            },
            {
                id: 'marital_status',
                accessorKey: 'marital_status',
                header: t('martyrs.marital_status'),
                cell: ({ row }) => {
                    const martyr = row.original;
                    return martyr.marital_status ? (
                        <Badge variant="outline">
                            {isRTL
                                ? martyr.marital_status.name_ar
                                : martyr.marital_status.name_en}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    );
                },
            },
            {
                id: 'wife_status',
                accessorKey: 'wife_status',
                header: t('martyrs.wife_status') || 'حالة الزوجة',
                cell: ({ row }) => {
                    const martyr = row.original;
                    // Show wife status only for married martyrs (marital_status_id = 1)
                    if (martyr.marital_status_id !== 1) {
                        return <span className="text-muted-foreground">-</span>;
                    }

                    if (martyr.wife_status) {
                        return (
                            <Badge
                                variant={
                                    martyr.wife_status === 'متزوجة'
                                        ? 'destructive'
                                        : 'secondary'
                                }
                            >
                                {martyr.wife_status}
                            </Badge>
                        );
                    }

                    return <span className="text-muted-foreground">-</span>;
                },
            },
            // removed technical *_id columns from UI; keep relation objects below
            {
                id: 'employment_status',
                accessorKey: 'employment_status',
                header: t('martyrs.employment_status'),
                cell: ({ row }) =>
                    row.original.employment_status ? (
                        <Badge variant="outline">
                            {row.original.employment_status.name}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    ),
            },

            {
                id: 'military_number',
                accessorKey: 'military_number',
                header: t('martyrs.military_number'),
                cell: ({ row }) => (
                    <span>
                        {row.original.military_number ||
                            t('martyrs.not_specified')}
                    </span>
                ),
            },

            {
                id: 'military_rank',
                accessorKey: 'military_rank',
                header: t('martyrs.military_rank'),
                cell: ({ row }) => (
                    <span>
                        {row.original.military_rank
                            ? isRTL
                                ? row.original.military_rank.name_ar
                                : row.original.military_rank.name_en
                            : t('martyrs.not_specified')}
                    </span>
                ),
            },
            {
                id: 'job_grade',
                accessorKey: 'job_grade',
                header: t('martyrs.job_grade') || 'الدرجة الوظيفية',
                cell: ({ row }) => {
                    const martyr = row.original as any;
                    const j = martyr.job_grade;
                    if (!j)
                        return <span className="text-muted-foreground">-</span>;
                    if (typeof j === 'string') return <span>{j}</span>;
                    return (
                        <span>
                            {isRTL
                                ? (j.name_ar ?? j.name_en)
                                : (j.name_en ?? j.name_ar)}
                        </span>
                    );
                },
            },

            {
                id: 'bank',
                accessorKey: 'bank',
                header: t('martyrs.bank'),
                cell: ({ row }) => (
                    <span>
                        {row.original.bank
                            ? row.original.bank.name_ar
                            : t('martyrs.not_specified')}
                    </span>
                ),
            },

            {
                id: 'branch',
                accessorKey: 'branch',
                header: t('martyrs.branch'),
                cell: ({ row }) => (
                    <span>
                        {row.original.branch
                            ? row.original.branch.name_ar
                            : t('martyrs.not_specified')}
                    </span>
                ),
            },

            {
                id: 'parents_status',
                accessorKey: 'parents_status',
                header: t('martyrs.parents_status'),
                cell: ({ row }) => (
                    <span>
                        {row.original.parents_status
                            ? isRTL
                                ? row.original.parents_status.name_ar
                                : row.original.parents_status.name_en
                            : '-'}
                    </span>
                ),
            },
            {
                id: 'death_date',
                accessorKey: 'death_date',
                header: t('martyrs.death_date') || 'Death Date',
                cell: ({ row }) => (
                    <span>{row.original.death_date || '-'}</span>
                ),
            },
            {
                id: 'has_martyr_decision',
                accessorKey: 'has_martyr_decision',
                header: t('martyrs.decision'),
                cell: ({ row }) =>
                    getDecisionBadge(row.original.has_martyr_decision),
            },
            {
                id: 'decision_number',
                accessorKey: 'decision_number',
                header: t('martyrs.decision_number') || 'Decision No.',
                cell: ({ row }) => (
                    <span>{row.original.decision_number || '-'}</span>
                ),
            },
            {
                id: 'decision_date',
                accessorKey: 'decision_date',
                header: t('martyrs.decision_date') || 'Decision Date',
                cell: ({ row }) => (
                    <span>{(row.original as any).decision_date || '-'}</span>
                ),
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: t('martyrs.status'),
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                id: 'attachments',
                accessorKey: 'attachments',
                header: t('martyrs.attachments') || 'Attachments',
                cell: ({ row }) => {
                    const martyr = row.original;
                    return (
                        <Link
                            href={`/martyrs/${martyr.id}/attachments`}
                            className="underline"
                        >
                            {t('martyrs.attachments') || 'Attachments'}
                        </Link>
                    );
                },
            },
            {
                id: 'actions',
                header: t('martyrs.actions'),
                cell: ({ row }) => {
                    const martyr = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">
                                        {t('martyrs.open_menu')}
                                    </span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {canViewDetails && (
                                    <DropdownMenuItem asChild>
                                        <Link href={`/martyrs/${martyr.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            {t('martyrs.view')}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {canUpdate && (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/martyrs/${martyr.id}/edit`}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            {t('martyrs.edit')}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {canDelete && (
                                    <DropdownMenuItem
                                        onSelect={() => {
                                            setDeletingId(martyr.id);
                                            setDeleteOpen(true);
                                        }}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                        {t('martyrs.delete')}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [t, isRTL],
    );

    const filteredColumns = React.useMemo(() => {
        return columns.filter((col) => {
            const id = (col as any).id ?? (col as any).accessorKey;
            return visibleColumns.includes(id as string);
        });
    }, [columns, visibleColumns]);

    const columnVisibility = React.useMemo(() => {
        const map: Record<string, boolean> = {};
        columns.forEach((col) => {
            const id = (col as any).id ?? (col as any).accessorKey;
            map[id as string] = visibleColumns.includes(id as string);
        });
        return map;
    }, [columns, visibleColumns]);

    const handleColumnVisibilityChange = (vis: any) => {
        // Preserve ordering defined in availableColumns when visibility changes
        const visible = availableColumns
            .map((c) => c.key)
            .filter((k) => (vis as any)[k]);
        setVisibleColumns(visible);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('martyrs.title')} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t('martyrs.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('martyrs.description', { count: martyrs.total })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog
                            open={isColumnsDialogOpen}
                            onOpenChange={setIsColumnsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Columns className="mr-2 h-4 w-4" />
                                    {t('martyrs.show_columns')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        {t('martyrs.show_columns')}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {t('martyrs.show_columns_description')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {availableColumns.map((column) => (
                                            <div
                                                key={column.key}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={column.key}
                                                    checked={visibleColumns.includes(
                                                        column.key,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        handleColumnToggle(
                                                            column.key,
                                                            checked as boolean,
                                                        )
                                                    }
                                                    disabled={column.required}
                                                />
                                                <Label
                                                    htmlFor={column.key}
                                                    className={cn(
                                                        'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                                                        column.required &&
                                                            'text-muted-foreground',
                                                    )}
                                                >
                                                    {column.label}
                                                    {column.required && (
                                                        <span className="ml-1 text-red-500">
                                                            *
                                                        </span>
                                                    )}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <Button
                                            onClick={resetColumns}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {t('martyrs.reset_columns')}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setIsColumnsDialogOpen(false)
                                            }
                                            size="sm"
                                        >
                                            {t('martyrs.done')}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        {canCreate && (
                            <Button asChild>
                                <Link href="/martyrs/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('martyrs.create')}
                                </Link>
                            </Button>
                        )}
                        {canExport && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        const payload = cleanFilters(
                                            localFilters,
                                        ) as Record<string, string>;
                                        try {
                                            const params = new URLSearchParams(
                                                payload as Record<
                                                    string,
                                                    string
                                                >,
                                            );
                                            params.append('sync', '1');
                                            // include selected columns as comma-separated
                                            if (
                                                Array.isArray(visibleColumns) &&
                                                visibleColumns.length
                                            ) {
                                                params.append(
                                                    'columns',
                                                    visibleColumns.join(','),
                                                );
                                            }
                                            const url = `/martyrs/export?${params.toString()}`;

                                            const res = await fetch(url, {
                                                credentials: 'same-origin',
                                            });
                                            if (!res.ok)
                                                throw new Error(
                                                    'Export failed',
                                                );

                                            const blob = await res.blob();
                                            const filename = `martyrs_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`;
                                            const link =
                                                document.createElement('a');
                                            link.href =
                                                URL.createObjectURL(blob);
                                            link.download = filename;
                                            document.body.appendChild(link);
                                            link.click();
                                            setTimeout(() => {
                                                try {
                                                    URL.revokeObjectURL(
                                                        link.href,
                                                    );
                                                } catch (e) {}
                                                try {
                                                    link.remove();
                                                } catch (e) {}
                                            }, 1000);
                                        } catch (e) {
                                            // Try POST fetch that requests a synchronous download (useful if GET fails)
                                            try {
                                                const postUrl =
                                                    '/martyrs/export';
                                                const body = {
                                                    ...payload,
                                                    columns: visibleColumns,
                                                    sync: 1,
                                                };
                                                const res = await fetch(
                                                    postUrl,
                                                    {
                                                        method: 'POST',
                                                        credentials:
                                                            'same-origin',
                                                        headers: {
                                                            'Content-Type':
                                                                'application/json',
                                                            'X-Requested-With':
                                                                'XMLHttpRequest',
                                                        },
                                                        body: JSON.stringify(
                                                            body,
                                                        ),
                                                    },
                                                );

                                                if (!res.ok)
                                                    throw new Error(
                                                        'Export failed',
                                                    );

                                                const blob = await res.blob();
                                                const filename = `martyrs_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`;
                                                const link =
                                                    document.createElement('a');
                                                link.href =
                                                    URL.createObjectURL(blob);
                                                link.download = filename;
                                                document.body.appendChild(link);
                                                link.click();
                                                setTimeout(() => {
                                                    try {
                                                        URL.revokeObjectURL(
                                                            link.href,
                                                        );
                                                    } catch (e) {}
                                                    try {
                                                        link.remove();
                                                    } catch (e) {}
                                                }, 1000);
                                            } catch (e2) {
                                                // fallback: schedule export job and notify, include visible columns
                                                router.post('/martyrs/export', {
                                                    ...payload,
                                                    columns: visibleColumns,
                                                });
                                                toast(
                                                    t(
                                                        'martyrs.export_scheduled',
                                                    ) ??
                                                        'تم جدولة التصدير، سنوافيك عند الإكتمال',
                                                    { variant: 'default' },
                                                );
                                            }
                                        }
                                    }}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('martyrs.export')}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open(
                                            latestExportUrl ??
                                                '/martyrs/export/latest',
                                            '_blank',
                                        )
                                    }
                                    disabled={latestExportAvailable === false}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('martyrs.download_latest') ||
                                        'تحميل الأحدث'}
                                </Button>
                                {latestExportAvailable === false && (
                                    <span className="self-center text-sm text-muted-foreground">
                                        لا يوجد ملف حديث
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    {t('martyrs.filters.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('martyrs.filters.description')}
                                </CardDescription>
                            </div>
                            <Sheet
                                open={isFiltersOpen}
                                onOpenChange={setIsFiltersOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        {t('martyrs.filters.advanced')}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side={isRTL ? 'left' : 'right'}
                                    className="w-full sm:max-w-lg"
                                >
                                    <SheetHeader>
                                        <SheetTitle>
                                            {t('martyrs.filters.advanced')}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {t(
                                                'martyrs.filters.advanced_description',
                                            )}
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-4 py-4">
                                        {/* Advanced Filters */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="marital_status">
                                                    {t(
                                                        'martyrs.marital_status',
                                                    )}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.marital_status_id ||
                                                        'all'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'marital_status_id',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'martyrs.select_marital_status',
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('martyrs.all')}
                                                        </SelectItem>
                                                        {maritalStatuses.map(
                                                            (status) => (
                                                                <SelectItem
                                                                    key={
                                                                        status.id
                                                                    }
                                                                    value={status.id.toString()}
                                                                >
                                                                    {isRTL
                                                                        ? status.name_ar
                                                                        : status.name_en}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="employment_status">
                                                    {t(
                                                        'martyrs.employment_status',
                                                    )}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.employment_status_id ||
                                                        'all'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'employment_status_id',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'martyrs.select_employment_status',
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('martyrs.all')}
                                                        </SelectItem>
                                                        {employmentStatuses.map(
                                                            (status) => (
                                                                <SelectItem
                                                                    key={
                                                                        status.id
                                                                    }
                                                                    value={status.id.toString()}
                                                                >
                                                                    {
                                                                        status.name
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="bank">
                                                    {t('martyrs.bank')}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.bank_id ||
                                                        'all'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'bank_id',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'martyrs.select_bank',
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('martyrs.all')}
                                                        </SelectItem>
                                                        {banks.map((bank) => (
                                                            <SelectItem
                                                                key={bank.id}
                                                                value={bank.id.toString()}
                                                            >
                                                                {bank.name_ar}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="parents_status">
                                                    {t(
                                                        'martyrs.parents_status',
                                                    )}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.parents_status_id ||
                                                        'all'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'parents_status_id',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'martyrs.select_parents_status',
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('martyrs.all')}
                                                        </SelectItem>
                                                        {parentsStatuses.map(
                                                            (status) => (
                                                                <SelectItem
                                                                    key={
                                                                        status.id
                                                                    }
                                                                    value={status.id.toString()}
                                                                >
                                                                    {isRTL
                                                                        ? status.name_ar
                                                                        : status.name_en}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="military_number">
                                                    {t(
                                                        'martyrs.military_number',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="military_number"
                                                    placeholder={t(
                                                        'martyrs.military_number',
                                                    )}
                                                    value={
                                                        localFilters.military_number ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            'military_number',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="military_rank">
                                                    {t('martyrs.military_rank')}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.military_rank ||
                                                        'all'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'military_rank',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                t(
                                                                    'martyrs.select_military_rank',
                                                                ) ||
                                                                t(
                                                                    'martyrs.military_rank',
                                                                )
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('martyrs.all')}
                                                        </SelectItem>
                                                        {militaryRanks.map(
                                                            (rank) => (
                                                                <SelectItem
                                                                    key={
                                                                        rank.id
                                                                    }
                                                                    value={rank.id.toString()}
                                                                >
                                                                    {isRTL
                                                                        ? rank.name_ar
                                                                        : rank.name_en}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="branch">
                                                    {t('martyrs.branch')}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.branch ||
                                                        'all'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'branch',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                t(
                                                                    'martyrs.select_branch',
                                                                ) ||
                                                                t(
                                                                    'martyrs.branch',
                                                                )
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('martyrs.all')}
                                                        </SelectItem>
                                                        {branches.map((b) => (
                                                            <SelectItem
                                                                key={b.id}
                                                                value={b.id.toString()}
                                                            >
                                                                {b.name_ar}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="decision_number">
                                                    {t(
                                                        'martyrs.decision_number',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="decision_number"
                                                    placeholder={t(
                                                        'martyrs.decision_number',
                                                    )}
                                                    value={
                                                        localFilters.decision_number ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            'decision_number',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="death_date_from">
                                                    {t(
                                                        'martyrs.death_date_from',
                                                    ) || 'Death date from'}
                                                </Label>
                                                <Input
                                                    id="death_date_from"
                                                    type="date"
                                                    value={
                                                        localFilters.death_date_from ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            'death_date_from',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="death_date_to">
                                                    {t(
                                                        'martyrs.death_date_to',
                                                    ) || 'Death date to'}
                                                </Label>
                                                <Input
                                                    id="death_date_to"
                                                    type="date"
                                                    value={
                                                        localFilters.death_date_to ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            'death_date_to',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="has_decision">
                                                    {t(
                                                        'martyrs.has_martyr_decision',
                                                    )}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.has_martyr_decision ||
                                                        'all'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'has_martyr_decision',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'martyrs.select_decision',
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('martyrs.all')}
                                                        </SelectItem>
                                                        <SelectItem value="1">
                                                            {t('martyrs.yes')}
                                                        </SelectItem>
                                                        <SelectItem value="0">
                                                            {t('martyrs.no')}
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sort">
                                                    {t('martyrs.sort_by')}
                                                </Label>
                                                <Select
                                                    value={
                                                        localFilters.sort ||
                                                        '-created_at'
                                                    }
                                                    onValueChange={(value) =>
                                                        handleFilterChange(
                                                            'sort',
                                                            value,
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

                                        <Separator />

                                        <Button
                                            onClick={clearFilters}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            {t('martyrs.filters.clear_all')}
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t(
                                            'martyrs.search_placeholder',
                                        )}
                                        value={localFilters.search || ''}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary">
                                    {t('martyrs.results', {
                                        count: martyrs.total,
                                    })}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delete confirmation dialog */}
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {t('martyrs.confirm_delete') ||
                                    t('common.delete')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('martyrs.confirm_delete') ||
                                    'هل أنت متأكد من حذف هذا الشهيد؟'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                {t('martyrs.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (!deletingId) return;
                                    router.delete(`/martyrs/${deletingId}`, {
                                        onSuccess: () => {
                                            toast(
                                                t(
                                                    'martyrs.deleted_successfully',
                                                ) || 'تم حذف الشهيد بنجاح',
                                                { variant: 'success' },
                                            );
                                            setDeleteOpen(false);
                                        },
                                        onError: () => {
                                            toast(t('common.error'), {
                                                variant: 'destructive',
                                            });
                                        },
                                    });
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {t('martyrs.delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* attachments column navigates to attachments page; upload handled on separate page */}

                {/* Table */}
                <Card>
                    <CardContent className="p-6">
                        <DataTable
                            columns={filteredColumns}
                            data={martyrs.data}
                            showPagination={false}
                            columnVisibility={columnVisibility}
                            onColumnVisibilityChange={
                                handleColumnVisibilityChange
                            }
                        />
                    </CardContent>
                </Card>

                {/* Pagination */}
                {martyrs.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {t('martyrs.pagination.showing', {
                                from: martyrs.from,
                                to: martyrs.to,
                                total: martyrs.total,
                            })}
                        </p>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={
                                            martyrs.current_page > 1
                                                ? `/martyrs?page=${martyrs.current_page - 1}`
                                                : undefined
                                        }
                                        className={cn(
                                            martyrs.current_page <= 1 &&
                                                'pointer-events-none opacity-50',
                                        )}
                                    />
                                </PaginationItem>

                                {Array.from(
                                    { length: Math.min(5, martyrs.last_page) },
                                    (_, i) => {
                                        const page =
                                            Math.max(
                                                1,
                                                martyrs.current_page - 2,
                                            ) + i;
                                        if (page > martyrs.last_page)
                                            return null;

                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href={`/martyrs?page=${page}`}
                                                    isActive={
                                                        page ===
                                                        martyrs.current_page
                                                    }
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    },
                                )}

                                {martyrs.current_page <
                                    martyrs.last_page - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href={
                                            martyrs.current_page <
                                            martyrs.last_page
                                                ? `/martyrs?page=${martyrs.current_page + 1}`
                                                : undefined
                                        }
                                        className={cn(
                                            martyrs.current_page >=
                                                martyrs.last_page &&
                                                'pointer-events-none opacity-50',
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
