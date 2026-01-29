import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface MobileCardViewProps<TData> {
    data: TData[];
    columns: {
        key: keyof TData;
        label: string;
        render?: (value: any, item: TData) => React.ReactNode;
        badge?: boolean;
        className?: string;
    }[];
    actions?: (item: TData) => React.ReactNode;
    loading?: boolean;
    emptyMessage?: string;
}

export function MobileCardView<TData>({
    data,
    columns,
    actions,
    loading = false,
    emptyMessage,
}: MobileCardViewProps<TData>) {
    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-3 bg-muted rounded w-full"></div>
                                <div className="h-3 bg-muted rounded w-2/3"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    {emptyMessage || t('dataTable.noData')}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">
                                {columns[0]?.render
                                    ? columns[0].render(item[columns[0].key], item)
                                    : String(item[columns[0].key] || '')}
                            </CardTitle>
                            {actions && (
                                <div className="flex gap-2">
                                    {actions(item)}
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid gap-3">
                            {columns.slice(1).map((column) => {
                                const value = item[column.key];
                                const displayValue = column.render
                                    ? column.render(value, item)
                                    : String(value || '');

                                return (
                                    <div key={String(column.key)} className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {column.label}:
                                        </span>
                                        <div className={column.className}>
                                            {column.badge ? (
                                                <Badge variant="secondary">
                                                    {displayValue}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm">
                                                    {displayValue}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}