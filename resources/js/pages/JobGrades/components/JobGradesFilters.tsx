import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

// Icons
import { Filter, Search, X } from 'lucide-react';

interface JobGradesFiltersProps {
    isFiltersOpen: boolean;
    setIsFiltersOpen: (open: boolean) => void;
    search: string;
    status: string;
    handleSearchChange: (value: string) => void;
    handleFilterChange: (key: string, value: string) => void;
    clearFilters: () => void;
    isRTL: boolean;
}

export function JobGradesFilters({
    isFiltersOpen,
    setIsFiltersOpen,
    search,
    status,
    handleSearchChange,
    handleFilterChange,
    clearFilters,
    isRTL,
}: JobGradesFiltersProps) {
    const { t } = useTranslation();

    return (
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="shrink-0">
                    <Filter className="mr-2 h-4 w-4" />
                    {t('job_grades.filters')}
                </Button>
            </SheetTrigger>
            <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-full sm:max-w-md"
            >
                <SheetHeader>
                    <SheetTitle>{t('job_grades.filters')}</SheetTitle>
                    <SheetDescription>
                        {t('job_grades.filters_description')}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search">{t('job_grades.search')}</Label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder={t('job_grades.search_placeholder')}
                                className="pl-9"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="status">{t('job_grades.status')}</Label>
                        <Select
                            value={status}
                            onValueChange={(value) => handleFilterChange('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('job_grades.select_status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('all')}</SelectItem>
                                <SelectItem value="1">{t('active')}</SelectItem>
                                <SelectItem value="0">{t('inactive')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Filters */}
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                    >
                        <X className="mr-2 h-4 w-4" />
                        {t('job_grades.clear_filters')}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}