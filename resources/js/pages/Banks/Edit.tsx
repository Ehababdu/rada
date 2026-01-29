import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Icons
import { ArrowLeft, ArrowRight, Building2, Save, Loader2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bank {
    id: number;
    name_ar: string;
}

interface Props {
    bank: Bank;
}

export default function Edit({ bank }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { data, setData, put, processing, errors } = useForm({
        name_ar: bank.name_ar,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banks.title'), href: '/banks' },
        { title: `${t('edit')}: ${bank.name_ar}`, href: `/banks/${bank.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/banks/${bank.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('edit')} ${bank.name_ar}`} />

            <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/banks">
                            {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Edit3 className="h-6 w-6 text-muted-foreground" />
                            {t('edit')} {bank.name_ar}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {t('banks.edit_bank_description')}
                        </p>
                    </div>
                </div>

                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            {t('banks.bank_information')}
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* حقل الاسم بالعربية فقط */}
                            <div className="space-y-2">
                                <Label htmlFor="name_ar" className="text-sm font-semibold">
                                    {t('banks.name_ar')} <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Building2 className={cn(
                                        "absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4",
                                        isRTL ? "right-3" : "left-3"
                                    )} />
                                    <Input
                                        id="name_ar"
                                        value={data.name_ar}
                                        onChange={(e) => setData('name_ar', e.target.value)}
                                        className={cn(
                                            "bg-background",
                                            isRTL ? "pr-10" : "pl-10",
                                            errors.name_ar && "border-destructive focus-visible:ring-destructive"
                                        )}
                                        placeholder={t('banks.enter_name_ar')}
                                        required
                                    />
                                </div>
                                {errors.name_ar && (
                                    <p className="text-xs text-destructive font-medium mt-1">{errors.name_ar}</p>
                                )}
                            </div>

                            {/* أزرار التحكم */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t mt-8">
                                <Button variant="ghost" asChild type="button">
                                    <Link href="/banks">{t('cancel')}</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="min-w-[140px] shadow-sm">
                                    {processing ? (
                                        <>
                                            <Loader2 className={cn("h-4 w-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
                                            {t('saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                            {t('banks.update_bank')}
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