import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, User as UserIcon } from 'lucide-react';

interface Props {
    roles: { id: number; name: string; display_name?: string }[];
}

export default function Create({ roles }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { toast } = useToast();
    const { flash } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('users.title'),
            href: '/users',
        },
        {
            title: t('users.create'),
            href: '/users/create',
        },
    ];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleRoleChange = (roleName: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            roles: checked
                ? [...prev.roles, roleName]
                : prev.roles.filter(role => role !== roleName)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            await router.post('/users', formData, {
                onSuccess: () => {
                    toast(t('users.create_success'), { variant: 'success' });
                },
                onError: (errors) => {
                    setErrors(errors);
                    toast(t('common.error'), { variant: 'destructive' });
                },
                onFinish: () => setIsSubmitting(false),
            });
        } catch (error) {
            setIsSubmitting(false);
            toast(t('common.error'), { variant: 'destructive' });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.create')} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('common.back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {t('users.create')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('users.description')}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                {t('users.create')}
                            </CardTitle>
                            <CardDescription>
                                {t('users.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('users.name')} *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder={t('users.name')}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('users.email')} *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder={t('users.email')}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('users.password')} *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder={t('users.password')}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Password Confirmation */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">{t('users.password_confirmation')} *</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                    placeholder={t('users.password_confirmation')}
                                    className={errors.password_confirmation ? 'border-red-500' : ''}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Roles */}
                            <div className="space-y-3">
                                <Label>{t('users.roles')}</Label>
                                <div className="space-y-2">
                                    {roles.map((role) => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={formData.roles.includes(role.name)}
                                                onCheckedChange={(checked) =>
                                                    handleRoleChange(role.name, checked as boolean)
                                                }
                                            />
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className="text-sm font-normal"
                                            >
                                                {role.display_name || role.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.roles && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {errors.roles}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/users')}
                                    disabled={isSubmitting}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? t('common.saving') : t('common.save')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}