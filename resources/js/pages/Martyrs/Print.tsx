import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Martyr {
    id: number;
    file_number: string;
    full_name: string;
    national_id: string;
    address: string;
    death_date: string;
    has_martyr_decision: boolean;
    decision_number: string | null;
    decision_date: string | null;
    parents_status_id: number | null;
    marital_status_id: number | null;
    children_count: number | null;
    wife_status: string | null;
    employment_status_id: number | null;
    workplace: string | null;
    previous_workplace: string | null;
    employer_id: number | null;
    employer_location_id: number | null;
    has_previous_workplace: boolean;
    previous_employer_id: number | null;
    previous_employer_location_id: number | null;
    military_number: string | null;
    military_rank_id: number | null;
    bank_id: number | null;
    branch_id: number | null;
    bank_account_number: string | null;
    agent_name: string | null;
    agent_phone: string | null;
    agent_relationship: string | null;
    profile_image: string | null;
    agent_passport_number: string | null;
    created_at: string;
    updated_at: string;
    militaryRank?: { id: number; name_ar: string; name_en: string | null };
    bank?: { id: number; name_ar: string; name_en: string | null };
    branch?: { id: number; name_ar: string; name_en: string | null };
    employmentStatus?: { id: number; name: string };
    parentsStatus?: { id: number; name_ar: string; name_en: string | null };
    maritalStatus?: { id: number; name_ar: string; name_en: string | null };
    employer?: { id: number; name_ar: string; name_en: string | null };
    employerLocation?: { id: number; name_ar: string; name_en: string | null };
    previousEmployer?: { id: number; name_ar: string; name_en: string | null };
    previousEmployerLocation?: { id: number; name_ar: string; name_en: string | null };
}

interface Props {
    martyr: Martyr;
}

