import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';

// Icons
import { Columns, Download, FileText, Plus } from 'lucide-react';

import { Link } from '@inertiajs/react';

interface MartyrsActionsProps {
    canCreate: boolean;
    canExport: boolean;
    handleExport: (e: React.MouseEvent) => void;
    latestExportAvailable: boolean | null;
    latestExportUrl: string | null;
    isColumnsDialogOpen: boolean;
    setIsColumnsDialogOpen: (open: boolean) => void;
    availableColumns: Array<{ key: string; label: string; required: boolean }>;
    visibleColumns: string[];
    setVisibleColumns: (columns: string[]) => void;
    basicKeys: string[];
    additionalKeys: string[];
    areAllBasicSelected: boolean;
    areSomeBasicSelected: boolean;
    areAllAdditionalSelected: boolean;
    areSomeAdditionalSelected: boolean;
    isRTL: boolean;
}

export const MartyrsActions = React.memo<MartyrsActionsProps>(({
    canCreate,
    canExport,
    handleExport,
    latestExportAvailable,
    latestExportUrl,
    isColumnsDialogOpen,
    setIsColumnsDialogOpen,
    availableColumns,
    visibleColumns,
    setVisibleColumns,
    basicKeys,
    additionalKeys,
    areAllBasicSelected,
    areSomeBasicSelected,
    areAllAdditionalSelected,
    areSomeAdditionalSelected,
    isRTL,
}: MartyrsActionsProps) => {
    const { t } = useTranslation();

    return (
        <>
            {/* Create Button */}
            {canCreate && (
                <Button asChild className="transition-all hover:scale-105">
                    <Link href="/martyrs/create">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('martyrs.create')}
                    </Link>
                </Button>
            )}

            {/* Columns Dialog */}
            <Dialog open={isColumnsDialogOpen} onOpenChange={setIsColumnsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Columns className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('martyrs.columns')}</DialogTitle>
                        <DialogDescription>
                            {t('martyrs.columns_description', 'اختر الأعمدة التي تريد عرضها في الجدول')}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-96">
                        <div className="space-y-4">
                            {/* Basic Columns */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="basic-all"
                                        checked={areAllBasicSelected ? true : areSomeBasicSelected ? "indeterminate" : false}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setVisibleColumns([...new Set([...visibleColumns, ...basicKeys])]);
                                            } else {
                                                setVisibleColumns(visibleColumns.filter(c => !basicKeys.includes(c)));
                                            }
                                        }}
                                    />
                                    <Label htmlFor="basic-all" className="font-medium">
                                        {t('martyrs.basic_columns')}
                                    </Label>
                                </div>
                                <div className="ml-6 space-y-2">
                                    {availableColumns
                                        .filter(col => basicKeys.includes(col.key))
                                        .map((col) => (
                                            <div key={col.key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`col-${col.key}`}
                                                    checked={visibleColumns.includes(col.key)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setVisibleColumns([...visibleColumns, col.key]);
                                                        } else if (!col.required) {
                                                            setVisibleColumns(visibleColumns.filter(c => c !== col.key));
                                                        }
                                                    }}
                                                    disabled={col.required}
                                                />
                                                <Label htmlFor={`col-${col.key}`} className={col.required ? 'text-muted-foreground italic' : ''}>
                                                    {col.label} {col.required && '*'}
                                                </Label>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Additional Columns */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="additional-all"
                                        checked={areAllAdditionalSelected ? true : areSomeAdditionalSelected ? "indeterminate" : false}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setVisibleColumns([...new Set([...visibleColumns, ...additionalKeys])]);
                                            } else {
                                                setVisibleColumns(visibleColumns.filter(c => !additionalKeys.includes(c)));
                                            }
                                        }}
                                    />
                                    <Label htmlFor="additional-all" className="font-medium">
                                        {t('martyrs.additional_columns')}
                                    </Label>
                                </div>
                                <div className="ml-6 space-y-2">
                                    {availableColumns
                                        .filter(col => additionalKeys.includes(col.key))
                                        .map((col) => (
                                            <div key={col.key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`col-${col.key}`}
                                                    checked={visibleColumns.includes(col.key)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setVisibleColumns([...visibleColumns, col.key]);
                                                        } else if (!col.required) {
                                                            setVisibleColumns(visibleColumns.filter(c => c !== col.key));
                                                        }
                                                    }}
                                                    disabled={col.required}
                                                />
                                                <Label htmlFor={`col-${col.key}`} className={col.required ? 'text-muted-foreground italic' : ''}>
                                                    {col.label} {col.required && '*'}
                                                </Label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setVisibleColumns(availableColumns.map(c => c.key))}
                        >
                            {t('martyrs.reset_columns')}
                        </Button>
                        <Button onClick={() => setIsColumnsDialogOpen(false)}>
                            {t('martyrs.done')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export */}
            {canExport && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            {t('martyrs.export')}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleExport}>
                            <FileText className="mr-2 h-4 w-4" /> {t('martyrs.export_excel')}
                        </DropdownMenuItem>
                        {latestExportAvailable && (
                            <DropdownMenuItem
                                onClick={() => window.open(latestExportUrl || '', '_blank')}
                            >
                                <Download className="mr-2 h-4 w-4" /> {t('martyrs.download_latest')}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    );
});