import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Building2, Loader2, Save } from 'lucide-react';

export default function Create() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // تم الإبقاء على حقل الاسم بالعربي فقط
    const { data, setData, post, processing, errors, reset } = useForm({
        name_ar: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banks.title'), href: '/banks' },
        { title: t('banks.add_bank'), href: '/banks/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/banks', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('banks.add_bank')} />

            <div
                className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="rounded-full"
                    >
                        <Link href="/banks">
                            {isRTL ? (
                                <ArrowRight className="h-5 w-5" />
                            ) : (
                                <ArrowLeft className="h-5 w-5" />
                            )}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('banks.add_bank')}
                        </h1>
                    </div>
                </div>

                <Card className="border-none shadow-md">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                            {t('banks.bank_information')}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* حقل الاسم بالعربية فقط */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name_ar"
                                    className="text-sm font-semibold"
                                >
                                    {t('banks.name_ar')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Building2
                                        className={cn(
                                            'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                            isRTL ? 'right-3' : 'left-3',
                                        )}
                                    />
                                    <Input
                                        id="name_ar"
                                        value={data.name_ar}
                                        onChange={(e) =>
                                            setData('name_ar', e.target.value)
                                        }
                                        className={cn(
                                            isRTL ? 'pr-10' : 'pl-10',
                                            errors.name_ar &&
                                                'border-destructive',
                                        )}
                                        placeholder={t('banks.enter_name_ar')}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.name_ar && (
                                    <p className="text-xs font-medium text-destructive">
                                        {errors.name_ar}
                                    </p>
                                )}
                            </div>

                            {/* أزرار التحكم */}
                            <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
                                <Button variant="outline" asChild type="button">
                                    <Link href="/banks">{t('cancel')}</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[120px]"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2
                                                className={cn(
                                                    'h-4 w-4 animate-spin',
                                                    isRTL ? 'ml-2' : 'mr-2',
                                                )}
                                            />
                                            {t('saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                className={cn(
                                                    'h-4 w-4',
                                                    isRTL ? 'ml-2' : 'mr-2',
                                                )}
                                            />
                                            {t('banks.create_bank')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
