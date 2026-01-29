import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface NumericRangeFilterProps<TData> {
    column?: any;
    title: string;
    min?: number;
    max?: number;
    step?: number;
}

export function NumericRangeFilter<TData>({
    column,
    title,
    min,
    max,
    step = 1,
}: NumericRangeFilterProps<TData>) {
    const { t } = useTranslation();
    const [minValue, setMinValue] = React.useState<string>('');
    const [maxValue, setMaxValue] = React.useState<string>('');

    const applyFilter = () => {
        const minNum = minValue ? parseFloat(minValue) : undefined;
        const maxNum = maxValue ? parseFloat(maxValue) : undefined;

        if (minNum !== undefined || maxNum !== undefined) {
            column?.setFilterValue([minNum, maxNum]);
        } else {
            column?.setFilterValue(undefined);
        }
    };

    const clearFilter = () => {
        setMinValue('');
        setMaxValue('');
        column?.setFilterValue(undefined);
    };

    React.useEffect(() => {
        const timeoutId = setTimeout(applyFilter, 300);
        return () => clearTimeout(timeoutId);
    }, [minValue, maxValue]);

    return (
        <div className="grid gap-2">
            <Label className="text-sm font-medium">{title}</Label>
            <div className="flex gap-2">
                <div className="flex-1">
                    <Input
                        type="number"
                        placeholder={t('dataTable.min')}
                        value={minValue}
                        onChange={(e) => setMinValue(e.target.value)}
                        min={min}
                        max={max}
                        step={step}
                        className="h-8"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        type="number"
                        placeholder={t('dataTable.max')}
                        value={maxValue}
                        onChange={(e) => setMaxValue(e.target.value)}
                        min={min}
                        max={max}
                        step={step}
                        className="h-8"
                    />
                </div>
            </div>
            {(minValue || maxValue) && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilter}
                    className="h-6 px-2 text-xs"
                >
                    {t('dataTable.clear')}
                </Button>
            )}
        </div>
    );
}