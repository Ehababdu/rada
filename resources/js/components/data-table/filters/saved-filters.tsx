import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import * as React from 'react';
import { Column, Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface SavedFilter {
    id: string;
    name: string;
    filters: Record<string, unknown>;
    createdAt: Date;
}

interface SavedFiltersProps<TData> {
    table: Table<TData>;
    onApplyFilter: (filters: Record<string, unknown>) => void;
}

export function SavedFilters<TData>({
    table,
    onApplyFilter,
}: SavedFiltersProps<TData>) {
    const { t } = useTranslation();
    const [savedFilters, setSavedFilters] = React.useState<SavedFilter[]>([]);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
    const [filterName, setFilterName] = React.useState('');

    // Load saved filters from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('data-table-saved-filters');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSavedFilters(
                    parsed.map((filter: { id: string; name: string; filters: Record<string, unknown>; createdAt: string }) => ({
                        ...filter,
                        createdAt: new Date(filter.createdAt),
                    })),
                );
            } catch (error) {
                console.error('Failed to load saved filters:', error);
            }
        }
    }, []);

    // Save filters to localStorage whenever savedFilters changes
    React.useEffect(() => {
        localStorage.setItem(
            'data-table-saved-filters',
            JSON.stringify(savedFilters),
        );
    }, [savedFilters]);

    const getCurrentFilters = () => {
        const filters: Record<string, unknown> = {};

        table.getAllColumns().forEach((column: Column<TData, unknown>) => {
            const filterValue = column.getFilterValue();
            if (filterValue !== undefined) {
                filters[column.id] = filterValue;
            }
        });

        return filters;
    };

    const saveCurrentFilters = () => {
        if (!filterName.trim()) return;

        const currentFilters = getCurrentFilters();
        if (Object.keys(currentFilters).length === 0) return;

        const newFilter: SavedFilter = {
            id: Date.now().toString(),
            name: filterName.trim(),
            filters: currentFilters,
            createdAt: new Date(),
        };

        setSavedFilters((prev) => [...prev, newFilter]);
        setFilterName('');
        setIsSaveDialogOpen(false);
    };

    const applySavedFilter = (filter: SavedFilter) => {
        onApplyFilter(filter.filters);
    };

    const deleteSavedFilter = (filterId: string) => {
        setSavedFilters((prev) => prev.filter((f) => f.id !== filterId));
    };

    const hasActiveFilters = table
        .getAllColumns()
        .some((column: Column<TData, unknown>) => column.getFilterValue() !== undefined);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Bookmark className="mr-2 h-4 w-4" />
                        {t('dataTable.savedFilters')}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        {t('dataTable.savedFilters')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {savedFilters.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            {t('dataTable.noSavedFilters')}
                        </div>
                    ) : (
                        savedFilters.map((filter) => (
                            <DropdownMenuItem
                                key={filter.id}
                                onClick={() => applySavedFilter(filter)}
                                className="flex items-center justify-between"
                            >
                                <span className="truncate">{filter.name}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSavedFilter(filter.id);
                                    }}
                                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </DropdownMenuItem>
                        ))
                    )}

                    <DropdownMenuSeparator />

                    <Dialog
                        open={isSaveDialogOpen}
                        onOpenChange={setIsSaveDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <DropdownMenuItem
                                disabled={!hasActiveFilters}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <BookmarkCheck className="mr-2 h-4 w-4" />
                                {t('dataTable.saveCurrentFilters')}
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {t('dataTable.saveFilter')}
                                </DialogTitle>
                                <DialogDescription>
                                    {t('dataTable.saveFilterDescription')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="filter-name">
                                        {t('dataTable.filterName')}
                                    </Label>
                                    <Input
                                        id="filter-name"
                                        value={filterName}
                                        onChange={(e) =>
                                            setFilterName(e.target.value)
                                        }
                                        placeholder={t(
                                            'dataTable.enterFilterName',
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsSaveDialogOpen(false)}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={saveCurrentFilters}
                                    disabled={!filterName.trim()}
                                >
                                    {t('save')}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
