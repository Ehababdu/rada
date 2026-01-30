import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Award, Calculator, Check, ChevronsUpDown, DollarSign, AlertCircle } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';

interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    military_rank: string;
    parents_status_id: number;
    marital_status_id: number;
    children_count: number;
    wife_status: string | null;
}

interface Props {
    martyrs: Martyr[];
    selectedMartyr?: Martyr | null;
}

export default function Create({ martyrs, selectedMartyr }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    // حالات التحكم في الواجهة
    const [openPopover, setOpenPopover] = useState(false);
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [unitPrice, setUnitPrice] = useState(500);

    const { data, setData, post, processing, errors, reset } = useForm({
        martyr_id: selectedMartyr?.id || '',
        recipient_name: '',
        recipient_passport_number: '',
        amount: '0',
        receipt_date: '',
        months: [] as number[],
    });

    // البحث عن بيانات الشهيد المختار
    const currentMartyr = useMemo(() => 
        martyrs.find(m => m.id.toString() === data.martyr_id.toString()) || null
    , [data.martyr_id, martyrs]);

    // منطق الحسابات
    const calculation = useMemo(() => {
        if (!currentMartyr) return { total: 0, items: [], base: 0 };
        
        const activePrice = isCustomAmount ? unitPrice : 500;
        const items = [];
        let baseAmount = 0;

        if (currentMartyr.children_count > 0) {
            const childTotal = currentMartyr.children_count * activePrice;
            items.push({ label: `الأبناء (${currentMartyr.children_count})`, val: childTotal });
            baseAmount += childTotal;
        }
        if (currentMartyr.wife_status !== 'متزوجة') {
            items.push({ label: 'الزوجة', val: activePrice });
            baseAmount += activePrice;
        }
        if ([3, 4].includes(currentMartyr.parents_status_id)) {
            items.push({ label: 'الأم', val: activePrice });
            baseAmount += activePrice;
        }

        const multiplier = data.months.length > 0 ? data.months.length : 1;
        return {
            base: baseAmount,
            total: baseAmount * multiplier,
            items
        };
    }, [currentMartyr, isCustomAmount, unitPrice, data.months]);

    useEffect(() => {
        setData('amount', calculation.total.toString());
    }, [calculation.total]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/compensations', {
            onSuccess: () => reset(),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('compensations.title'), href: '/compensations' },
        { title: t('compensations.add_compensation'), href: '/compensations/create' },
    ];

    const monthsOptions = [
        { value: 1, label: 'يناير' }, { value: 2, label: 'فبراير' },
        { value: 3, label: 'مارس' }, { value: 4, label: 'أبريل' },
        { value: 5, label: 'مايو' }, { value: 6, label: 'يونيو' },
        { value: 7, label: 'يوليو' }, { value: 8, label: 'أغسطس' },
        { value: 9, label: 'سبتمبر' }, { value: 10, label: 'أكتوبر' },
        { value: 11, label: 'نوفمبر' }, { value: 12, label: 'ديسمبر' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('compensations.add_compensation')} />
            
            <div className="max-w-5xl mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('compensations.add_compensation')}</h1>
                        <p className="text-muted-foreground">{t('compensations.create_compensation_description')}</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/compensations">
                            <ArrowLeft className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                            {t('back')}
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className={cn(Object.keys(errors).length > 0 && "border-destructive/20")}>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold italic text-primary">البيانات الأساسية</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                
                                {/* Martyr Selector */}
                                <div className="space-y-2">
                                    <Label className={cn("text-sm font-bold", errors.martyr_id && "text-destructive")}>
                                        البحث عن الشهيد *
                                    </Label>
                                    <Popover open={openPopover} onOpenChange={setOpenPopover}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between font-normal text-right", 
                                                    !data.martyr_id && "text-muted-foreground",
                                                    errors.martyr_id && "border-destructive ring-destructive"
                                                )}
                                            >
                                                {data.martyr_id 
                                                    ? martyrs.find(m => m.id.toString() === data.martyr_id.toString())?.full_name 
                                                    : "اختر الشهيد من القائمة..."}
                                                <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="ابحث بالإسم أو الرقم الوطني..." />
                                                <CommandList>
                                                    <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
                                                    <CommandGroup>
                                                        {martyrs.map((martyr) => (
                                                            <CommandItem
                                                                key={martyr.id}
                                                                value={martyr.full_name + martyr.national_id}
                                                                onSelect={() => {
                                                                    setData('martyr_id', String(martyr.id));
                                                                    setOpenPopover(false);
                                                                }}
                                                            >
                                                                <Check className={cn("ml-2 h-4 w-4", data.martyr_id === String(martyr.id) ? "opacity-100" : "opacity-0")} />
                                                                {martyr.full_name} | {martyr.national_id}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.martyr_id && (
                                        <p className="text-xs text-destructive font-medium flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> {errors.martyr_id}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Recipient Name */}
                                    <div className="space-y-2">
                                        <Label className={cn(errors.recipient_name && "text-destructive")}>اسم المستلم *</Label>
                                        <Input 
                                            placeholder="أدخل الاسم الرباعي" 
                                            className={cn(errors.recipient_name && "border-destructive focus-visible:ring-destructive")}
                                            value={data.recipient_name}
                                            onChange={e => setData('recipient_name', e.target.value)}
                                        />
                                        {errors.recipient_name && <p className="text-xs text-destructive font-medium">{errors.recipient_name}</p>}
                                    </div>
                                    
                                    {/* Passport Number */}
                                    <div className="space-y-2">
                                        <Label className={cn(errors.recipient_passport_number && "text-destructive")}>رقم جواز السفر / الهوية *</Label>
                                        <Input 
                                            placeholder="رقم الإثبات" 
                                            className={cn(errors.recipient_passport_number && "border-destructive focus-visible:ring-destructive")}
                                            value={data.recipient_passport_number}
                                            onChange={e => setData('recipient_passport_number', e.target.value)}
                                        />
                                        {errors.recipient_passport_number && <p className="text-xs text-destructive font-medium">{errors.recipient_passport_number}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Receipt Date */}
                                    <div className="space-y-2">
                                        <Label className={cn(errors.receipt_date && "text-destructive")}>تاريخ الإستلام *</Label>
                                        <Input 
                                            type="date" 
                                            className={cn(errors.receipt_date && "border-destructive focus-visible:ring-destructive")}
                                            value={data.receipt_date}
                                            onChange={e => setData('receipt_date', e.target.value)}
                                        />
                                        {errors.receipt_date && <p className="text-xs text-destructive font-medium">{errors.receipt_date}</p>}
                                    </div>

                                    {/* Months Multi-select */}
                                    <div className="space-y-2 text-right">
                                        <Label className={cn(errors.months && "text-destructive")}>الأشهر المستحقة *</Label>
                                        <div className={cn(errors.months && "rounded-md border border-destructive")}>
                                            <MultiSelectCombobox
                                                value={data.months}
                                                onChange={(m: number[]) => setData('months', m)}
                                                options={monthsOptions}
                                            />
                                        </div>
                                        {errors.months && <p className="text-xs text-destructive font-medium">{errors.months}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Custom Amount Section */}
                        {currentMartyr && (
                            <Card className="border-dashed bg-muted/30">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox 
                                            id="custom_check" 
                                            checked={isCustomAmount}
                                            onCheckedChange={(val) => setIsCustomAmount(!!val)}
                                        />
                                        <Label htmlFor="custom_check" className="cursor-pointer font-bold text-blue-700">تعديل القيمة الافتراضية (500 د.ل)</Label>
                                    </div>

                                    {isCustomAmount && (
                                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex-1 max-w-[200px]">
                                                <Label className="text-xs mb-1 block">القيمة الجديدة لكل فئة</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input 
                                                        type="number" 
                                                        className="pl-9"
                                                        value={unitPrice}
                                                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground italic mt-5">
                                                * سيتم تطبيق هذه القيمة على (الأبناء، الزوجة، الأم) لهذا القيد فقط.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-primary/20 shadow-md sticky top-6">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="flex items-center gap-2 text-primary uppercase text-sm tracking-widest">
                                    <Calculator className="h-4 w-4" />
                                    ملخص الحساب
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {currentMartyr ? (
                                    <>
                                        <div className="space-y-2">
                                            {calculation.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{item.label}</span>
                                                    <span className="font-medium">{item.val} د.ل</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator />
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>الإجمالي الشهري</span>
                                                <span>{calculation.base} د.ل</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground italic">
                                                <span>عدد الأشهر</span>
                                                <span>× {data.months.length || 1}</span>
                                            </div>
                                        </div>
                                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                                            <div className="text-xs text-primary mb-1 font-bold italic">القيمة النهائية المستحقة:</div>
                                            <div className="text-3xl font-black text-primary tracking-tighter">
                                                {calculation.total} <span className="text-sm font-normal">د.ل</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-10 text-center text-muted-foreground">
                                        <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                        <p className="text-xs italic">يرجى اختيار شهيد لعرض تفاصيل الحساب تلقائياً</p>
                                    </div>
                                )}
                                
                                <Button 
                                    type="submit"
                                    className="w-full h-12 text-lg font-bold" 
                                    disabled={processing || !currentMartyr}
                                >
                                    {processing ? "جاري الحفظ..." : "إعتماد وحفظ القيد"}
                                </Button>

                                {Object.keys(errors).length > 0 && (
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                        <p className="text-[11px] text-destructive text-center font-bold">
                                            يرجى تصحيح الأخطاء في النموذج قبل الحفظ
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}