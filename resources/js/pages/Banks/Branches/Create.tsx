import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Loader2,
    MapPin,
    Save,
} from 'lucide-react';

interface Bank {
    id: number;
    name_ar: string;
}

interface Props {
    bank: Bank;
}

export default function Create({ bank }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // استخدام useForm للتعامل مع البيانات والأخطاء بشكل احترافي
    const { data, setData, post, processing, errors } = useForm({
        name_ar: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banks.title'), href: '/banks' },
        { title: bank.name_ar, href: `/banks/${bank.id}` },
        { title: t('branches.title'), href: `/banks/${bank.id}/branches` },
        {
            title: t('branches.create_branch'),
            href: `/banks/${bank.id}/branches/create`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/banks/${bank.id}/branches`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('branches.create_branch')} />

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
                        <Link href={`/banks/${bank.id}/branches`}>
                            {isRTL ? (
                                <ArrowRight className="h-5 w-5" />
                            ) : (
                                <ArrowLeft className="h-5 w-5" />
                            )}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('branches.create_branch')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('branches.create_branch_description')}
                        </p>
                    </div>
                </div>

                <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="border-b bg-muted/20">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5 text-primary" />
                                {t('branches.branch_details')}
                            </CardTitle>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 font-medium"
                            >
                                <Building2 className="h-3 w-3" />
                                {bank.name_ar}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* حقل اسم الفرع */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name_ar"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    {t('branches.name_ar')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin
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
                                            'bg-background',
                                            isRTL ? 'pr-10' : 'pl-10',
                                            errors.name_ar &&
                                                'border-destructive focus-visible:ring-destructive',
                                        )}
                                        placeholder={t(
                                            'branches.enter_name_ar',
                                        )}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.name_ar && (
                                    <p className="mt-1 text-xs font-medium text-destructive">
                                        {errors.name_ar}
                                    </p>
                                )}
                            </div>

                            {/* أزرار التحكم */}
                            <div className="mt-8 flex items-center justify-end gap-3 border-t pt-4">
                                <Button variant="ghost" asChild type="button">
                                    <Link href={`/banks/${bank.id}/branches`}>
                                        {t('cancel')}
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[140px] shadow-sm"
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
                                            {t('branches.create_branch')}
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
