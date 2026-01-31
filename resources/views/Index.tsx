/**
 * Martyrs Index Page Component
 * Displays a paginated, filterable, and sortable table of martyrs with advanced search and export capabilities.
 * Uses TanStack Table for performance and Inertia.js for server-side rendering.
 */
import Pagination from '@/components/Pagination';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    SortingState,
    VisibilityState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    AlignJustify,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    MoreHorizontal,
    Plus,
    Rows,
    Search,
    Settings2,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

// Local UI components (use project components)
import { Badge } from '@/components/ui/badge';

interface FilterSelectProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { id: number; name_ar: string; name_en?: string | null }[];
    disabled?: boolean;
}

// Reusable FilterSelect component to reduce duplication
const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    icon,
    value,
    onValueChange,
    placeholder,
    options,
    disabled = false,
}) => (
    <div className="space-y-2">
        <Label className="flex items-center gap-2">
            <Badge
                variant="outline"
                className="flex h-5 w-5 items-center justify-center p-0"
            >
                {icon}
            </Badge>
            {label}
        </Label>
        <Select
            value={value || 'all'}
            onValueChange={onValueChange}
            disabled={disabled}
        >
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{placeholder}</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                        {option.name_ar}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    address: string;
    death_date: string;
    has_martyr_decision: boolean;
    decision_number: string | null;
    decision_date: string | null;
    parents_status: string;
    marital_status: string;
    children_count: number | null;
    employment_status: string;
    workplace: string | null;
    previous_workplace: string | null;
    military_number: string | null;
    military_rank: string;
    bank_name: string;
    bank_account_number: string | null;
    bank_branch: string;
    agent_name: string | null;
    agent_phone: string | null;
    agent_relationship: string | null;
    profile_image: string | null;
    agent_passport_number: string | null;
    national_id_file: string | null;
    art_image: string | null;
    created_at: string;
    updated_at: string;
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
    filters: {
        search: string;
        marital_status_id: string;
        employment_status_id: string;
        bank_id: string;
        branch_id: string;
        death_date_from: string;
        death_date_to: string;
        has_martyr_decision: string;
        parents_status_id: string;
        sort: string;
    };
    maritalStatuses: { id: number; name_ar: string; name_en: string | null }[];
    employmentStatuses: {
        id: number;
        name_ar: string;
        name_en: string | null;
    }[];
    banks: { id: number; name_ar: string; name_en: string | null }[];
    parentsStatuses: { id: number; name_ar: string; name_en: string | null }[];
}

