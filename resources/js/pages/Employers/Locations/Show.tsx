import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Edit, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { index, show, edit } from '@/routes/employers/locations';
import { index as employersIndex } from '@/routes/employers';

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
    location: Location;
}

export default function Show({ employer, location }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Employers', href: employersIndex().url },
        { title: employer.name_ar, href: index(employer.id).url },
        { title: location.name_ar, href: show({ employer: employer.id, location: location.id }).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Employer Location: ${location.name_ar}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index(employer.id).url}>
                            <ArrowLeft className="h-4 w-4" />
                            Back to Locations
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Location Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Name (Arabic)
                                        </label>
                                        <p className="text-lg font-medium">{location.name_ar}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Name (English)
                                        </label>
                                        <p className="text-lg font-medium">{location.name_en || '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Employer
                                    </label>
                                    <p className="text-lg font-medium">
                                        {location.employer ? (
                                            <Link href={`/employers/${location.employer.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                                {location.employer.name_ar} / {location.employer.name_en}
                                            </Link>
                                        ) : (
                                            '-'
                                        )}
                                    </p>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </label>
                                        <div className="mt-1">
                                            <Badge variant={location.is_active ? 'default' : 'secondary'}>
                                                {location.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Created At
                                        </label>
                                        <p className="text-sm">{location.created_at}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Updated At
                                        </label>
                                        <p className="text-sm">{location.updated_at}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full">
                                    <Link href={edit({ employer: employer.id, location: location.id }).url}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Location
                                    </Link>
                                </Button>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={employersIndex().url}>
                                        <Users className="h-4 w-4 mr-2" />
                                        View Employers
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}