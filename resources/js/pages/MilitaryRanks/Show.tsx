import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Shield, Users } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface MilitaryRank {
    id: number;
    name_ar: string;
    name_en: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    martyrs_count?: number;
}

interface Props {
    militaryRank: MilitaryRank;
}

const DetailItem = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number | boolean;
}) => (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <Icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {label}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {value}
            </p>
        </div>
    </div>
);

export default function Show({ militaryRank }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('military_ranks.title'),
            href: '/military-ranks',
        },
        {
            title: militaryRank.name_ar,
            href: `/military-ranks/${militaryRank.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${t('military_ranks.rank_details')} - ${militaryRank.name_ar}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 p-6 shadow-sm dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <a href="/military-ranks">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t('back')}
                                </a>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {militaryRank.name_ar}
                                </h1>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    {t('military_ranks.rank_details')}
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link
                                href={`/military-ranks/${militaryRank.id}/edit`}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                {t('military_ranks.edit_rank')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <DetailItem
                        icon={Shield}
                        label={t('military_ranks.name_ar')}
                        value={militaryRank.name_ar}
                    />

                    <DetailItem
                        icon={Shield}
                        label={t('military_ranks.name_en')}
                        value={militaryRank.name_en || t('not_available')}
                    />

                    <DetailItem
                        icon={Shield}
                        label={t('military_ranks.order')}
                        value={militaryRank.order}
                    />

                    <DetailItem
                        icon={Shield}
                        label={t('military_ranks.status')}
                        value={
                            militaryRank.is_active ? t('active') : t('inactive')
                        }
                    />

                    {militaryRank.martyrs_count !== undefined && (
                        <DetailItem
                            icon={Users}
                            label={t('military_ranks.martyrs_count')}
                            value={militaryRank.martyrs_count}
                        />
                    )}

                    <DetailItem
                        icon={Shield}
                        label={t('created_at')}
                        value={new Date(
                            militaryRank.created_at,
                        ).toLocaleDateString()}
                    />

                    <DetailItem
                        icon={Shield}
                        label={t('updated_at')}
                        value={new Date(
                            militaryRank.updated_at,
                        ).toLocaleDateString()}
                    />
                </div>

                {/* Martyrs Section */}
                {militaryRank.martyrs_count !== undefined &&
                    militaryRank.martyrs_count > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 p-6 shadow-sm dark:border-sidebar-border">
                            <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                                {t('military_ranks.associated_martyrs')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('military_ranks.martyrs_with_rank', {
                                    count: militaryRank.martyrs_count,
                                })}
                            </p>
                            <div className="mt-4">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/martyrs?military_rank=${militaryRank.id}`}
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        {t('military_ranks.view_martyrs')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
            </div>
        </AppLayout>
    );
}
