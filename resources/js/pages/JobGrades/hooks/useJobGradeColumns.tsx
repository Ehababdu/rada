import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { JobGrade } from '../types/job-grade';

export interface UseJobGradeColumnsProps {
    canView: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    isRTL: boolean;
    onDelete: (id: number) => void;
}

export function useJobGradeColumns({
    canView,
    canUpdate,
    canDelete,
    isRTL,
    onDelete,
}: UseJobGradeColumnsProps): ColumnDef<JobGrade>[] {
    const { t } = useTranslation();

    return [
        {
            accessorKey: 'name_ar',
            header: t('job_grades.name_ar'),
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        {row.original.name_ar}
                    </div>
                );
            },
        },
        {
            accessorKey: 'order',
            header: t('job_grades.order'),
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.order}
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: t('job_grades.status'),
            cell: ({ row }) => {
                return (
                    <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                        {row.original.is_active ? t('active') : t('inactive')}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                return (
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {canView && (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/job-grades/${row.original.id}`}>
                                    <Eye className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                        {canUpdate && (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/job-grades/${row.original.id}/edit`}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(row.original.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];
}