export default function Print({ martyr }: Props) {
    const { t } = useTranslation();
    const { data } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.martyrs'),
            href: '/martyrs',
        },
        {
            title: martyr.full_name,
            href: `/martyrs/${martyr.id}`,
        },
        {
            title: t('common.print'),
            href: `/martyrs/${martyr.id}/print`,
        },
    ];

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('martyrs.martyr_details')} - ${martyr.full_name}`} />

            <div className="mx-auto max-w-4xl space-y-6 p-6 print:p-0">
                {/* Print Controls */}
                <div className="flex items-center justify-between print:hidden">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        {t('common.back')}
                    </Button>
                    <Button
                        onClick={handlePrint}
                        className="flex items-center gap-2"
                    >
                        <Printer size={16} />
                        {t('common.print')}
                    </Button>
                </div>

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {t('martyrs.martyr_details')}
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        {martyr.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        {t('martyrs.file_number')}: {martyr.file_number}
                    </p>
                </div>

                {/* Profile Image */}
                {martyr.profile_image && (
                    <div className="flex justify-center">
                        <img
                            src={`/storage/${martyr.profile_image}`}
                            alt={martyr.full_name}
                            className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                )}

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{t('martyrs.basic_info')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('martyrs.full_name')}:
                                </span>
                                <span className="ml-2">{martyr.full_name}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('martyrs.national_id')}:
                                </span>
                                <span className="ml-2">{martyr.national_id}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('martyrs.address')}:
                                </span>
                                <span className="ml-2">{martyr.address}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('martyrs.death_date')}:
                                </span>
                                <span className="ml-2">{formatDate(martyr.death_date)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Martyr Decision */}
                {martyr.has_martyr_decision && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t('martyrs.martyr_decision_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {t('martyrs.decision_number')}:
                                    </span>
                                    <span className="ml-2">{martyr.decision_number}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {t('martyrs.decision_date')}:
                                    </span>
                                    <span className="ml-2">{martyr.decision_date ? formatDate(martyr.decision_date) : '-'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Family Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{t('martyrs.family_status')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('martyrs.parents_status')}:
                                </span>
                                <span className="ml-2">{martyr.parentsStatus?.name_ar || t('martyrs.no_data')}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('martyrs.marital_status')}:
                                </span>
                                <span className="ml-2">{martyr.maritalStatus?.name_ar || t('martyrs.no_data')}</span>
                            </div>
                            {martyr.children_count && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {t('martyrs.children_count')}:
                                    </span>
                                    <span className="ml-2">{martyr.children_count}</span>
                                </div>
                            )}
                            {martyr.wife_status && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        حالة الزوجة:
                                    </span>
                                    <span className="ml-2">{martyr.wife_status}</span>
                                </div>
                            )}
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    لديه مكان عمل سابق:
                                </span>
                                <span className="ml-2">{martyr.has_previous_workplace ? (t('common.yes') !== 'common.yes' ? t('common.yes') : 'نعم') : t('martyrs.no_data')}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Employment Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{t('martyrs.employment_info')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('martyrs.employment_status')}:
                                </span>
                                <span className="ml-2">{martyr.employmentStatus?.name}</span>
                            </div>
                            {martyr.employer && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {t('martyrs.employer')}:
                                    </span>
                                    <span className="ml-2">{martyr.employer.name_ar}</span>
                                </div>
                            )}
                            {martyr.employerLocation && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {t('martyrs.employer_location')}:
                                    </span>
                                    <span className="ml-2">{martyr.employerLocation.name_ar}</span>
                                </div>
                            )}
                            {martyr.workplace && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {t('martyrs.workplace')}:
                                    </span>
                                    <span className="ml-2">{martyr.workplace}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Previous Employment */}
                {martyr.has_previous_workplace && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t('martyrs.previous_employment')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {martyr.previousEmployer && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.previous_employer')}:
                                        </span>
                                        <span className="ml-2">{martyr.previousEmployer.name_ar}</span>
                                    </div>
                                )}
                                {martyr.previousEmployerLocation && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.previous_employer_location')}:
                                        </span>
                                        <span className="ml-2">{martyr.previousEmployerLocation.name_ar}</span>
                                    </div>
                                )}
                                {martyr.previous_workplace && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.previous_workplace')}:
                                        </span>
                                        <span className="ml-2">{martyr.previous_workplace}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Military Information */}
                {martyr.military_rank_id && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t('martyrs.military_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {martyr.military_number && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.military_number')}:
                                        </span>
                                        <span className="ml-2">{martyr.military_number}</span>
                                    </div>
                                )}
                                {martyr.militaryRank && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.military_rank')}:
                                        </span>
                                        <span className="ml-2">{martyr.militaryRank.name_ar}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Banking Information */}
                {(martyr.bank || martyr.branch || martyr.bank_account_number) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t('martyrs.banking_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {martyr.bank && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.bank')}:
                                        </span>
                                        <span className="ml-2">{martyr.bank.name_ar}</span>
                                    </div>
                                )}
                                {martyr.branch && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.branch')}:
                                        </span>
                                        <span className="ml-2">{martyr.branch.name_ar}</span>
                                    </div>
                                )}
                                {martyr.bank_account_number && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.bank_account_number')}:
                                        </span>
                                        <span className="ml-2">{martyr.bank_account_number}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Agent Information */}
                {(martyr.agent_name || martyr.agent_phone || martyr.agent_relationship || martyr.agent_passport_number) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t('martyrs.agent_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {martyr.agent_name && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.agent_name')}:
                                        </span>
                                        <span className="ml-2">{martyr.agent_name}</span>
                                    </div>
                                )}
                                {martyr.agent_phone && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.agent_phone')}:
                                        </span>
                                        <span className="ml-2">{martyr.agent_phone}</span>
                                    </div>
                                )}
                                {martyr.agent_relationship && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.agent_relationship')}:
                                        </span>
                                        <span className="ml-2">{martyr.agent_relationship}</span>
                                    </div>
                                )}
                                {martyr.agent_passport_number && (
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('martyrs.agent_passport_number')}:
                                        </span>
                                        <span className="ml-2">{martyr.agent_passport_number}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
                    <p>{t('common.generated_at')}: {new Date().toLocaleString('ar-EG')}</p>
                </div>
            </div>
        </AppLayout>
    );
}