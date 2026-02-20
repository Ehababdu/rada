import { NotificationProvider } from '@/components/notification-provider';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export default function BaseLayout({ children }: PropsWithChildren) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen">
            {children}
            <NotificationProvider />
        </div>
    );
}
