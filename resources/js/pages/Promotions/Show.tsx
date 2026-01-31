import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Award, Calendar, Edit, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Promotion {
    id: number;
    martyr_id: number;
    martyr_name: string;
    martyr_national_id: string;
    current_rank: string;
    promotion_rank: string;
    promotion_years: number;
    next_due_date: string;
    next_due_date_formatted: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    promotion: Promotion;
}

export default function Show({ promotion }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('promotions.title'),
            href: '/promotions',
        },
        {
            title: `${t('promotions.promotion_details')} - ${promotion.martyr_name}`,
            href: `/promotions/${promotion.id}`,
        },
    ];

    const isOverdue = new Date(promotion.next_due_date) < new Date();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${t('promotions.promotion_details')} - ${promotion.martyr_name}`}
            />

            <div className="flex h-full min-h-screen flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <Link
                        href="/promotions"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {t('promotions.promotion_details')}
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {promotion.martyr_name} -{' '}
                            {promotion.martyr_national_id}
                        </p>
                    </div>
                    <Link href={`/promotions/${promotion.id}/edit`}>
                        <Button className="flex items-center gap-2">
                            <Edit size={16} />
                            {t('edit')}
                        </Button>
                    </Link>
                </div>

                {/* Promotion Details */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Main Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-6 flex items-center gap-3">
                            <div
                                className={`rounded-lg p-3 ${
                                    isOverdue
                                        ? 'bg-red-100 dark:bg-red-800'
                                        : 'bg-blue-100 dark:bg-blue-800'
                                }`}
                            >
                                <Award
                                    size={24}
                                    className={
                                        isOverdue
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-blue-600 dark:text-blue-400'
                                    }
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {t('promotions.promotion_info')}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('promotions.promotion_details')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User size={18} className="text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('promotions.martyr')}
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {promotion.martyr_name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {promotion.martyr_national_id}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('promotions.current_rank')}
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {promotion.current_rank}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('promotions.promotion_rank')}
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {promotion.promotion_rank}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('promotions.promotion_years')}
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {promotion.promotion_years}{' '}
                                        {t('promotions.years')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('promotions.next_due_date')}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Calendar
                                            size={16}
                                            className={
                                                isOverdue
                                                    ? 'text-red-500'
                                                    : 'text-green-500'
                                            }
                                        />
                                        <p
                                            className={`font-medium ${
                                                isOverdue
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-green-600 dark:text-green-400'
                                            }`}
                                        >
                                            {promotion.next_due_date_formatted}
                                        </p>
                                    </div>
                                    {isOverdue && (
                                        <span className="mt-1 inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                                            {t('promotions.overdue')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {promotion.description && (
                                <div>
                                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                        {t('description')}
                                    </p>
                                    <p className="rounded-lg bg-gray-50 p-3 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                                        {promotion.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div
                            className={`rounded-lg border p-6 shadow-sm ${
                                isOverdue
                                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                                    : 'border-green-300 bg-green-50 dark:bg-green-900/20'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-lg p-2 ${
                                        isOverdue
                                            ? 'bg-red-100 dark:bg-red-800'
                                            : 'bg-green-100 dark:bg-green-800'
                                    }`}
                                >
                                    {isOverdue ? (
                                        <Calendar
                                            size={20}
                                            className="text-red-600 dark:text-red-400"
                                        />
                                    ) : (
                                        <Award
                                            size={20}
                                            className="text-green-600 dark:text-green-400"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h3
                                        className={`font-semibold ${isOverdue ? 'text-white' : 'text-green-900 dark:text-green-100'}`}
                                    >
                                        {isOverdue
                                            ? t('promotions.overdue')
                                            : t('promotions.upcoming')}
                                    </h3>
                                    <p
                                        className={`text-sm ${isOverdue ? 'text-white/90' : 'text-green-700 dark:text-green-300'}`}
                                    >
                                        {isOverdue
                                            ? t(
                                                  'promotions.overdue_description',
                                              )
                                            : t(
                                                  'promotions.upcoming_description',
                                              )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {t('promotions.timestamps')}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('promotions.created_at')}
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {promotion.created_at}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('promotions.updated_at')}
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {promotion.updated_at}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
