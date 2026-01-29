import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
    User,
    IdCard,
    MapPin,
    Users,
    Heart,
    Briefcase,
    Shield,
    Banknote,
    Phone,
    FileText,
    Upload,
    Edit,
    ArrowLeft,
    Download,
    Eye
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';

interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    address: string;
    parents_status: string;
    marital_status: string;
    children_count: number | null;
    employment_status: string;
    workplace: string | null;
    previous_workplace: string | null;
    military_number: string | null;
    military_rank: string | null;
    bank_name: string | null;
    bank_account_number: string | null;
    bank_branch: string | null;
    agent_name: string | null;
    agent_phone: string | null;
    agent_relationship: string | null;
    profile_image: string | null;
    agent_passport_number: string | null;
}

interface Props {
    martyr: Martyr;
}

const InfoCard = ({
    title,
    children,
    icon: Icon
}: {
    title: string;
    children: React.ReactNode;
    icon: any;
}) => (
    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    </div>
);

const InfoField = ({
    label,
    value,
    icon: Icon,
    noDataText
}: {
    label: string;
    value: string | number | null;
    icon?: any;
    noDataText: string;
}) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            {Icon && <Icon size={14} className="text-gray-500 dark:text-gray-400" />}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {label}
            </span>
        </div>
        <p className="text-gray-900 dark:text-gray-100 font-medium">
            {value || noDataText}
        </p>
    </div>
);

