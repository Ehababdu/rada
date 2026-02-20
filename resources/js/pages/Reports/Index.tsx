import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Icons
import { Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

// Types
import { type BreadcrumbItem } from '@/types';

interface Props {
    stats: {
        total_martyrs: number;
        total_promotions: number;
        total_compensations: number;
        pending_promotions: number;
        overdue_promotions: number;
        completed_promotions: number;
    };
    martyrsByRank: Array<{
        rank: string;
        count: number;
    }>;
    promotionsByYear: Array<{
        year: number;
        count: number;
    }>;
    compensationsByMonth: Array<{
        month: string;
        count: number;
        total_amount: number;
    }>;
    recentPromotions: Array<{
        id: number;
        martyr: {
            full_name: string;
        };
        promotionRank: {
            name_ar: string;
        };
        status: string;
        next_due_date: string;
    }>;
    recentCompensations: Array<{
        id: number;
        martyr: {
            full_name: string;
        };
        amount: number;
        receipt_date: string;
    }>;
}

export default function Index({
    stats,
    martyrsByRank,
    promotionsByYear,
    compensationsByMonth,
    recentPromotions,
    recentCompensations,
}: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('reports.title'),
            href: '/reports',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('reports.title')} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('reports.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('reports.description')}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('reports.total_martyrs')}
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_martyrs}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('reports.martyrs_registered')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('reports.total_promotions')}
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_promotions}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('reports.promotions_total')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('reports.total_compensations')}
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_compensations}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('reports.compensations_total')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('reports.pending_promotions')}
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_promotions}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('reports.promotions_pending')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Martyrs by Rank */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reports.martyrs_by_rank')}</CardTitle>
                            <CardDescription>
                                {t('reports.martyrs_by_rank_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {martyrsByRank.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{item.rank}</span>
                                        <span className="font-medium">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Promotions by Year */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reports.promotions_by_year')}</CardTitle>
                            <CardDescription>
                                {t('reports.promotions_by_year_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {promotionsByYear.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{item.year}</span>
                                        <span className="font-medium">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Promotions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reports.recent_promotions')}</CardTitle>
                            <CardDescription>
                                {t('reports.recent_promotions_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentPromotions.slice(0, 5).map((promotion) => (
                                    <div key={promotion.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{promotion.martyr.full_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {promotion.promotionRank?.name_ar || t('common.unknown')}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(promotion.next_due_date).toLocaleDateString('ar')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Compensations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reports.recent_compensations')}</CardTitle>
                            <CardDescription>
                                {t('reports.recent_compensations_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentCompensations.slice(0, 5).map((compensation) => (
                                    <div key={compensation.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{compensation.martyr?.full_name || t('common.unknown')}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {compensation.amount.toLocaleString()} د.ل
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(compensation.receipt_date).toLocaleDateString('ar')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}