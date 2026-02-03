import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface DateRangeFilterProps<TData> {
    column?: Column<TData, unknown>;
    title: string;
}

export function DateRangeFilter<TData>({
    column,
    title,
}: DateRangeFilterProps<TData>) {
    const { i18n } = useTranslation();
    const [date, setDate] = React.useState<DateRange | undefined>();

    React.useEffect(() => {
        if (date?.from && date?.to) {
            column?.setFilterValue([date.from, date.to]);
        } else {
            column?.setFilterValue(undefined);
        }
    }, [date, column]);

    const isRTL = i18n.language === 'ar';

    return (
        <div className="grid gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y', {
                                        locale: isRTL ? ar : undefined,
                                    })}{' '}
                                    -{' '}
                                    {format(date.to, 'LLL dd, y', {
                                        locale: isRTL ? ar : undefined,
                                    })}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y', {
                                    locale: isRTL ? ar : undefined,
                                })
                            )
                        ) : (
                            <span>{title}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={isRTL ? ar : undefined}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