const FilePreview = ({
    title,
    filePath,
    fileType,
    noDataText,
    documentLabel,
    viewFileText,
    downloadFileText
}: {
    title: string;
    filePath: string | null;
    fileType: 'image' | 'document';
    noDataText: string;
    documentLabel: string;
    viewFileText: string;
    downloadFileText: string;
}) => (
    <div className="space-y-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
        </span>
        {filePath ? (
            <div className="mt-2">
                {fileType === 'image' ? (
                    <div className="relative group">
                        <img
                            src={`/storage/${filePath}`}
                            alt={title}
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <a
                                href={`/storage/${filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                            >
                                <Eye size={16} className="text-gray-700 dark:text-gray-300" />
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <FileText size={24} className="text-gray-500 dark:text-gray-400" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {documentLabel}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF / Image
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={`/storage/${filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title={viewFileText}
                            >
                                <Eye size={16} />
                            </a>
                            <a
                                href={`/storage/${filePath}`}
                                download
                                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title={downloadFileText}
                            >
                                <Download size={16} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
                {noDataText}
            </p>
        )}
    </div>
);

export default function Show({ martyr }: Props) {
    const { t } = useTranslation();
    const { can } = usePermissions('martyrs');
    const canUpdate = can('canUpdate');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.title'),
            href: '/martyrs',
        },
        {
            title: martyr.full_name,
            href: `/martyrs/${martyr.id}`,
        },
    ];

    const getParentsStatusLabel = (status: string) => {
        switch (status) {
            case 'both_deceased': return t('martyrs.both_deceased');
            case 'father_alive': return t('martyrs.father_alive');
            case 'mother_alive': return t('martyrs.mother_alive');
            default: return t('martyrs.both_alive');
        }
    };

    const getMaritalStatusLabel = (status: string) => {
        return status === 'married' ? t('martyrs.married') : t('martyrs.single');
    };

    const getEmploymentStatusLabel = (status: string) => {
        return status === 'employee' ? t('martyrs.employed') : t('martyrs.unemployed');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('martyrs.view_martyr')}: ${martyr.full_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-800 shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        {martyr.profile_image && (
                            <div className="flex-shrink-0">
                                <img
                                    src={`/storage/${martyr.profile_image}`}
                                    alt={t('martyrs.profile_image')}
                                    className="w-16 h-16 object-cover rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {martyr.full_name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {t('martyrs.martyr_details')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {canUpdate && (
                            <Link href={`/martyrs/${martyr.id}/edit`}>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Edit size={16} />
                                    {t('martyrs.edit_martyr')}
                                </Button>
                            </Link>
                        )}
                        <Link href="/martyrs">
                            <Button className="flex items-center gap-2">
                                <ArrowLeft size={16} />
                                {t('martyrs.back_to_list')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Personal Information */}
                    <InfoCard title={t('martyrs.personal_info')} icon={User}>
                        <InfoField
                            label={t('martyrs.full_name')}
                            value={martyr.full_name}
                            icon={User}
                            noDataText={t('martyrs.no_data')}
                        />
                        <InfoField
                            label={t('martyrs.national_id')}
                            value={martyr.national_id}
                            icon={IdCard}
                            noDataText={t('martyrs.no_data')}
                        />
                        <InfoField
                            label={t('martyrs.address')}
                            value={martyr.address}
                            icon={MapPin}
                            noDataText={t('martyrs.no_data')}
                        />
                    </InfoCard>

                    {/* Family Information */}
                    <InfoCard title={t('martyrs.family_info')} icon={Users}>
                        <InfoField
                            label={t('martyrs.parents_status')}
                            value={getParentsStatusLabel(martyr.parents_status)}
                            icon={Users}
                            noDataText={t('martyrs.no_data')}
                        />
                        <InfoField
                            label={t('martyrs.marital_status')}
                            value={getMaritalStatusLabel(martyr.marital_status)}
                            icon={Heart}
                            noDataText={t('martyrs.no_data')}
                        />
                        {martyr.children_count && (
                            <InfoField
                                label={t('martyrs.children_count')}
                                value={martyr.children_count}
                                icon={Users}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        <InfoField
                            label={t('martyrs.employment_status')}
                            value={getEmploymentStatusLabel(martyr.employment_status)}
                            icon={Briefcase}
                            noDataText={t('martyrs.no_data')}
                        />
                        {martyr.workplace && (
                            <InfoField
                                label={t('martyrs.workplace')}
                                value={martyr.workplace}
                                icon={Briefcase}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        {martyr.previous_workplace && (
                            <InfoField
                                label={t('martyrs.previous_workplace')}
                                value={martyr.previous_workplace}
                                icon={Briefcase}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                    </InfoCard>

                    {/* Military Information */}
                    {martyr.employment_status === 'military' && (martyr.military_number || martyr.military_rank) && (
                        <InfoCard title={t('martyrs.military_info')} icon={Shield}>
                            {martyr.military_number && (
                                <InfoField
                                    label={t('martyrs.military_number')}
                                    value={martyr.military_number}
                                    icon={Shield}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.military_rank && (
                                <InfoField
                                    label={t('martyrs.military_rank')}
                                    value={martyr.military_rank}
                                    icon={Shield}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                        </InfoCard>
                    )}

                    {/* Banking Information */}
                    {(martyr.bank_name || martyr.bank_account_number || martyr.bank_branch) && (
                        <InfoCard title={t('martyrs.banking_info')} icon={Banknote}>
                            {martyr.bank_name && (
                                <InfoField
                                    label={t('martyrs.bank_name')}
                                    value={martyr.bank_name}
                                    icon={Banknote}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.bank_account_number && (
                                <InfoField
                                    label={t('martyrs.bank_account_number')}
                                    value={martyr.bank_account_number}
                                    icon={Banknote}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.bank_branch && (
                                <InfoField
                                    label={t('martyrs.bank_branch')}
                                    value={martyr.bank_branch}
                                    icon={Banknote}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                        </InfoCard>
                    )}

                    {/* Agent Information */}
                    {(martyr.agent_name || martyr.agent_phone || martyr.agent_relationship || martyr.agent_passport_number) && (
                        <InfoCard title={t('martyrs.agent_info')} icon={Phone}>
                            {martyr.agent_name && (
                                <InfoField
                                    label={t('martyrs.agent_name')}
                                    value={martyr.agent_name}
                                    icon={User}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.agent_phone && (
                                <InfoField
                                    label={t('martyrs.agent_phone')}
                                    value={martyr.agent_phone}
                                    icon={Phone}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.agent_relationship && (
                                <InfoField
                                    label={t('martyrs.agent_relationship')}
                                    value={martyr.agent_relationship}
                                    icon={Users}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.agent_passport_number && (
                                <InfoField
                                    label={t('martyrs.agent_passport_number')}
                                    value={martyr.agent_passport_number}
                                    icon={IdCard}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                        </InfoCard>
                    )}

                    {/* Attachments */}
                    {martyr.profile_image && (
                        <InfoCard title={t('martyrs.attachments')} icon={Upload}>
                            <div className="md:col-span-2 space-y-4">
                                <FilePreview
                                    title={t('martyrs.profile_picture')}
                                    filePath={martyr.profile_image}
                                    fileType="image"
                                    noDataText={t('martyrs.no_data')}
                                    documentLabel={t('martyrs.national_id_document')}
                                    viewFileText={t('martyrs.view_file')}
                                    downloadFileText={t('martyrs.download_file')}
                                />
                                <FilePreview
                                    title={t('martyrs.profile_picture')}
                                    filePath={martyr.profile_image}
                                    fileType="image"
                                    noDataText={t('martyrs.no_data')}
                                    documentLabel={t('martyrs.profile_picture')}
                                    viewFileText={t('martyrs.view_file')}
                                    downloadFileText={t('martyrs.download_file')}
                                />
                            </div>
                        </InfoCard>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}