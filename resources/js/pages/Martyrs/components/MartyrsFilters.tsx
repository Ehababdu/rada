import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

// Icons
import { Filter } from 'lucide-react';

import type { Filters } from '../types/martyr';

interface MartyrsFiltersProps {
    isFiltersOpen: boolean;
    setIsFiltersOpen: (open: boolean) => void;
    localFilters: Filters;
    handleFilterChange: (key: keyof Filters, value: string) => void;
    handleSearchChange: (value: string) => void;
    clearFilters: () => void;
    filteredBranches: Array<{ id: number; name_ar: string; bank_id: number }>;
    militaryRanks: Array<{ id: number; name_ar: string; name_en: string }>;
    maritalStatuses: Array<{ id: number; name_ar: string; name_en: string }>;
    employmentStatuses: Array<{ id: number; name: string }>;
    banks: Array<{ id: number; name_ar: string }>;
    parentsStatuses: Array<{ id: number; name_ar: string; name_en: string }>;
    employers: Array<{ id: number; name_ar: string; name_en?: string }>;
    previousEmployers: Array<{ id: number; name_ar: string; name_en?: string }>;
    isRTL: boolean;
}

export function MartyrsFilters({
    isFiltersOpen,
    setIsFiltersOpen,
    localFilters,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    filteredBranches,
    militaryRanks,
    maritalStatuses,
    employmentStatuses,
    banks,
    parentsStatuses,
    employers,
    previousEmployers,
    isRTL,
}: MartyrsFiltersProps) {
    const { t } = useTranslation();

    return (
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            title={t('martyrs.filters.advanced')}
                            className="transition-colors hover:bg-accent"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('martyrs.filters.advanced')}</p>
                </TooltipContent>
            </Tooltip>
            <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-full p-0 sm:max-w-md"
            >
                <SheetHeader className="border-b p-6">
                    <SheetTitle>{t('martyrs.filters.advanced')}</SheetTitle>
                    <SheetDescription>
                        {t('martyrs.filters.advanced_description')}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] p-6">
                    <div className="grid gap-6">
                        {/* Filters Fields - Copy the full JSX from original file */}
                        <div className="space-y-4">
                            {/* Military Rank */}
                            <div className="space-y-2">
                                <Label>{t('martyrs.military_rank')}</Label>
                                <Select
                                    value={localFilters.military_rank || 'all'}
                                    onValueChange={(v) => handleFilterChange('military_rank', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('martyrs.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                        {militaryRanks.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {isRTL ? r.name_ar : r.name_en}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Marital Status */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.marital_status')}</Label>
                                    <Select
                                        value={localFilters.marital_status_id || 'all'}
                                        onValueChange={(v) => handleFilterChange('marital_status_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('martyrs.select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                            {maritalStatuses.map((s) => (
                                                <SelectItem key={s.id} value={String(s.id)}>
                                                    {isRTL ? s.name_ar : s.name_en}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Wife Status */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.wife_status')}</Label>
                                    <Select
                                        value={localFilters.wife_status || 'all'}
                                        onValueChange={(v) => handleFilterChange('wife_status', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('martyrs.select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                            <SelectItem value="متزوجة">متزوجة</SelectItem>
                                            <SelectItem value="غير متزوجة">غير متزوجة</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Employment Status */}
                            <div className="space-y-2">
                                <Label>{t('martyrs.employment_status')}</Label>
                                <Select
                                    value={localFilters.employment_status_id || 'all'}
                                    onValueChange={(v) => handleFilterChange('employment_status_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('martyrs.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                        {employmentStatuses.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Bank */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.bank')}</Label>
                                    <Select
                                        value={localFilters.bank_id || 'all'}
                                        onValueChange={(v) => handleFilterChange('bank_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('martyrs.select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                            {banks.map((b) => (
                                                <SelectItem key={b.id} value={String(b.id)}>
                                                    {b.name_ar}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Branch */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.branch')}</Label>
                                    <Select
                                        value={localFilters.branch_id || 'all'}
                                        onValueChange={(v) => handleFilterChange('branch_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('martyrs.select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                            {filteredBranches.map((b) => (
                                                <SelectItem key={b.id} value={String(b.id)}>
                                                    {b.name_ar}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Parents Status */}
                            <div className="space-y-2">
                                <Label>{t('martyrs.parents_status')}</Label>
                                <Select
                                    value={localFilters.parents_status_id || 'all'}
                                    onValueChange={(v) => handleFilterChange('parents_status_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('martyrs.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                        {parentsStatuses.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {isRTL ? s.name_ar : s.name_en}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Employer */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.employer')}</Label>
                                    <Select
                                        value={localFilters.employer_id || 'all'}
                                        onValueChange={(v) => handleFilterChange('employer_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('martyrs.select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                            {employers.map((e) => (
                                                <SelectItem key={e.id} value={String(e.id)}>
                                                    {isRTL ? e.name_ar : (e.name_en || e.name_ar)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Previous Employer */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.previous_employer')}</Label>
                                    <Select
                                        value={localFilters.previous_employer_id || 'all'}
                                        onValueChange={(v) => handleFilterChange('previous_employer_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('martyrs.select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                            {previousEmployers.map((e) => (
                                                <SelectItem key={e.id} value={String(e.id)}>
                                                    {isRTL ? e.name_ar : (e.name_en || e.name_ar)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label>{t('martyrs.status')}</Label>
                                <Select
                                    value={localFilters.status || 'all'}
                                    onValueChange={(v) => handleFilterChange('status', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('martyrs.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                        <SelectItem value="active">{t('martyrs.status.active')}</SelectItem>
                                        <SelectItem value="inactive">{t('martyrs.status.inactive')}</SelectItem>
                                        <SelectItem value="pending">{t('martyrs.status.pending')}</SelectItem>
                                        <SelectItem value="complete">{t('martyrs.status.complete')}</SelectItem>
                                        <SelectItem value="incomplete">{t('martyrs.status.incomplete')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Decision */}
                            <div className="space-y-2">
                                <Label>{t('martyrs.decision')}</Label>
                                <Select
                                    value={localFilters.has_martyr_decision || 'all'}
                                    onValueChange={(v) => handleFilterChange('has_martyr_decision', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('martyrs.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('martyrs.all')}</SelectItem>
                                        <SelectItem value="1">{t('martyrs.yes')}</SelectItem>
                                        <SelectItem value="0">{t('martyrs.no')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Military Number */}
                            <div className="space-y-2">
                                <Label>{t('martyrs.military_number')}</Label>
                                <Input
                                    placeholder={t('martyrs.military_number')}
                                    value={localFilters.military_number || ''}
                                    onChange={(e) => handleFilterChange('military_number', e.target.value)}
                                />
                            </div>

                            {/* Decision Number */}
                            <div className="space-y-2">
                                <Label>{t('martyrs.decision_number')}</Label>
                                <Input
                                    placeholder={t('martyrs.decision_number')}
                                    value={localFilters.decision_number || ''}
                                    onChange={(e) => handleFilterChange('decision_number', e.target.value)}
                                />
                            </div>

                            {/* Date Filters */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Death Date From */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.death_date_from')}</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.death_date_from || ''}
                                        onChange={(e) => handleFilterChange('death_date_from', e.target.value)}
                                    />
                                </div>

                                {/* Decision Date From */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.decision_date_from')}</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.decision_date_from || ''}
                                        onChange={(e) => handleFilterChange('decision_date_from', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Date From */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.date_from')}</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.date_from || ''}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    />
                                </div>

                                {/* Date To */}
                                <div className="space-y-2">
                                    <Label>{t('martyrs.date_to')}</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.date_to || ''}
                                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="border-t p-6">
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                        {t('martyrs.clear_filters')}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}