import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Combobox from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Briefcase,
    Calendar,
    ChevronRight,
    Info,
    RefreshCw,
    Save,
    Undo2,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- Interfaces ---
interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    military_rank?: string;
    military_rank_id?: number | string;
    employment_status_id?: number | string;
    jobGrade?: { id: number; name_ar: string } | null;
}

interface Promotion {
    id: number;
    martyr_id: number;
    current_rank: string;
    promotion_rank: string;
    current_job_grade: string;
    promotion_job_grade: string;
    current_rank_date: string;
    promotion_years: string;
    next_due_date: string;
    description: string;
    martyr: Martyr;
    currentJobGrade?: { id: number; name_ar: string; name_en: string };
    promotionJobGrade?: { id: number; name_ar: string; name_en: string };
}

interface Props {
    promotion: Promotion;
    martyrs: Martyr[];
    military_ranks?: { id: number; name_ar: string }[];
    employment_statuses?: { id: number; name: string }[];
    jobGrades?: {
        id: number;
        name_ar: string;
        name_en: string;
        order: number;
    }[];
}

export default function Edit({
    promotion,
    martyrs,
    military_ranks = [],
    employment_statuses = [],
    jobGrades = [],
}: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const formatDateForInput = (v?: string | null) => {
        if (!v) return '';
        return v.includes('T') ? v.split('T')[0] : v;
    };

    const { data, setData, put, processing, errors, reset } = useForm({
        martyr_id: promotion.martyr_id.toString(),
        current_rank: promotion.current_rank?.toString() || '',
        promotion_rank: promotion.promotion_rank?.toString() || '',
        current_job_grade: promotion.currentJobGrade?.name_ar || '',
        promotion_job_grade: promotion.promotionJobGrade?.name_ar || '',
        current_rank_date: formatDateForInput(promotion.current_rank_date),
        promotion_years: promotion.promotion_years,
        next_due_date: formatDateForInput(promotion.next_due_date),
        description: promotion.description || '',
    });

    const [selectedStatus, setSelectedStatus] = useState<string>(
        promotion.martyr?.employment_status_id?.toString() || '',
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('promotions.title'), href: '/promotions' },
        { title: t('edit'), href: '#' },
    ];

    const currentRankName = military_ranks.find(
        (rank) => rank.id.toString() === promotion.current_rank
    )?.name_ar || promotion.current_rank;

    // --- Helpers ---
    const isCivilian = () => {
        const status = employment_statuses.find(
            (s) => s.id.toString() === selectedStatus,
        );
        return (
            status?.name.toLowerCase().includes('employee') ||
            status?.name === 'موظف'
        );
    };

    const employmentOptions = employment_statuses.reduce(
        (acc: Record<string, string>, s) => {
            acc[s.id.toString()] = s.name;
            return acc;
        },
        {},
    );

    const rankOptions = military_ranks.reduce(
        (acc: Record<string, string>, r) => {
            acc[r.id.toString()] = r.name_ar;
            return acc;
        },
        {},
    );

    const jobGradeOptions = jobGrades.reduce(
        (acc: Record<string, string>, g) => {
            acc[g.name_ar] = g.name_ar;
            return acc;
        },
        {},
    );

    const martyrOptions = martyrs.reduce((acc: Record<string, string>, m) => {
        acc[m.id.toString()] = `${m.full_name} (${m.national_id})`;
        return acc;
    }, {});

    // --- Effects ---
    useEffect(() => {
        if (data.current_rank_date && data.promotion_years) {
            const date = new Date(data.current_rank_date);
            const years = parseInt(data.promotion_years);
            if (!isNaN(years) && years > 0) {
                date.setFullYear(date.getFullYear() + years);
                setData('next_due_date', date.toISOString().split('T')[0]);
            }
        }
    }, [data.current_rank_date, data.promotion_years, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('promotions.edit_promotion')} />

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="border-primary text-primary"
                            >
                                ID: #{promotion.id}
                            </Badge>
                        </div>
                        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight">
                            <Award className="h-8 w-8 text-primary" />
                            {t('promotions.edit_promotion')}
                        </h1>
                    </div>

                    <Link href="/promotions">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft
                                className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`}
                            />
                            {t('back')}
                        </Button>
                    </Link>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/promotions/${promotion.id}`);
                    }}
                    className="space-y-8"
                >
                    {/* Person Selection Card */}
                    <Card className="border-t-4 border-t-blue-500 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-muted-foreground" />
                                {t('promotions.personnel_selection')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">
                                    {t('promotions.employment_status')}
                                </Label>
                                <Combobox
                                    value={selectedStatus}
                                    onChange={(val) => setSelectedStatus(val)}
                                    options={employmentOptions}
                                    placeholder={t('select_option')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">
                                    {t('promotions.martyr_name')}
                                </Label>
                                <Combobox
                                    value={data.martyr_id}
                                    onChange={(val) =>
                                        setData('martyr_id', val)
                                    }
                                    options={martyrOptions}
                                    placeholder={t('select_option')}
                                />
                                {errors.martyr_id && (
                                    <p className="text-xs text-destructive">
                                        {errors.martyr_id}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Promotion Details Card */}
                    <Card className="overflow-hidden shadow-md">
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                {t('promotions.promotion_details')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            {/* Comparison Row */}
                            <div className="grid grid-cols-1 items-center gap-8 rounded-xl border border-primary/10 bg-primary/5 p-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                                        {isCivilian()
                                            ? t('promotions.current_grade')
                                            : t('promotions.current_rank')}
                                    </Label>
                                    <div className="flex items-center justify-between rounded-lg border bg-background p-3 text-xl font-bold shadow-sm">
                                        {isCivilian()
                                            ? data.current_job_grade || '---'
                                            : currentRankName || '---'}
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-normal"
                                        >
                                            {t('current')}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold tracking-wider text-primary uppercase">
                                        {isCivilian()
                                            ? t(
                                                  'promotions.promotion_job_grade',
                                              )
                                            : t('promotions.promotion_rank')}
                                    </Label>
                                    <div className="relative">
                                        <Combobox
                                            value={
                                                isCivilian()
                                                    ? data.promotion_job_grade
                                                    : data.promotion_rank
                                            }
                                            onChange={(val) =>
                                                isCivilian()
                                                    ? setData(
                                                          'promotion_job_grade',
                                                          val,
                                                      )
                                                    : setData(
                                                          'promotion_rank',
                                                          val,
                                                      )
                                            }
                                            options={
                                                isCivilian()
                                                    ? jobGradeOptions
                                                    : rankOptions
                                            }
                                            placeholder={t('select_option')}
                                        />
                                        <div
                                            className={`absolute -top-3 ${isRTL ? '-right-2' : '-left-2'} rounded-full bg-primary p-1 text-primary-foreground shadow-lg`}
                                        >
                                            <ChevronRight
                                                className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Dates & Period */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs font-bold tracking-tighter uppercase">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {t('promotions.current_rank_date')}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.current_rank_date}
                                        onChange={(e) =>
                                            setData(
                                                'current_rank_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs font-bold tracking-tighter uppercase">
                                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                        {t('promotions.promotion_years')}
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={data.promotion_years}
                                        onChange={(e) =>
                                            setData(
                                                'promotion_years',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs font-bold tracking-tighter text-blue-600 uppercase">
                                        <Info className="h-4 w-4" />
                                        {t('promotions.next_due_date')}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.next_due_date}
                                        readOnly
                                        className="border-blue-200 bg-blue-50/50 font-bold text-blue-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">
                                    {t('promotions.description')}
                                </Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder={t('enter_description')}
                                    className="min-h-[100px] bg-muted/20 transition-colors focus:bg-background"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Actions */}
                    <div className="sticky bottom-6 z-20 flex items-center justify-between rounded-2xl border bg-background p-4 shadow-lg">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="gap-2 text-muted-foreground hover:text-destructive"
                                >
                                    <Undo2 className="h-4 w-4" />
                                    {t('reset')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {t('confirm_reset')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('reset_warning_message')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        {t('cancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={() => reset()}>
                                        {t('continue')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                                className="min-w-[150px] gap-2 shadow-lg shadow-primary/20"
                            >
                                {processing ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {t('save_changes')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
