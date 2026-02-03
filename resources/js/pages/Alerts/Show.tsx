import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Bell,
    CheckCircle2,
    Clock,
    XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Alert {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    data: unknown;
    read_at: string | null;
    created_at: string;
    is_read: boolean;
}

interface Props {
    alert: Alert;
}

export default function Show({ alert }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('alerts.title', 'التنبيهات'),
            href: '/alerts',
        },
        {
            title: alert.title,
            href: `/alerts/${alert.id}`,
        },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <XCircle className="h-6 w-6 text-destructive" />;
            case 'warning':
                return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
            case 'success':
                return <CheckCircle2 className="h-6 w-6 text-green-500" />;
            default:
                return <Bell className="h-6 w-6 text-blue-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'error':
                return 'border-red-500/20 bg-red-500/10 text-red-600';
            case 'warning':
                return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600';
            case 'success':
                return 'border-green-500/20 bg-green-500/10 text-green-600';
            default:
                return 'border-blue-500/20 bg-blue-500/10 text-blue-600';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'error':
                return t('alerts.types.error', 'خطأ');
            case 'warning':
                return t('alerts.types.warning', 'تحذير');
            case 'success':
                return t('alerts.types.success', 'نجح');
            default:
                return t('alerts.types.info', 'معلومات');
        }
    };

    const markAsRead = () => {
        if (!alert.is_read) {
            router.post(
                `/alerts/${alert.id}/mark-as-read`,
                {},
                {
                    onSuccess: () => {
                        router.reload({ only: ['alert'] });
                    },
                },
            );
        }
    };

    const markAsUnread = () => {
        if (alert.is_read) {
            router.post(
                `/alerts/${alert.id}/mark-as-unread`,
                {},
                {
                    onSuccess: () => {
                        router.reload({ only: ['alert'] });
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${t('alerts.title', 'التنبيهات')} - ${alert.title}`}
            />

            <div
                className="mx-auto flex w-full max-w-[800px] flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/alerts">
                            <ArrowLeft
                                className={cn(
                                    'h-4 w-4',
                                    isRTL ? 'mr-2' : 'ml-2',
                                )}
                            />
                            {t('back', 'العودة')}
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        {!alert.is_read && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAsRead}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {t('alerts.mark_as_read', 'تحديد كمقروء')}
                            </Button>
                        )}
                        {alert.is_read && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAsUnread}
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                {t('alerts.mark_as_unread', 'تحديد كغير مقروء')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Alert Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        'rounded-lg p-2',
                                        getTypeColor(alert.type),
                                    )}
                                >
                                    {getTypeIcon(alert.type)}
                                </div>
                                <div>
                                    <CardTitle className="text-xl">
                                        {alert.title}
                                    </CardTitle>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={getTypeColor(alert.type)}
                                        >
                                            {getTypeLabel(alert.type)}
                                        </Badge>
                                        <Badge
                                            variant={
                                                alert.is_read
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className={cn(
                                                alert.is_read
                                                    ? 'border-green-500/20 bg-green-500/10 text-green-600'
                                                    : 'border-orange-500/20 bg-orange-500/10 text-orange-600',
                                            )}
                                        >
                                            {alert.is_read
                                                ? t('alerts.read', 'مقروء')
                                                : t(
                                                      'alerts.unread',
                                                      'غير مقروء',
                                                  )}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Message */}
                        <div>
                            <h3 className="mb-2 font-semibold">
                                {t('alerts.message', 'الرسالة')}
                            </h3>
                            <div className="rounded-lg border bg-muted/30 p-4">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {alert.message}
                                </p>
                            </div>
                        </div>

                        {/* Additional Data */}
                        {alert.data && Object.keys(alert.data).length > 0 && (
                            <div>
                                <h3 className="mb-2 font-semibold">
                                    {t(
                                        'alerts.additional_data',
                                        'بيانات إضافية',
                                    )}
                                </h3>
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <pre className="overflow-x-auto text-xs text-muted-foreground">
                                        {JSON.stringify(alert.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="flex flex-col gap-2 border-t pt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {t('alerts.created_at', 'تاريخ الإنشاء')}:{' '}
                                    {alert.created_at}
                                </span>
                            </div>
                            {alert.read_at && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>
                                        {t('alerts.read_at', 'تاريخ القراءة')}:{' '}
                                        {alert.read_at}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
