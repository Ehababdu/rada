import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Calendar,
    DollarSign,
    Edit,
    Trash2,
    User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Compensation {
    id: number;
    martyr_id: number;
    martyr_name: string;
    martyr_national_id: string;
    recipient_name: string;
    recipient_passport_number: string;
    amount: number;
    receipt_date: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    compensation: Compensation;
}

export default function Show({ compensation }: Props) {
    const { t, i18n } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('compensations.title'),
            href: '/compensations',
        },
        {
            title: compensation.martyr_name,
            href: `/compensations/${compensation.id}`,
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            i18n.language === 'ar' ? 'ar-SA' : 'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(
            i18n.language === 'ar' ? 'ar-SA' : 'en-US',
            {
                style: 'currency',
                currency: 'EGP',
            },
        ).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${compensation.martyr_name} - ${t('compensations.compensation')}`}
            />

            <div className="flex h-full min-h-screen flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/compensations"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {t('compensations.compensation_details')}
                            </h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                {compensation.martyr_name} -{' '}
                                {compensation.martyr_national_id}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/compensations/${compensation.id}/edit`}>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Edit size={16} />
                                {t('edit')}
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            className="flex items-center gap-2"
                            onClick={() => {
                                if (
                                    confirm(t('compensations.confirm_delete'))
                                ) {
                                    // Handle delete
                                }
                            }}
                        >
                            <Trash2 size={16} />
                            {t('delete')}
                        </Button>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Martyr Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            {t('compensations.martyr_information')}
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('martyrs.full_name')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {compensation.martyr_name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('martyrs.national_id')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {compensation.martyr_national_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recipient Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                            {t('compensations.recipient_information')}
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('compensations.recipient_name')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {compensation.recipient_name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t(
                                        'compensations.recipient_passport_number',
                                    )}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {compensation.recipient_passport_number}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Compensation Details */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            {t('compensations.compensation_details')}
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('compensations.amount')}
                                </label>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(compensation.amount)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('compensations.receipt_date')}
                                </label>
                                <p className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {formatDate(compensation.receipt_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {t('compensations.metadata')}
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('created_at')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {formatDate(compensation.created_at)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('updated_at')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {formatDate(compensation.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
