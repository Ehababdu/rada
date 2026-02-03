import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    FilterX,
    MapPin,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    index as employersIndex,
    show as employersShow,
} from '@/routes/employers';
import { create, edit, index, show } from '@/routes/employers/locations';
import { BreadcrumbItem } from '@/types';

interface Location {
    id: number;
    name_ar: string;
    name_en: string;
    employer?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    employer: {
        id: number;
        name_ar: string;
        name_en: string;
    };
    locations: {
        data: Location[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links: any[];
    };
    filters: {
        search?: string;
        is_active?: string;
    };
}

export default function Index({ employer, locations, filters }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [search, setSearch] = useState(filters.search || '');
    const [isActive, setIsActive] = useState(filters.is_active || '');
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('employers.title'), href: employersIndex().url },
        { title: employer.name_ar, href: employersShow(employer.id).url },
        { title: t('locations.title'), href: index(employer.id).url },
    ];

    const handleSearch = (value: string) => {
        setSearch(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            const params: Record<string, string> = {};
            if (value) params.search = value;
            if (isActive) params.is_active = isActive;
            router.get(index(employer.id).url, params, {
                preserveState: true,
                replace: true,
            });
        }, 400);
    };

    const handleStatusChange = (value: string) => {
        setIsActive(value === 'all' ? '' : value);
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (value && value !== 'all') params.is_active = value;
        router.get(index(employer.id).url, params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setIsActive('');
        router.get(index(employer.id).url);
    };

    const handleDelete = (locationId: number) => {
        if (confirm(t('locations.confirm_delete'))) {
            router.delete(
                `/employers/${employer.id}/locations/${locationId}`,
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('locations.title')} - ${employer.name_ar}`} />

            <div
                className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('locations.title')}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('locations.manage_locations')} -{' '}
                                <span className="font-semibold text-foreground">
                                    {employer.name_ar}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Button asChild className="shrink-0 shadow-sm">
                        <Link href={create(employer.id).url}>
                            <Plus
                                className={cn(
                                    'h-4 w-4',
                                    isRTL ? 'ml-2' : 'mr-2',
                                )}
                            />
                            {t('locations.add_location')}
                        </Link>
                    </Button>
                </div>

                {/* Filters Section */}
                <Card className="border-none bg-muted/20 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="min-w-[240px] flex-1 space-y-1.5">
                                <Label
                                    htmlFor="search"
                                    className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                                >
                                    {t('search')}
                                </Label>
                                <div className="relative">
                                    <Search
                                        className={cn(
                                            'absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
                                            isRTL ? 'right-3' : 'left-3',
                                        )}
                                    />
                                    <Input
                                        id="search"
                                        placeholder={t(
                                            'locations.search_placeholder',
                                        )}
                                        value={search}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        className={cn(
                                            'border-muted-foreground/20 bg-background',
                                            isRTL ? 'pr-10' : 'pl-10',
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="w-full space-y-1.5 md:w-48">
                                <Label
                                    htmlFor="status"
                                    className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                                >
                                    {t('status')}
                                </Label>
                                <Select
                                    value={isActive || 'all'}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue
                                            placeholder={t('all')}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('all')}
                                        </SelectItem>
                                        <SelectItem value="1">
                                            {t('active')}
                                        </SelectItem>
                                        <SelectItem value="0">
                                            {t('inactive')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(search || isActive) && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="h-10 text-muted-foreground transition-colors hover:text-primary"
                                >
                                    <FilterX
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('reset')}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="overflow-hidden border-none shadow-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead
                                            className={cn(
                                                'h-12 px-4 font-bold',
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left',
                                            )}
                                        >
                                            #
                                        </TableHead>
                                        <TableHead
                                            className={cn(
                                                'h-12 px-4 font-bold',
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left',
                                            )}
                                        >
                                            {t('locations.name_ar')}
                                        </TableHead>
                                        <TableHead
                                            className={cn(
                                                'h-12 px-4 font-bold',
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left',
                                            )}
                                        >
                                            {t('locations.name_en')}
                                        </TableHead>
                                        <TableHead
                                            className={cn(
                                                'h-12 px-4 font-bold',
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left',
                                            )}
                                        >
                                            {t('status')}
                                        </TableHead>
                                        <TableHead
                                            className={cn(
                                                'h-12 px-4 font-bold',
                                                isRTL
                                                    ? 'text-right'
                                                    : 'text-left',
                                            )}
                                        >
                                            {t('actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-32 text-center text-muted-foreground"
                                            >
                                                {t('locations.no_locations')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        locations.data.map((location) => (
                                            <TableRow
                                                key={location.id}
                                                className="transition-colors hover:bg-muted/20"
                                            >
                                                <TableCell className="px-4 py-3 font-mono text-muted-foreground">
                                                    {location.id}
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                            <MapPin className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <span className="font-bold">
                                                            {location.name_ar}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-muted-foreground italic">
                                                    {location.name_en}
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <Badge
                                                        className={cn(
                                                            'gap-1 border-none px-2 py-0.5 font-medium shadow-none',
                                                            location.is_active
                                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-100',
                                                        )}
                                                    >
                                                        {location.is_active ? (
                                                            <CheckCircle className="h-3 w-3" />
                                                        ) : (
                                                            <XCircle className="h-3 w-3" />
                                                        )}
                                                        {location.is_active
                                                            ? t('active')
                                                            : t('inactive')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align={
                                                                isRTL
                                                                    ? 'start'
                                                                    : 'end'
                                                            }
                                                            className="w-44"
                                                        >
                                                            <DropdownMenuLabel>
                                                                {t('actions')}
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        show({
                                                                            employer:
                                                                                employer.id,
                                                                            location:
                                                                                location.id,
                                                                        }).url
                                                                    }
                                                                >
                                                                    <Eye
                                                                        className={cn(
                                                                            'h-4 w-4',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t('view')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        edit({
                                                                            employer:
                                                                                employer.id,
                                                                            location:
                                                                                location.id,
                                                                        }).url
                                                                    }
                                                                >
                                                                    <Edit
                                                                        className={cn(
                                                                            'h-4 w-4',
                                                                            isRTL
                                                                                ? 'ml-2'
                                                                                : 'mr-2',
                                                                        )}
                                                                    />
                                                                    {t('edit')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:bg-destructive/10"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        location.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2
                                                                    className={cn(
                                                                        'h-4 w-4',
                                                                        isRTL
                                                                            ? 'ml-2'
                                                                            : 'mr-2',
                                                                    )}
                                                                />
                                                                {t('delete')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {locations.last_page > 1 && (
                    <div className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 shadow-sm sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            {t('showing')}{' '}
                            <span className="font-semibold text-foreground">
                                {locations.from || 1}
                            </span>{' '}
                            {t('to')}{' '}
                            <span className="font-semibold text-foreground">
                                {locations.to || locations.data.length}
                            </span>{' '}
                            {t('of')}{' '}
                            <span className="font-semibold text-foreground">
                                {locations.total}
                            </span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const params: Record<string, string> = {
                                        page: String(
                                            locations.current_page - 1,
                                        ),
                                    };
                                    if (search) params.search = search;
                                    if (isActive) params.is_active = isActive;
                                    router.get(
                                        index(employer.id).url,
                                        params,
                                    );
                                }}
                                disabled={locations.current_page === 1}
                            >
                                <ChevronLeft
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'ml-1' : 'mr-1',
                                    )}
                                />
                                {t('previous')}
                            </Button>
                            <span className="px-4 text-sm font-medium">
                                {locations.current_page} / {locations.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const params: Record<string, string> = {
                                        page: String(
                                            locations.current_page + 1,
                                        ),
                                    };
                                    if (search) params.search = search;
                                    if (isActive) params.is_active = isActive;
                                    router.get(
                                        index(employer.id).url,
                                        params,
                                    );
                                }}
                                disabled={
                                    locations.current_page ===
                                    locations.last_page
                                }
                            >
                                {t('next')}
                                <ChevronRight
                                    className={cn(
                                        'h-4 w-4',
                                        isRTL ? 'mr-1' : 'ml-1',
                                    )}
                                />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
