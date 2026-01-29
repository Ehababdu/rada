import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { 
    ArrowLeft, Award, User, Save, AlertTriangle, 
    Calendar, Briefcase, ChevronRight, RefreshCw, Info 
} from 'lucide-react';
import Combobox from '@/components/ui/combobox';
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
} from "@/components/ui/alert-dialog";

// 1. تعريف الأنواع (Interfaces)
interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    military_rank?: string;
    military_rank_id?: number | string;
    employment_status_id?: number | string;
    jobGrade?: { id: number; name_ar: string } | null;
}

interface Props {
    martyrs: Martyr[];
    military_ranks?: { id: number; name_ar: string }[];
    employment_statuses?: { id: number; name: string }[];
    jobGrades?: { id: number; name_ar: string; name_en: string; order: number }[];
}

export default function Create({ martyrs, military_ranks = [], employment_statuses = [], jobGrades = [] }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { data, setData, post, processing, errors, reset } = useForm({
        martyr_id: '',
        current_rank: '',
        promotion_rank: '',
        current_job_grade_id: '',
        promotion_job_grade_id: '',
        current_rank_date: '',
        promotion_years: '',
        next_due_date: '',
        description: '',
    });

    const [currentRankName, setCurrentRankName] = useState('');
    const [currentJobGradeName, setCurrentJobGradeName] = useState('');
    const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState<string>('');
    const [loadingMartyrs, setLoadingMartyrs] = useState(false);
    const [martyrsForEmployment, setMartyrsForEmployment] = useState<Martyr[] | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('promotions.title'), href: '/promotions' },
        { title: t('create'), href: '#' },
    ];

    // تحديد نوع الشهيد (مدني/عسكري)
    const isCivilian = () => {
        const status = employment_statuses.find(s => s.id.toString() === selectedEmploymentStatus);
        return status?.name.toLowerCase().includes('employee') || status?.name === 'موظف';
    };

    // خيارات الكومبوبوكس مع تعريف الأنواع لمنع "Implicit Any"
    const employmentOptions = employment_statuses.reduce((acc: Record<string, string>, s) => {
        acc[s.id.toString()] = s.name;
        return acc;
    }, {});

    const rankOptions = military_ranks.reduce((acc: Record<string, string>, rank) => {
        acc[rank.id.toString()] = rank.name_ar;
        return acc;
    }, {});

    const jobGradeOptions = jobGrades.reduce((acc: Record<string, string>, grade) => {
        acc[grade.id.toString()] = grade.name_ar;
        return acc;
    }, {});

    const filteredMartyrOptions = (() => {
        const source = martyrsForEmployment ?? martyrs;
        const filtered = selectedEmploymentStatus 
            ? source.filter((m) => m.employment_status_id?.toString() === selectedEmploymentStatus)
            : source;
            
        return filtered.reduce((acc: Record<string, string>, martyr) => {
            acc[martyr.id.toString()] = `${martyr.full_name} (${martyr.national_id})`;
            return acc;
        }, {});
    })();

    // منطق جلب البيانات (كما في الكود الأصلي)
    const handleMartyrChange = (martyrId: string) => {
        const source = martyrsForEmployment ?? martyrs;
        const martyr = source.find(m => m.id.toString() === martyrId);
        setData('martyr_id', martyrId);
        
        if (martyr) {
            if (isCivilian()) {
                setData('current_job_grade_id', martyr.jobGrade?.id?.toString() || '');
                setCurrentJobGradeName(martyr.jobGrade?.name_ar || '');
            } else {
                setData('current_rank', martyr.military_rank_id?.toString() || '');
                setCurrentRankName(martyr.military_rank || '');
            }
        }
    };

    // حساب التاريخ التلقائي
    useEffect(() => {
        if (data.current_rank_date && data.promotion_years) {
            const date = new Date(data.current_rank_date);
            const years = parseInt(data.promotion_years);
            if (!isNaN(years)) {
                date.setFullYear(date.getFullYear() + years);
                setData('next_due_date', date.toISOString().split('T')[0]);
            }
        }
    }, [data.current_rank_date, data.promotion_years]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('promotions.create_promotion')} />

            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="px-2 py-0 text-primary border-primary">
                                {t('promotions.new_entry')}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                            <Award className="h-8 w-8 text-primary" />
                            {t('promotions.create_promotion')}
                        </h1>
                    </div>
                    
                    <Link href="/promotions">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                            {t('back')}
                        </Button>
                    </Link>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); post('/promotions'); }} className="space-y-8">
                    
                    <Card className="border-t-4 border-t-primary shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                {t('promotions.personnel_selection')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('promotions.employment_status')}</Label>
                                <Combobox
                                    value={selectedEmploymentStatus}
                                    onChange={(val) => {
                                        setSelectedEmploymentStatus(val);
                                        setData(d => ({ ...d, martyr_id: '', current_rank: '', current_job_grade_id: '' }));
                                    }}
                                    options={employmentOptions}
                                    placeholder={t('promotions.select_status')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">{t('promotions.martyr_name')}</Label>
                                <Combobox
                                    value={data.martyr_id}
                                    onChange={handleMartyrChange}
                                    options={filteredMartyrOptions}
                                    placeholder={t('promotions.select_martyr')}
                                />
                                {errors.martyr_id && <p className="text-xs text-destructive mt-1">{errors.martyr_id}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {data.martyr_id && (
                        <Card className="shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                                    {t('promotions.rank_grade_details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-muted/30 p-4 rounded-lg border border-dashed">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">{isCivilian() ? t('promotions.current_grade') : t('promotions.current_rank')}</Label>
                                        <div className="text-xl font-bold p-2 bg-background border rounded-md shadow-sm">
                                            {isCivilian() ? (currentJobGradeName || '---') : (currentRankName || '---')}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="font-bold text-primary flex items-center gap-1">
                                            <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                            {isCivilian() ? t('promotions.target_grade') : t('promotions.target_rank')}
                                        </Label>
                                        <Combobox
                                            value={isCivilian() ? data.promotion_job_grade_id : data.promotion_rank}
                                            onChange={(val) => isCivilian() ? setData('promotion_job_grade_id', val) : setData('promotion_rank', val)}
                                            options={isCivilian() ? jobGradeOptions : rankOptions}
                                            placeholder={t('select_option')}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {t('promotions.last_promotion_date')}
                                        </Label>
                                        <Input type="date" value={data.current_rank_date} onChange={e => setData('current_rank_date', e.target.value)} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
                                            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                            {t('promotions.period_years')}
                                        </Label>
                                        <Input type="number" value={data.promotion_years} onChange={e => setData('promotion_years', e.target.value)} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-primary">
                                            <Info className="h-3.5 w-3.5" />
                                            {t('promotions.next_due_date')}
                                        </Label>
                                        <Input type="date" value={data.next_due_date} className="bg-primary/5 border-primary/20 font-bold" readOnly />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <Label className="text-sm font-semibold">{t('promotions.notes')}</Label>
                                    <Textarea 
                                        placeholder={t('promotions.add_description')} 
                                        className="min-h-[100px]"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex items-center justify-between bg-background p-4 border rounded-xl shadow-sm sticky bottom-4 z-10">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="ghost" className="text-destructive">
                                    {t('reset_form')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('confirm_reset')}</AlertDialogTitle>
                                    <AlertDialogDescription>{t('reset_warning_message')}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => reset()}>{t('continue')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button type="submit" size="lg" className="px-8 gap-2" disabled={processing || !data.martyr_id}>
                            {processing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {t('save_promotion')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}