import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import LanguageSelector from '@/components/language-selector';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editLanguage } from '@/routes/language';
import { useTranslation } from 'react-i18next';

export default function Language() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('language_settings'),
            href: editLanguage().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('language_settings')} />

            <h1 className="sr-only">{t('language_settings')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('language_settings')}
                        description={t('update_account_language')}
                    />
                    <LanguageSelector />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}