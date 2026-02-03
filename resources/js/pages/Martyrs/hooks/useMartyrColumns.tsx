import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

// Icons
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';

import { getBankBranchName, getEmploymentStatusName, getLocalizedName } from '../utils/martyrHelpers';
import type { Martyr } from '../types/martyr';

interface UseMartyrColumnsProps {
    canViewAttachments: boolean;
    canViewDetails: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    isRTL: boolean;
    onDelete: (id: number) => void;
}

export function useMartyrColumns({
    canViewAttachments,
    canViewDetails,
    canUpdate,
    canDelete,
    isRTL,
    onDelete,
}: UseMartyrColumnsProps) {
    const { t } = useTranslation();

    // Columns Configuration - Memoized to prevent unnecessary recalculations
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

    const areAllBasicSelected = useMemo(() =>
        basicKeys.length > 0 && basicKeys.every((k) => visibleColumns.includes(k)),
        [basicKeys, visibleColumns]
    );

    const areSomeBasicSelected = useMemo(() =>
        basicKeys.some((k) => visibleColumns.includes(k)) && !areAllBasicSelected,
        [basicKeys, visibleColumns, areAllBasicSelected]
    );

    const areAllAdditionalSelected = useMemo(() =>
        additionalKeys.length > 0 && additionalKeys.every((k) => visibleColumns.includes(k)),
        [additionalKeys, visibleColumns]
    );

    const areSomeAdditionalSelected = useMemo(() =>
        additionalKeys.some((k) => visibleColumns.includes(k)) && !areAllAdditionalSelected,
        [additionalKeys, visibleColumns, areAllAdditionalSelected]
    );

    // Memoized callbacks to prevent unnecessary re-renders
    const setVisibleColumnsCallback = useCallback((columns: string[]) => {
        setVisibleColumns(columns);
    }, []);

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
                                    onClick={() => onDelete(row.original.id)}
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

    // Filtered Columns - Memoized to prevent unnecessary recalculations
    const filteredColumns = useMemo(
        () =>
            columns.filter(
                (col) =>
                    visibleColumns.includes(col.id as string) || col.id === 'actions',
            ),
        [columns, visibleColumns],
    );

    return {
        availableColumns,
        visibleColumns,
        setVisibleColumns: setVisibleColumnsCallback,
        basicKeys,
        additionalKeys,
        areAllBasicSelected,
        areSomeBasicSelected,
        areAllAdditionalSelected,
        areSomeAdditionalSelected,
        columns,
        filteredColumns,
    };
}