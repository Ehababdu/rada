import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface MultiSelectFilterProps<TData> {
    column?: any;
    title: string;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

export function MultiSelectFilter<TData>({
    column,
    title,
    options,
}: MultiSelectFilterProps<TData>) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const selectedValues = new Set(column?.getFilterValue() as string[] || []);

    const handleSelect = (value: string) => {
        if (selectedValues.has(value)) {
            selectedValues.delete(value);
        } else {
            selectedValues.add(value);
        }

        const filterValues = Array.from(selectedValues);
        column?.setFilterValue(filterValues.length ? filterValues : undefined);
    };

    const clearSelection = () => {
        selectedValues.clear();
        column?.setFilterValue(undefined);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedValues.size === 0 && (
                            <span className="text-muted-foreground">{title}</span>
                        )}
                        {selectedValues.size > 0 && selectedValues.size <= 3 && (
                            Array.from(selectedValues).map((value) => {
                                const option = options.find((opt) => opt.value === value);
                                return (
                                    <Badge
                                        key={value}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {option?.label || value}
                                    </Badge>
                                );
                            })
                        )}
                        {selectedValues.size > 3 && (
                            <span className="text-sm">
                                {selectedValues.size} {t('dataTable.selected')}
                            </span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder={t('dataTable.search')} />
                    <CommandList>
                        <CommandEmpty>{t('dataTable.noResults')}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                isSelected ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4" />
                                        )}
                                        {option.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <CommandGroup>
                                <CommandItem
                                    onSelect={clearSelection}
                                    className="justify-center text-center text-destructive"
                                >
                                    {t('dataTable.clearSelection')}
                                </CommandItem>
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}