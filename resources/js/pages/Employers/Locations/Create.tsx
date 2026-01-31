import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { index as employersIndex } from '@/routes/employers';
import { create, index, store } from '@/routes/employers/locations';
import { BreadcrumbItem } from '@/types';

interface Employer {
    id: number;
    name_ar: string;
    name_en: string;
}

interface Props {
    employer: Employer;
}

export default function Create({ employer }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name_ar: '',
        name_en: '',
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Employers', href: employersIndex().url },
        { title: employer.name_ar, href: index(employer.id).url },
        { title: 'Create Location', href: create(employer.id).url },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store(employer.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Employer Location" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index(employer.id).url}>
                            <ArrowLeft className="h-4 w-4" />
                            Back to Locations
                        </Link>
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Create Employer Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name_ar">
                                        Name (Arabic) *
                                    </Label>
                                    <Input
                                        id="name_ar"
                                        value={data.name_ar}
                                        onChange={(e) =>
                                            setData('name_ar', e.target.value)
                                        }
                                        placeholder="Enter location name in Arabic"
                                        required
                                    />
                                    {errors.name_ar && (
                                        <p className="text-sm text-destructive">
                                            {errors.name_ar}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name_en">
                                        Name (English)
                                    </Label>
                                    <Input
                                        id="name_en"
                                        value={data.name_en}
                                        onChange={(e) =>
                                            setData('name_en', e.target.value)
                                        }
                                        placeholder="Enter location name in English"
                                    />
                                    {errors.name_en && (
                                        <p className="text-sm text-destructive">
                                            {errors.name_en}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Location'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={index(employer.id).url}>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
