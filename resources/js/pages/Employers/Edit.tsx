import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Edit3,
    Loader2,
    MapPin,
    Save,
} from 'lucide-react';

interface Location {
    id: number;
    name_ar: string;
    name_en: string;
}

interface Employer {
    id: number;
    name_ar: string;
    name_en: string;
    employer_location_id: number | null;
    is_active: boolean;
}

interface Props {
    employer: Employer;
    locations: Location[];
}

export default function Edit({ employer, locations }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { data, setData, put, processing, errors } = useForm({
        name_ar: employer.name_ar || '',
        name_en: employer.name_en || '',
        employer_location_id: employer.employer_location_id?.toString() || '',
        is_active: employer.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('employers.title'), href: '/employers' },
        {
            title: `${t('edit')}: ${employer.name_ar}`,
            href: `/employers/${employer.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/employers/${employer.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('edit')} ${employer.name_ar}`} />

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
                        <Link href="/employers">
                            {isRTL ? (
                                <ArrowRight className="h-5 w-5" />
                            ) : (
                                <ArrowLeft className="h-5 w-5" />
                            )}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Edit3 className="h-6 w-6 text-muted-foreground" />
                            {t('edit')} {employer.name_ar}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('employers.edit_employer_description')}
                        </p>
                    </div>
                </div>

                <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                            {t('employers.employer_information')}
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
                                    {t('employers.name_ar')}{' '}
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
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setData('name_ar', e.target.value)}
                                        className={cn(
                                            'bg-background',
                                            isRTL ? 'pr-10' : 'pl-10',
                                            errors.name_ar &&
                                                'border-destructive focus-visible:ring-destructive',
                                        )}
                                        placeholder={t(
                                            'employers.enter_name_ar',
                                        )}
                                        required
                                    />
                                </div>
                                {errors.name_ar && (
                                    <p className="mt-1 text-xs font-medium text-destructive">
                                        {errors.name_ar}
                                    </p>
                                )}
                            </div>

                            {/* حقل الاسم بالإنجليزية */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name_en"
                                    className="text-sm font-semibold"
                                >
                                    {t('employers.name_en')}
                                </Label>
                                <div className="relative">
                                    <Building2
                                        className={cn(
                                            'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                            isRTL ? 'right-3' : 'left-3',
                                        )}
                                    />
                                    <Input
                                        id="name_en"
                                        value={data.name_en}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setData('name_en', e.target.value)}
                                        className={cn(
                                            'bg-background',
                                            isRTL ? 'pr-10' : 'pl-10',
                                            errors.name_en &&
                                                'border-destructive focus-visible:ring-destructive',
                                        )}
                                        placeholder={t(
                                            'employers.enter_name_en',
                                        )}
                                    />
                                </div>
                                {errors.name_en && (
                                    <p className="mt-1 text-xs font-medium text-destructive">
                                        {errors.name_en}
                                    </p>
                                )}
                            </div>

                            {/* حقل الموقع */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="employer_location_id"
                                    className="text-sm font-semibold"
                                >
                                    {t('employers.location_ar')}
                                </Label>
                                <div className="relative">
                                    <MapPin
                                        className={cn(
                                            'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                            isRTL ? 'right-3' : 'left-3',
                                        )}
                                    />
                                    <Select
                                        value={data.employer_location_id}
                                        onValueChange={(value) =>
                                            setData(
                                                'employer_location_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            className={cn(
                                                isRTL ? 'pr-10' : 'pl-10',
                                                errors.employer_location_id &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        >
                                            <SelectValue
                                                placeholder={t(
                                                    'employers.select_location',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem
                                                    key={location.id}
                                                    value={location.id.toString()}
                                                >
                                                    {isRTL
                                                        ? location.name_ar
                                                        : location.name_en ||
                                                          location.name_ar}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errors.employer_location_id && (
                                    <p className="mt-1 text-xs font-medium text-destructive">
                                        {errors.employer_location_id}
                                    </p>
                                )}
                            </div>

                            {/* حقل النشاط */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) =>
                                        setData('is_active', !!checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="text-sm font-semibold"
                                >
                                    {t('employers.is_active')}
                                </Label>
                            </div>

                            {/* أزرار التحكم */}
                            <div className="mt-8 flex items-center justify-end gap-3 border-t pt-4">
                                <Button variant="ghost" asChild type="button">
                                    <Link href="/employers">{t('cancel')}</Link>
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
                                            {t('employers.update_employer')}
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
