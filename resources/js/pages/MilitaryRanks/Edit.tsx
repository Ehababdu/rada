import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import {
    Shield,
    Save,
    ArrowLeft,
} from 'lucide-react';

interface MilitaryRank {
    id: number;
    name_ar: string;
    name_en: string | null;
    order: number;
    is_active: boolean;
}

interface Props {
    militaryRank: MilitaryRank;
}

const FormField = ({
    icon: Icon,
    label,
    children,
    error
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    children: React.ReactNode;
    error?: string;
}) => (
    <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Icon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            {label}
        </Label>
        {children}
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
);

export default function Edit({ militaryRank }: Props) {
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
        {
            title: t('military_ranks.edit'),
            href: `/military-ranks/${militaryRank.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name_ar: militaryRank.name_ar,
        name_en: militaryRank.name_en || '',
        order: militaryRank.order.toString(),
        is_active: militaryRank.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/military-ranks/${militaryRank.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('military_ranks.edit_rank')} - ${militaryRank.name_ar}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <a href={`/military-ranks/${militaryRank.id}`}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('back')}
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {t('military_ranks.edit_rank')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {t('military_ranks.edit_rank_description')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
                            {t('military_ranks.rank_info')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                icon={Shield}
                                label={t('military_ranks.name_ar')}
                                error={errors.name_ar}
                            >
                                <Input
                                    id="name_ar"
                                    value={data.name_ar}
                                    onChange={(e) => setData('name_ar', e.target.value)}
                                    placeholder={t('military_ranks.enter_name_ar')}
                                    className="w-full"
                                />
                            </FormField>

                            <FormField
                                icon={Shield}
                                label={t('military_ranks.name_en')}
                                error={errors.name_en}
                            >
                                <Input
                                    id="name_en"
                                    value={data.name_en}
                                    onChange={(e) => setData('name_en', e.target.value)}
                                    placeholder={t('military_ranks.enter_name_en')}
                                    className="w-full"
                                />
                            </FormField>

                            <FormField
                                icon={Shield}
                                label={t('military_ranks.order')}
                                error={errors.order}
                            >
                                <Input
                                    id="order"
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={(e) => setData('order', e.target.value)}
                                    placeholder={t('military_ranks.enter_order')}
                                    className="w-full"
                                />
                            </FormField>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {t('military_ranks.is_active')}
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <Save className="h-5 w-5" />
                            {processing ? t('saving') : t('military_ranks.update_rank')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}