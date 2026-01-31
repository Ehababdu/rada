import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, DollarSign, Save, User } from 'lucide-react';
import React from 'react';
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
}

interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    military_rank: string;
}

interface Props {
    compensation: Compensation;
    martyrs: Martyr[];
}

export default function Edit({ compensation, martyrs }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { data, setData, put, processing, errors } = useForm({
        martyr_id: compensation.martyr_id,
        recipient_name: compensation.recipient_name,
        recipient_passport_number: compensation.recipient_passport_number,
        amount: compensation.amount.toString(),
        receipt_date: compensation.receipt_date,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('compensations.title'),
            href: '/compensations',
        },
        {
            title: compensation.martyr_name,
            href: `/compensations/${compensation.id}`,
        },
        {
            title: t('edit'),
            href: `/compensations/${compensation.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/compensations/${compensation.id}`);
    };

    const handleMartyrChange = (martyrId: string) => {
        setData('martyr_id', parseInt(martyrId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('edit')} - ${compensation.martyr_name}`} />

            <div className="flex h-full min-h-screen flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <Link
                        href={`/compensations/${compensation.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {t('edit')} {t('compensations.compensation')}
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {compensation.martyr_name} -{' '}
                            {compensation.martyr_national_id}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Martyr Selection */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('compensations.select_martyr')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.martyr_id}
                                onChange={(e) =>
                                    handleMartyrChange(e.target.value)
                                }
                                className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                                    errors.martyr_id
                                        ? 'border-red-500'
                                        : 'border-gray-200 dark:border-gray-600'
                                }`}
                                required
                            >
                                <option value="">
                                    {t('compensations.select_martyr')}
                                </option>
                                {martyrs.map((martyr) => (
                                    <option key={martyr.id} value={martyr.id}>
                                        {martyr.full_name} -{' '}
                                        {martyr.national_id} (
                                        {martyr.military_rank})
                                    </option>
                                ))}
                            </select>
                            {errors.martyr_id && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.martyr_id}
                                </p>
                            )}
                        </div>

                        {/* Recipient Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('compensations.recipient_name')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User
                                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400`}
                                />
                                <input
                                    type="text"
                                    value={data.recipient_name}
                                    onChange={(e) =>
                                        setData(
                                            'recipient_name',
                                            e.target.value,
                                        )
                                    }
                                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pr-4 pl-10'} rounded-lg border bg-white py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                                        errors.recipient_name
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                    placeholder={t(
                                        'compensations.enter_recipient_name',
                                    )}
                                    required
                                />
                            </div>
                            {errors.recipient_name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.recipient_name}
                                </p>
                            )}
                        </div>

                        {/* Recipient Passport Number */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('compensations.recipient_passport_number')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User
                                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400`}
                                />
                                <input
                                    type="text"
                                    value={data.recipient_passport_number}
                                    onChange={(e) =>
                                        setData(
                                            'recipient_passport_number',
                                            e.target.value,
                                        )
                                    }
                                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pr-4 pl-10'} rounded-lg border bg-white py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                                        errors.recipient_passport_number
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                    placeholder={t(
                                        'compensations.enter_recipient_passport_number',
                                    )}
                                    required
                                />
                            </div>
                            {errors.recipient_passport_number && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.recipient_passport_number}
                                </p>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('compensations.amount')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign
                                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400`}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pr-4 pl-10'} rounded-lg border bg-white py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                                        errors.amount
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                    placeholder={t(
                                        'compensations.enter_amount',
                                    )}
                                    required
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Receipt Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('compensations.receipt_date')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar
                                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400`}
                                />
                                <input
                                    type="date"
                                    value={data.receipt_date}
                                    onChange={(e) =>
                                        setData('receipt_date', e.target.value)
                                    }
                                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pr-4 pl-10'} rounded-lg border bg-white py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                                        errors.receipt_date
                                            ? 'border-red-500'
                                            : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                    required
                                />
                            </div>
                            {errors.receipt_date && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.receipt_date}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 border-t border-gray-200 pt-4 dark:border-gray-600">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                <Save size={16} />
                                {processing ? t('martyrs.loading') : t('save')}
                            </Button>
                            <Link href={`/compensations/${compensation.id}`}>
                                <Button type="button" variant="outline">
                                    {t('cancel')}
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
