import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
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

interface MultiSelectComboboxProps {
    value: number[];
    onChange: (value: number[]) => void;
    options: { value: number; label: string }[];
    placeholder?: string;
    error?: string;
}

export function MultiSelectCombobox({
    value,
    onChange,
    options,
    placeholder = "Select options...",
    error
}: MultiSelectComboboxProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleSelect = (selectedValue: number) => {
        if (value.includes(selectedValue)) {
            onChange(value.filter(v => v !== selectedValue));
        } else {
            onChange([...value, selectedValue]);
        }
    };

    const handleRemove = (itemToRemove: number) => {
        onChange(value.filter(v => v !== itemToRemove));
    };

    const selectedLabels = value.map(v => {
        const option = options.find(opt => opt.value === v);
        return option?.label || v.toString();
    });

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between min-h-10 h-auto",
                            error && "border-red-500",
                            !value.length && "text-muted-foreground"
                        )}
                    >
                        <div className="flex flex-wrap gap-1 flex-1">
                            {value.length === 0 && (
                                <span>{placeholder}</span>
                            )}
                            {value.length > 0 && value.length <= 3 && (
                                selectedLabels.map((label, index) => (
                                    <Badge
                                        key={value[index]}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {label}
                                        <button
                                            type="button"
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(value[index]);
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))
                            )}
                            {value.length > 3 && (
                                <span className="text-sm">
                                    {value.length} selected
                                </span>
                            )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder={t('search')} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = value.includes(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => handleSelect(option.value)}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}