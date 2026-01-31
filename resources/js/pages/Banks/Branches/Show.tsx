import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Icons
import { cn } from '@/lib/utils';
import {
    Activity,
    ArrowLeft,
    ArrowRight,
    Building2,
    Calendar,
    Clock,
    Edit,
    MapPin,
} from 'lucide-react';

interface Bank {
    id: number;
    name_ar: string;
}

interface Branch {
    id: number;
    name_ar: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    bank: Bank;
    branch: Branch;
}

export default function Show({ bank, branch }: Props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banks.title'), href: '/banks' },
        { title: bank.name_ar, href: `/banks/${bank.id}` },
        { title: t('branches.title'), href: `/banks/${bank.id}/branches` },
        {
            title: branch.name_ar,
            href: `/banks/${bank.id}/branches/${branch.id}`,
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            isRTL ? 'ar-SA' : 'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        );
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(
            isRTL ? 'ar-SA' : 'en-US',
            {
                hour: '2-digit',
                minute: '2-digit',
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${branch.name_ar} - ${bank.name_ar}`} />

            <div
                className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="rounded-full"
                        >
                            <Link href={`/banks/${bank.id}/branches`}>
                                {isRTL ? (
                                    <ArrowRight className="h-5 w-5" />
                                ) : (
                                    <ArrowLeft className="h-5 w-5" />
                                )}
                            </Link>
                        </Button>
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {branch.name_ar}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className="border-primary/20 bg-primary/5 text-primary italic"
                                >
                                    <Building2 className="mr-1 ml-1 h-3 w-3" />
                                    {bank.name_ar}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                {t('branches.branch_details_view')}
                            </p>
                        </div>
                    </div>

                    <Button asChild className="shadow-sm">
                        <Link
                            href={`/banks/${bank.id}/branches/${branch.id}/edit`}
                        >
                            <Edit
                                className={cn(
                                    'h-4 w-4',
                                    isRTL ? 'ml-2' : 'mr-2',
                                )}
                            />
                            {t('edit')}
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content Area */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Branch Basic Info */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-bold text-primary">
                                    <MapPin className="h-5 w-5" />
                                    {t('branches.basic_information')}
                                </CardTitle>
                                <CardDescription>
                                    {t('branches.basic_info_description')}
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {t('branches.name_ar')}
                                        </span>
                                        <span className="text-lg font-semibold">
                                            {branch.name_ar}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {t('branches.status')}
                                        </span>
                                        <div>
                                            <Badge className="border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/10">
                                                {t('active')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Parent Bank Info Card */}
                        <Card className="border-none bg-muted/30 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                                    <Building2 className="h-4 w-4" />
                                    {t('banks.parent_bank')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-sm">
                                            <Building2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-lg leading-none font-bold">
                                                {bank.name_ar}
                                            </p>
                                            <Link
                                                href={`/banks/${bank.id}`}
                                                className="mt-1 inline-block text-xs text-primary hover:underline"
                                            >
                                                {t('banks.view_bank_details')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Area (Metadata) */}
                    <div className="space-y-6">
                        <Card className="overflow-hidden border-none shadow-sm">
                            <CardHeader className="bg-muted/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                                    <Activity className="h-4 w-4" />
                                    {t('system_log')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                                            {t('created_at')}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatDate(branch.created_at)}
                                        </p>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(branch.created_at)}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                                            {t('updated_at')}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatDate(branch.updated_at)}
                                        </p>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(branch.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Action Footer */}
                        <div className="px-2">
                            <Button
                                variant="outline"
                                className="w-full text-muted-foreground transition-colors hover:text-primary"
                                asChild
                            >
                                <Link
                                    href={`/banks/${bank.id}/branches/${branch.id}/edit`}
                                >
                                    <Edit
                                        className={cn(
                                            'h-4 w-4',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    {t('branches.modify_branch_data')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
