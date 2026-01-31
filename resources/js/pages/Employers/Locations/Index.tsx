import { Head, Link } from '@inertiajs/react';
import { Edit, Eye, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
        links: any[];
    };
    filters: {
        search?: string;
        is_active?: string;
    };
}

export default function Index({ employer, locations, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isActive, setIsActive] = useState(filters.is_active || 'all');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Employers', href: employersIndex().url },
        { title: employer.name_ar, href: employersShow(employer.id).url },
        { title: 'Locations', href: index(employer.id).url },
    ];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (isActive && isActive !== 'all') params.set('is_active', isActive);
        window.location.href =
            index(employer.id).url +
            (params.toString() ? '?' + params.toString() : '');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employer Locations" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Employer Locations
                        </CardTitle>
                        <Button asChild>
                            <Link href={create(employer.id).url}>
                                <Plus className="h-4 w-4" />
                                Add Location
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search locations..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="max-w-sm"
                                />
                            </div>
                            <Select
                                value={isActive}
                                onValueChange={setIsActive}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="1">Active</SelectItem>
                                    <SelectItem value="0">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch} variant="outline">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name (Arabic)</TableHead>
                                        <TableHead>Name (English)</TableHead>
                                        <TableHead>Employer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                No locations found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        locations.data.map((location) => (
                                            <TableRow key={location.id}>
                                                <TableCell className="font-medium">
                                                    {location.id}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={
                                                            show({
                                                                employer:
                                                                    employer.id,
                                                                location:
                                                                    location.id,
                                                            }).url
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {location.name_ar}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={
                                                            show({
                                                                employer:
                                                                    employer.id,
                                                                location:
                                                                    location.id,
                                                            }).url
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {location.name_en}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {location.employer ? (
                                                        <Link
                                                            href={`/employers/${location.employer.id}`}
                                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            {
                                                                location
                                                                    .employer
                                                                    .name_ar
                                                            }{' '}
                                                            /{' '}
                                                            {
                                                                location
                                                                    .employer
                                                                    .name_en
                                                            }
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            location.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {location.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {location.created_at}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="sm"
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
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="sm"
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
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        'Are you sure you want to delete this location?',
                                                                    )
                                                                ) {
                                                                    // Handle delete
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination would go here */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