export default React.memo(function Index({
    martyrs,
    filters,
    maritalStatuses,
    employmentStatuses,
    banks,
    parentsStatuses,
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { flash } = usePage<SharedData>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterState, setFilterState] = useState<{
        marital_status_id: string;
        employment_status_id: string;
        bank_id: string;
        branch_id: string;
        death_date_from: string;
        death_date_to: string;
        has_martyr_decision: string;
        parents_status_id: string;
    }>({
        marital_status_id: filters.marital_status_id || '',
        employment_status_id: filters.employment_status_id || '',
        bank_id: filters.bank_id || '',
        branch_id: filters.branch_id || '',
        death_date_from: filters.death_date_from || '',
        death_date_to: filters.death_date_to || '',
        has_martyr_decision: filters.has_martyr_decision || '',
        parents_status_id: filters.parents_status_id || '',
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});
    const [branches, setBranches] = useState<
        { id: number; name_ar: string; name_en: string | null }[]
    >([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const branchesAbortControllerRef = useRef<AbortController | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [tablePadding, setTablePadding] = useState<'compact' | 'comfortable'>(
        'comfortable',
    );
    const searchInProgressRef = useRef(false);
    const searchRequestIdRef = useRef(0);
    const [perPage, setPerPage] = useState(martyrs.per_page || 15);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<
        { id: number; full_name: string; national_id: string }[]
    >([]);
    const globalSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const globalSearchInProgressRef = useRef(false);
    const globalSearchAbortControllerRef = useRef<AbortController | null>(null);
    const isInitialMount = useRef(true);
    const shownFlashes = useRef<Set<string>>(new Set());
    const lastRequestKey = useRef<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [martyrToDelete, setMartyrToDelete] = useState<number | null>(null);

    const bankOptions = useMemo(() => banks || [], [banks]);
    const employmentStatusOptions = useMemo(
        () => employmentStatuses || [],
        [employmentStatuses],
    );
    const maritalStatusOptions = useMemo(
        () => maritalStatuses || [],
        [maritalStatuses],
    );
    const parentsStatusOptions = useMemo(
        () => parentsStatuses || [],
        [parentsStatuses],
    );
    const branchOptions = useMemo(() => branches || [], [branches]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.title'),
            href: '/martyrs',
        },
    ];

    const columnHelper = createColumnHelper<Martyr>();

    const columns = useMemo<ColumnDef<Martyr, any>[]>(
        () => [
            columnHelper.display({
                id: 'select',
                header: ({ table }: { table: any }) => (
                    <Checkbox
                        checked={table.getIsAllRowsSelected()}
                        onCheckedChange={(value) =>
                            table.toggleAllRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }: { row: any }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
                size: 50,
            }),
            columnHelper.accessor('id', {
                header: t('martyrs.id'), // ترجمة العمود
                cell: (info) => info.getValue(),
                size: 60,
                enableSorting: true,
            }),
            columnHelper.accessor('full_name', {
                header: t('martyrs.full_name'),
                cell: (info) => (
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {info.getValue()}
                    </div>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('national_id', {
                header: t('martyrs.national_id'),
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor('address', {
                header: t('martyrs.address'),
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor('children_count', {
                header: t('martyrs.children_count'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('workplace', {
                header: t('martyrs.workplace'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('previous_workplace', {
                header: t('martyrs.previous_workplace'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('military_number', {
                header: t('martyrs.military_number'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('bank_account_number', {
                header: t('martyrs.bank_account_number'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('agent_name', {
                header: t('martyrs.agent_name'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('agent_phone', {
                header: t('martyrs.agent_phone'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('agent_relationship', {
                header: t('martyrs.agent_relationship'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('profile_image', {
                header: t('martyrs.profile_image'),
                cell: (info) =>
                    info.getValue() ? (
                        <img
                            src={`/storage/${info.getValue()}`}
                            alt="Profile"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        '-'
                    ),
                enableSorting: false,
            }),
            columnHelper.accessor('agent_passport_number', {
                header: t('martyrs.agent_passport_number'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('national_id_file', {
                header: t('martyrs.national_id_file'),
                cell: (info) =>
                    info.getValue() ? (
                        <a
                            href={info.getValue() || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View
                        </a>
                    ) : (
                        '-'
                    ),
                enableSorting: false,
            }),
            columnHelper.accessor('art_image', {
                header: t('martyrs.art_image'),
                cell: (info) =>
                    info.getValue() ? (
                        <a
                            href={info.getValue() || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View
                        </a>
                    ) : (
                        '-'
                    ),
                enableSorting: false,
            }),
            columnHelper.accessor('death_date', {
                header: t('martyrs.death_date'),
                cell: (info) => {
                    const value = info.getValue();
                    return value
                        ? new Date(value).toLocaleDateString(
                              isRTL ? 'ar-SA' : 'en-US',
                          )
                        : '-';
                },
                enableSorting: true,
            }),
            columnHelper.accessor('has_martyr_decision', {
                header: t('martyrs.has_martyr_decision'),
                cell: (info) => (
                    <Badge variant={info.getValue() ? 'default' : 'secondary'}>
                        {info.getValue() ? t('martyrs.yes') : t('martyrs.no')}
                    </Badge>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('decision_number', {
                header: t('martyrs.decision_number'),
                cell: (info) => info.getValue() || '-',
                enableSorting: true,
            }),
            columnHelper.accessor('decision_date', {
                header: t('martyrs.decision_date'),
                cell: (info) => {
                    const value = info.getValue();
                    return value
                        ? new Date(value).toLocaleDateString(
                              isRTL ? 'ar-SA' : 'en-US',
                          )
                        : '-';
                },
                enableSorting: true,
            }),
            columnHelper.accessor('employment_status', {
                header: t('martyrs.employment_status'),
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor('military_rank', {
                header: t('martyrs.military_rank'),
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor('bank_name', {
                header: t('martyrs.bank_name'),
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor('bank_branch', {
                header: t('martyrs.bank_branch'),
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor('parents_status', {
                header: t('martyrs.parents_status'),
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor('marital_status', {
                header: t('martyrs.marital_status'),
                cell: (info) => info.getValue(),
                enableSorting: true,
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
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/martyrs/${info.row.original.id}`}>
                                    <span className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        {t('martyrs.view')}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/martyrs/${info.row.original.id}/attachments`}
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        {t('martyrs.manage_attachments')}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/martyrs/${info.row.original.id}/edit`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        {t('martyrs.edit')}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    handleDelete(info.row.original.id)
                                }
                                className="flex items-center gap-2 text-red-600 dark:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                                {t('martyrs.delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                enableSorting: false,
                enableHiding: false,
            }),
        ],
        [t, isRTL],
    );

    const table = useReactTable<Martyr>({
        data: martyrs.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
        },
        manualPagination: true,
        pageCount: martyrs.last_page,
    });

    /**
     * Handles search with debouncing and prevents duplicate requests
     */
    const handleSearch = useCallback(() => {
        if (searchInProgressRef.current) return;

        const hasAdvancedFilters = Object.values(filterState).some(
            (value) => value !== '',
        );

        const params: Record<string, string> = {
            search: searchTerm,
            ...(hasAdvancedFilters && filterState),
        };

        const key = JSON.stringify(params);
        if (key === lastRequestKey.current) {
            return;
        }
        lastRequestKey.current = key;

        searchInProgressRef.current = true;
        setIsLoading(true);

        // Use request-id dedupe because Inertia visits are not abortable with AbortController
        const myRequestId = ++searchRequestIdRef.current;

        router.get('/martyrs', params, {
            replace: true,
            only: ['martyrs', 'filters'],
            onSuccess: () => {
                // ignore responses from older requests
                if (myRequestId !== searchRequestIdRef.current) {
                    return;
                }
                setIsLoading(false);
                searchInProgressRef.current = false;
            },
            onError: () => {
                // ignore errors from older requests
                if (myRequestId !== searchRequestIdRef.current) {
                    return;
                }
                setIsLoading(false);
                searchInProgressRef.current = false;
                toast(t('errors.search_failed'));
            },
        });
    }, [searchTerm, filterState, router, toast, t]);

    useEffect(() => {
        // Skip search on initial mount if we already have data from server
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Skip if a search is already in progress
        if (searchInProgressRef.current) {
            return;
        }

        // Cancel any pending search
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Skip if search term is empty and no filters are active (prevent unnecessary requests)
        const hasActiveFilters = Object.values(filterState).some(
            (value) => value !== '',
        );
        if (!searchTerm && !hasActiveFilters) {
            return;
        }

        searchTimeoutRef.current = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, filterState, handleSearch]);
    const handleFilterChange = useCallback((key: string, value: string) => {
        const newValue = value === 'all' ? '' : value;
        setFilterState((prev) => {
            const newFilters = { ...prev, [key]: newValue };
            if (key === 'bank_id') {
                newFilters.branch_id = '';
            }
            return newFilters;
        });
    }, []);

    const handleExport = useCallback(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filterState).filter(([_, v]) => v !== ''),
        );
        toast({
            title: t('martyrs.export_processing'),
            description: t('martyrs.export_processing_desc'),
        });
        router.post(
            '/martyrs/export',
            {
                search: searchTerm,
                ...activeFilters,
            },
            {
                onSuccess: () => {
                    toast({
                        title: t('martyrs.export_ready'),
                        description: t('martyrs.export_ready_desc'),
                        action: {
                            label: t('download'),
                            onClick: () => {
                                // Assume the response has the download URL
                                // For now, just show success
                            },
                        },
                    });
                },
                onError: () => {
                    toast({
                        title: t('martyrs.export_failed'),
                        variant: 'destructive',
                    });
                },
            },
        );
    }, [router, toast, t, searchTerm, filterState]);

    const handleDelete = (id: number) => {
        setMartyrToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (martyrToDelete) {
            router.delete(`/martyrs/${martyrToDelete}`, {
                onError: () => {
                    toast(t('martyrs.delete_failed'));
                },
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setMartyrToDelete(null);
                },
            });
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterState({
            marital_status_id: '',
            employment_status_id: '',
            bank_id: '',
            branch_id: '',
            death_date_from: '',
            death_date_to: '',
            has_martyr_decision: '',
            parents_status_id: '',
        });
        router.get(
            '/martyrs',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const hasActiveFilters =
        searchTerm || Object.values(filterState).some((value) => value !== '');

    useEffect(() => {
        if (
            flash?.success &&
            !shownFlashes.current.has(`success-${flash.success}`)
        ) {
            toast(flash.success);
            shownFlashes.current.add(`success-${flash.success}`);
        }
        if (flash?.error && !shownFlashes.current.has(`error-${flash.error}`)) {
            toast(flash.error);
            shownFlashes.current.add(`error-${flash.error}`);
        }
    }, [flash, toast, t]);

    useEffect(() => {
        if (filterState.bank_id) {
            // Cancel any previous request
            if (branchesAbortControllerRef.current) {
                branchesAbortControllerRef.current.abort();
            }
            setLoadingBranches(true);
            branchesAbortControllerRef.current = new AbortController();
            fetch(`/api/banks/${filterState.bank_id}/branches`, {
                signal: branchesAbortControllerRef.current.signal,
            })
                .then((response) => response.json())
                .then((data) => {
                    setBranches(data);
                    setLoadingBranches(false);
                    branchesAbortControllerRef.current = null;
                })
                .catch((error) => {
                    if (error.name !== 'AbortError') {
                        setLoadingBranches(false);
                        toast(t('failed_to_load_branches'));
                        branchesAbortControllerRef.current = null;
                    }
                });
        } else {
            // Cancel any pending request
            if (branchesAbortControllerRef.current) {
                branchesAbortControllerRef.current.abort();
                branchesAbortControllerRef.current = null;
            }
            if (branches.length > 0) {
                setBranches([]);
            }
            if (filterState.branch_id !== '') {
                setFilterState((prev) => ({ ...prev, branch_id: '' }));
            }
        }
    }, [filterState.bank_id, toast, t]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Reset global search state when component unmounts
            if (globalSearchTimeoutRef.current) {
                clearTimeout(globalSearchTimeoutRef.current);
            }
            if (globalSearchAbortControllerRef.current) {
                globalSearchAbortControllerRef.current.abort();
                globalSearchAbortControllerRef.current = null;
            }
            globalSearchInProgressRef.current = false;

            // Cancel any pending search requests
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchInProgressRef.current = false;
        };
    }, []);

    return (
        <TooltipProvider>
            <Head title={t('martyrs.title')} />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col gap-6 p-6">
                    {/* Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <FileText className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                            {t('martyrs.title')}
                                        </h1>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                                            {t('martyrs.manage_martyrs')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setFiltersOpen(!filtersOpen);
                                        }}
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        {t('filters')}
                                        {filtersOpen ? (
                                            <ChevronUp className="ml-2 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => handleExport()}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        {t('martyrs.export')}
                                    </Button>
                                    <Link
                                        href="/martyrs/create"
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('martyrs.add_martyr')}
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Advanced Filters */}
                    <Collapsible
                        open={filtersOpen}
                        onOpenChange={setFiltersOpen}
                    >
                        <CollapsibleContent>
                            <Card>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        <FilterSelect
                                            label={t('martyrs.marital_status')}
                                            icon={
                                                <ChevronDown className="h-3 w-3" />
                                            }
                                            value={
                                                filterState.marital_status_id
                                            }
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    'marital_status_id',
                                                    value,
                                                )
                                            }
                                            placeholder={t(
                                                'martyrs.all_marital_statuses',
                                            )}
                                            options={maritalStatuses}
                                        />

                                        <FilterSelect
                                            label={t(
                                                'martyrs.employment_status',
                                            )}
                                            icon={
                                                <Settings2 className="h-3 w-3" />
                                            }
                                            value={
                                                filterState.employment_status_id
                                            }
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    'employment_status_id',
                                                    value,
                                                )
                                            }
                                            placeholder={t(
                                                'martyrs.all_employment_statuses',
                                            )}
                                            options={employmentStatuses}
                                        />

                                        <FilterSelect
                                            label={t('martyrs.bank_name')}
                                            icon={
                                                <FileText className="h-3 w-3" />
                                            }
                                            value={filterState.bank_id}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    'bank_id',
                                                    value,
                                                )
                                            }
                                            placeholder={t('martyrs.all_banks')}
                                            options={banks}
                                        />

                                        <FilterSelect
                                            label={t('martyrs.bank_branch')}
                                            icon={
                                                <FileText className="h-3 w-3" />
                                            }
                                            value={filterState.branch_id}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    'branch_id',
                                                    value,
                                                )
                                            }
                                            placeholder={t(
                                                'martyrs.all_branches',
                                            )}
                                            options={branchOptions}
                                            disabled={
                                                !filterState.bank_id ||
                                                loadingBranches
                                            }
                                        />

                                        <FilterSelect
                                            label={t('martyrs.parents_status')}
                                            icon={<Users className="h-3 w-3" />}
                                            value={
                                                filterState.parents_status_id
                                            }
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    'parents_status_id',
                                                    value,
                                                )
                                            }
                                            placeholder={t(
                                                'martyrs.all_parents_statuses',
                                            )}
                                            options={parentsStatuses}
                                        />

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="has-martyr-decision"
                                                className="flex items-center gap-2"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="flex h-5 w-5 items-center justify-center p-0"
                                                >
                                                    <CheckCircle className="h-3 w-3" />
                                                </Badge>
                                                {t(
                                                    'martyrs.has_martyr_decision',
                                                )}
                                            </Label>
                                            <Select
                                                value={
                                                    filterState.has_martyr_decision ||
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
                                                            'martyrs.all_decisions',
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        {t(
                                                            'martyrs.all_decisions',
                                                        )}
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
                                            <Label
                                                htmlFor="death-date-from"
                                                className="flex items-center gap-2"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="flex h-5 w-5 items-center justify-center p-0"
                                                >
                                                    <Calendar className="h-3 w-3" />
                                                </Badge>
                                                {t('martyrs.death_date_from')}
                                            </Label>
                                            <Input
                                                id="death-date-from"
                                                type="date"
                                                value={
                                                    filterState.death_date_from
                                                }
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    handleFilterChange(
                                                        'death_date_from',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="death-date-to"
                                                className="flex items-center gap-2"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="flex h-5 w-5 items-center justify-center p-0"
                                                >
                                                    <Calendar className="h-3 w-3" />
                                                </Badge>
                                                {t('martyrs.death_date_to')}
                                            </Label>
                                            <Input
                                                id="death-date-to"
                                                type="date"
                                                value={
                                                    filterState.death_date_to
                                                }
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    handleFilterChange(
                                                        'death_date_to',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    {hasActiveFilters && (
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={resetFilters}
                                            >
                                                <X className="mr-1 h-4 w-4" />
                                                {t('martyrs.reset_search')}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Table */}
                    <Card>
                        <div className="flex items-center justify-between border-b p-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            'martyrs.search_martyrs',
                                        )}
                                        value={searchTerm}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setSearchTerm(e.target.value)}
                                        className="w-64 pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <AlignJustify className="mr-2 h-4 w-4" />
                                            {t('martyrs.padding')}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            {t('martyrs.table_padding')}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setTablePadding('compact')
                                            }
                                        >
                                            <CheckCircle
                                                className={`mr-2 h-4 w-4 ${tablePadding === 'compact' ? 'opacity-100' : 'opacity-0'}`}
                                            />
                                            {t('martyrs.compact')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setTablePadding('comfortable')
                                            }
                                        >
                                            <CheckCircle
                                                className={`mr-2 h-4 w-4 ${tablePadding === 'comfortable' ? 'opacity-100' : 'opacity-0'}`}
                                            />
                                            {t('martyrs.comfortable')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Rows className="mr-2 h-4 w-4" />
                                            {perPage}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            {t('martyrs.rows_per_page')}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {[10, 15, 25, 50, 100].map((size) => (
                                            <DropdownMenuItem
                                                key={size}
                                                onClick={() => {
                                                    setPerPage(size);
                                                    setIsLoading(true);
                                                    router.get(
                                                        '/martyrs',
                                                        { per_page: size },
                                                        {
                                                            preserveState: true,
                                                            replace: true,
                                                            onFinish: () =>
                                                                setIsLoading(
                                                                    false,
                                                                ),
                                                        },
                                                    );
                                                }}
                                            >
                                                <CheckCircle
                                                    className={`mr-2 h-4 w-4 ${perPage === size ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                                {size}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Settings2 className="mr-2 h-4 w-4" />
                                            {t('martyrs.columns')}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            {t('martyrs.toggle_columns')}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {table
                                            .getAllColumns()
                                            .filter((column) =>
                                                column.getCanHide(),
                                            )
                                            .map((column) => {
                                                return (
                                                    <DropdownMenuItem
                                                        key={column.id}
                                                        className="capitalize"
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        <Checkbox
                                                            checked={column.getIsVisible()}
                                                            onCheckedChange={(
                                                                value,
                                                            ) =>
                                                                column.toggleVisibility(
                                                                    !!value,
                                                                )
                                                            }
                                                            aria-label={`Toggle ${column.id} visibility`}
                                                            className="mr-2"
                                                        />
                                                        {column.id === 'select'
                                                            ? t(
                                                                  'martyrs.select',
                                                              )
                                                            : column.id === 'id'
                                                              ? t('martyrs.id')
                                                              : column.id ===
                                                                  'full_name'
                                                                ? t(
                                                                      'martyrs.full_name',
                                                                  )
                                                                : column.id ===
                                                                    'national_id'
                                                                  ? t(
                                                                        'martyrs.national_id',
                                                                    )
                                                                  : column.id ===
                                                                      'address'
                                                                    ? t(
                                                                          'martyrs.address',
                                                                      )
                                                                    : column.id ===
                                                                        'death_date'
                                                                      ? t(
                                                                            'martyrs.death_date',
                                                                        )
                                                                      : column.id ===
                                                                          'has_martyr_decision'
                                                                        ? t(
                                                                              'martyrs.has_martyr_decision',
                                                                          )
                                                                        : column.id ===
                                                                            'decision_number'
                                                                          ? t(
                                                                                'martyrs.decision_number',
                                                                            )
                                                                          : column.id ===
                                                                              'decision_date'
                                                                            ? t(
                                                                                  'martyrs.decision_date',
                                                                              )
                                                                            : column.id ===
                                                                                'parents_status'
                                                                              ? t(
                                                                                    'martyrs.parents_status',
                                                                                )
                                                                              : column.id ===
                                                                                  'marital_status'
                                                                                ? t(
                                                                                      'martyrs.marital_status',
                                                                                  )
                                                                                : column.id ===
                                                                                    'children_count'
                                                                                  ? t(
                                                                                        'martyrs.children_count',
                                                                                    )
                                                                                  : column.id ===
                                                                                      'employment_status'
                                                                                    ? t(
                                                                                          'martyrs.employment_status',
                                                                                      )
                                                                                    : column.id ===
                                                                                        'workplace'
                                                                                      ? t(
                                                                                            'martyrs.workplace',
                                                                                        )
                                                                                      : column.id ===
                                                                                          'previous_workplace'
                                                                                        ? t(
                                                                                              'martyrs.previous_workplace',
                                                                                          )
                                                                                        : column.id ===
                                                                                            'military_number'
                                                                                          ? t(
                                                                                                'martyrs.military_number',
                                                                                            )
                                                                                          : column.id ===
                                                                                              'military_rank'
                                                                                            ? t(
                                                                                                  'martyrs.military_rank',
                                                                                              )
                                                                                            : column.id ===
                                                                                                'bank_name'
                                                                                              ? t(
                                                                                                    'martyrs.bank_name',
                                                                                                )
                                                                                              : column.id ===
                                                                                                  'bank_account_number'
                                                                                                ? t(
                                                                                                      'martyrs.bank_account_number',
                                                                                                  )
                                                                                                : column.id ===
                                                                                                    'bank_branch'
                                                                                                  ? t(
                                                                                                        'martyrs.bank_branch',
                                                                                                    )
                                                                                                  : column.id ===
                                                                                                      'agent_name'
                                                                                                    ? t(
                                                                                                          'martyrs.agent_name',
                                                                                                      )
                                                                                                    : column.id ===
                                                                                                        'agent_phone'
                                                                                                      ? t(
                                                                                                            'martyrs.agent_phone',
                                                                                                        )
                                                                                                      : column.id ===
                                                                                                          'agent_relationship'
                                                                                                        ? t(
                                                                                                              'martyrs.agent_relationship',
                                                                                                          )
                                                                                                        : column.id ===
                                                                                                            'profile_image'
                                                                                                          ? t(
                                                                                                                'martyrs.profile_image',
                                                                                                            )
                                                                                                          : column.id ===
                                                                                                              'agent_passport_number'
                                                                                                            ? t(
                                                                                                                  'martyrs.agent_passport_number',
                                                                                                              )
                                                                                                            : column.id ===
                                                                                                                'national_id_file'
                                                                                                              ? t(
                                                                                                                    'martyrs.national_id_file',
                                                                                                                )
                                                                                                              : column.id ===
                                                                                                                  'art_image'
                                                                                                                ? t(
                                                                                                                      'martyrs.art_image',
                                                                                                                  )
                                                                                                                : column.id ===
                                                                                                                    'created_at'
                                                                                                                  ? t(
                                                                                                                        'martyrs.created_at',
                                                                                                                    )
                                                                                                                  : column.id ===
                                                                                                                      'updated_at'
                                                                                                                    ? t(
                                                                                                                          'martyrs.updated_at',
                                                                                                                      )
                                                                                                                    : column.id}
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Separator />
                        <div className="overflow-x-auto">
                            <Table
                                className={
                                    tablePadding === 'compact'
                                        ? 'text-sm'
                                        : 'text-base'
                                }
                            >
                                <TableHeader>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup: any) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header: any) => (
                                                        <TableHead
                                                            key={header.id}
                                                            className={`text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 ${
                                                                tablePadding ===
                                                                'compact'
                                                                    ? 'px-2 py-2'
                                                                    : 'px-4 py-3'
                                                            }`}
                                                        >
                                                            {header.isPlaceholder ? null : (
                                                                <div
                                                                    className="flex cursor-pointer items-center gap-1 select-none"
                                                                    onClick={header.column.getToggleSortingHandler()}
                                                                >
                                                                    {flexRender(
                                                                        header
                                                                            .column
                                                                            .columnDef
                                                                            .header,
                                                                        header.getContext(),
                                                                    )}
                                                                    {header.column.getCanSort() &&
                                                                        ({
                                                                            asc: (
                                                                                <ArrowUp className="h-4 w-4" />
                                                                            ),
                                                                            desc: (
                                                                                <ArrowDown className="h-4 w-4" />
                                                                            ),
                                                                        }[
                                                                            header.column.getIsSorted() as string
                                                                        ] ?? (
                                                                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                                        ))}
                                                                </div>
                                                            )}
                                                        </TableHead>
                                                    ),
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="text-center"
                                            >
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        </TableRow>
                                    ) : martyrs.data.length > 0 ? (
                                        table
                                            .getRowModel()
                                            .rows.map((row: any) => (
                                                <TableRow
                                                    key={row.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell: any) => (
                                                            <TableCell
                                                                key={cell.id}
                                                                className={`text-sm text-gray-900 dark:text-gray-100 ${
                                                                    tablePadding ===
                                                                    'compact'
                                                                        ? 'px-2 py-2'
                                                                        : 'px-4 py-3'
                                                                }`}
                                                            >
                                                                {flexRender(
                                                                    cell.column
                                                                        .columnDef
                                                                        .cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </TableCell>
                                                        ))}
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                {t('martyrs.no_martyrs')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <Separator />
                        {/* Added record count display and pagination at the bottom */}
                        <div className="flex items-center justify-between p-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {t('showing')} {martyrs.from} {t('to')}{' '}
                                {martyrs.to} {t('of')} {martyrs.total}{' '}
                                {t('records')}
                            </span>
                            {martyrs.last_page > 1 && (
                                <Pagination
                                    currentPage={martyrs.current_page}
                                    totalPages={martyrs.last_page}
                                    onPageChange={(page: number) => {
                                        setIsLoading(true);
                                        router.get(
                                            '/martyrs',
                                            { page },
                                            {
                                                preserveState: true,
                                                replace: true,
                                                onFinish: () =>
                                                    setIsLoading(false),
                                            },
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </Card>
                </div>
            </AppLayout>
            <Dialog
                open={isCommandOpen}
                onOpenChange={(open) => {
                    setIsCommandOpen(open);
                    if (!open) {
                        // Reset global search state when dialog closes
                        setSearchResults([]);
                        if (globalSearchTimeoutRef.current) {
                            clearTimeout(globalSearchTimeoutRef.current);
                        }
                        if (globalSearchAbortControllerRef.current) {
                            globalSearchAbortControllerRef.current.abort();
                            globalSearchAbortControllerRef.current = null;
                        }
                        globalSearchInProgressRef.current = false;
                    }
                }}
            >
                <DialogContent className="p-0">
                    <DialogTitle className="sr-only">
                        {t('martyrs.search_martyrs')}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {t('martyrs.search_description')}
                    </DialogDescription>
                    <Command>
                        <CommandInput
                            placeholder={t('martyrs.search_martyrs')}
                            onValueChange={(value) => {
                                if (globalSearchTimeoutRef.current) {
                                    clearTimeout(
                                        globalSearchTimeoutRef.current,
                                    );
                                }
                                globalSearchTimeoutRef.current = setTimeout(
                                    () => {
                                        if (value.length > 2) {
                                            // Cancel any previous request
                                            if (
                                                globalSearchAbortControllerRef.current
                                            ) {
                                                globalSearchAbortControllerRef.current.abort();
                                            }
                                            // If already in progress, don't start a new one
                                            if (
                                                globalSearchInProgressRef.current
                                            ) {
                                                return;
                                            }
                                            globalSearchInProgressRef.current = true;
                                            globalSearchAbortControllerRef.current =
                                                new AbortController();
                                            fetch(
                                                `/api/martyrs/search?q=${encodeURIComponent(value)}`,
                                                {
                                                    signal: globalSearchAbortControllerRef
                                                        .current.signal,
                                                },
                                            )
                                                .then((response) =>
                                                    response.json(),
                                                )
                                                .then((data) => {
                                                    setSearchResults(data);
                                                    globalSearchInProgressRef.current = false;
                                                    globalSearchAbortControllerRef.current =
                                                        null;
                                                })
                                                .catch((error) => {
                                                    if (
                                                        error.name !==
                                                        'AbortError'
                                                    ) {
                                                        setSearchResults([]);
                                                        globalSearchInProgressRef.current = false;
                                                        globalSearchAbortControllerRef.current =
                                                            null;
                                                    }
                                                });
                                        } else {
                                            // Cancel any pending request
                                            if (
                                                globalSearchAbortControllerRef.current
                                            ) {
                                                globalSearchAbortControllerRef.current.abort();
                                                globalSearchAbortControllerRef.current =
                                                    null;
                                            }
                                            setSearchResults([]);
                                            globalSearchInProgressRef.current = false;
                                        }
                                    },
                                    300,
                                );
                            }}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {t('martyrs.no_results')}
                            </CommandEmpty>
                            <CommandGroup heading={t('martyrs.martyrs')}>
                                {searchResults.map(
                                    (martyr: {
                                        id: number;
                                        full_name: string;
                                        national_id: string;
                                    }) => (
                                        <CommandItem
                                            key={martyr.id}
                                            onSelect={() => {
                                                router.visit(
                                                    `/martyrs/${martyr.id}`,
                                                );
                                                setIsCommandOpen(false);
                                            }}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {martyr.full_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {martyr.national_id}
                                                </div>
                                            </div>
                                        </CommandItem>
                                    ),
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('martyrs.confirm_delete')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('martyrs.confirm_delete_martyr')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>
    );
});
