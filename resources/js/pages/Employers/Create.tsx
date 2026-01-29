import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Icons
import { ArrowLeft, ArrowRight, Building2, Save, Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Location {
    id: number;
    name_ar: string;
    name_en: string;
}

interface Props {
    locations: Location[];
}

export default function Create({ locations }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // تم الإبقاء على حقل الاسم بالعربي فقط
    const { data, setData, post, processing, errors, reset } = useForm({
        name_ar: '',
        name_en: '',
        employer_location_id: '',
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('employers.title'), href: '/employers' },
        { title: t('employers.add_employer'), href: '/employers/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/employers', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employers.add_employer')} />

            <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/employers">
                            {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t('employers.add_employer')}</h1>
                    </div>
                </div>

                <Card className="border-none shadow-md">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            {t('employers.employer_information')}
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* حقل الاسم بالعربية فقط */}
                            <div className="space-y-2">
                                <Label htmlFor="name_ar" className="text-sm font-semibold">
                                    {t('employers.name_ar')} <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Building2 className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4", isRTL ? "right-3" : "left-3")} />
                                    <Input
                                        id="name_ar"
                                        value={data.name_ar}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name_ar', e.target.value)}
                                        className={cn(isRTL ? "pr-10" : "pl-10", errors.name_ar && "border-destructive")}
                                        placeholder={t('employers.enter_name_ar')}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.name_ar && (
                                    <p className="text-xs text-destructive font-medium">{errors.name_ar}</p>
                                )}
                            </div>

                            {/* حقل الاسم بالإنجليزية */}
                            <div className="space-y-2">
                                <Label htmlFor="name_en" className="text-sm font-semibold">
                                    {t('employers.name_en')}
                                </Label>
                                <div className="relative">
                                    <Building2 className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4", isRTL ? "right-3" : "left-3")} />
                                    <Input
                                        id="name_en"
                                        value={data.name_en}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name_en', e.target.value)}
                                        className={cn(isRTL ? "pr-10" : "pl-10", errors.name_en && "border-destructive")}
                                        placeholder={t('employers.enter_name_en')}
                                    />
                                </div>
                                {errors.name_en && (
                                    <p className="text-xs text-destructive font-medium">{errors.name_en}</p>
                                )}
                            </div>

                            {/* حقل الموقع */}
                            <div className="space-y-2">
                                <Label htmlFor="employer_location_id" className="text-sm font-semibold">
                                    {t('employers.location_ar')}
                                </Label>
                                <div className="relative">
                                    <MapPin className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4", isRTL ? "right-3" : "left-3")} />
                                    <Select value={data.employer_location_id} onValueChange={(value) => setData('employer_location_id', value)}>
                                        <SelectTrigger className={cn(isRTL ? "pr-10" : "pl-10", errors.employer_location_id && "border-destructive")}>
                                            <SelectValue placeholder={t('employers.select_location')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">-- {t('employers.select_location')} --</SelectItem>
                                            {locations.map((location) => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {isRTL ? location.name_ar : (location.name_en || location.name_ar)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errors.employer_location_id && (
                                    <p className="text-xs text-destructive font-medium">{errors.employer_location_id}</p>
                                )}
                            </div>

                            {/* حقل النشاط */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active" className="text-sm font-semibold">
                                    {t('employers.is_active')}
                                </Label>
                            </div>

                            {/* أزرار التحكم */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
                                <Button variant="outline" asChild type="button">
                                    <Link href="/employers">{t('cancel')}</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="min-w-[120px]">
                                    {processing ? (
                                        <>
                                            <Loader2 className={cn("h-4 w-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
                                            {t('saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                                            {t('employers.create_employer')}
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