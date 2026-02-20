import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    Briefcase,
    Download,
    Edit,
    Eye,
    FileText,
    Heart,
    IdCard,
    MapPin,
    Phone,
    Printer,
    Shield,
    Upload,
    User,
    Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Martyr {
    id: number;
    file_number: string;
    full_name: string;
    national_id: string;
    address: string;
    death_date: string | null;
    has_martyr_decision: boolean;
    decision_number: string | null;
    decision_date: string | null;
    parents_status_id: number | null;
    marital_status_id: number | null;
    children_count: number | null;
    wife_status: string | null;
    employment_status_id: number | null;
    workplace: string | null;
    previous_workplace: string | null;
    employer_id: number | null;
    employer_location_id: number | null;
    has_previous_workplace: boolean;
    previous_employer_id: number | null;
    previous_employer_location_id: number | null;
    military_number: string | null;
    military_rank_id: number | null;
    bank_id: number | null;
    branch_id: number | null;
    bank_account_number: string | null;
    agent_name: string | null;
    agent_phone: string | null;
    agent_relationship: string | null;
    profile_image: string | null;
    agent_passport_number: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    militaryRank?: { id: number; name_ar: string; name_en: string | null };
    bank?: { id: number; name_ar: string; name_en: string | null };
    branch?: { id: number; name_ar: string; name_en: string | null };
    employmentStatus?: { id: number; name: string };
    parentsStatus?: { id: number; name_ar: string; name_en: string | null };
    maritalStatus?: { id: number; name_ar: string; name_en: string | null };
    employer?: { id: number; name_ar: string; name_en: string | null };
    employerLocation?: { id: number; name_ar: string; name_en: string | null };
    previousEmployer?: { id: number; name_ar: string; name_en: string | null };
    previousEmployerLocation?: { id: number; name_ar: string; name_en: string | null };
    jobGrade?: { id: number; name_ar: string; name_en: string | null };
    attachments?: Array<{
        id: number;
        attachment_type: number;
        file_path: string | null;
        original_filename: string;
        mime_type: string;
        file_size: number;
        description: string | null;
        file_url: string;
        formatted_file_size: string;
        attachmentType?: { id: number; label: string };
    }>;
}

interface Props {
    martyr: Martyr;
}

const InfoCard = ({
    title,
    children,
    icon: Icon,
}: {
    title: string;
    children: React.ReactNode;
    icon: React.ComponentType<{ className?: string; size?: number }>;
}) => (
    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-sidebar-border dark:bg-gray-800 dark:hover:shadow-lg">
        <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                    <Icon
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                    />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {children}
            </div>
        </div>
    </div>
);

const InfoField = ({
    label,
    value,
    icon: Icon,
    noDataText,
}: {
    label: string;
    value: string | number | null;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    noDataText: string;
}) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            {Icon && (
                <Icon size={14} className="text-gray-500 dark:text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {label}
            </span>
        </div>
        <p className="font-medium text-gray-900 dark:text-gray-100">
            {value || noDataText}
        </p>
    </div>
);

const FilePreview = ({
    title,
    filePath,
    fileUrl,
    fileType,
    noDataText,
    documentLabel,
    viewFileText,
    downloadFileText,
}: {
    title: string;
    filePath: string | null;
    fileUrl?: string;
    fileType: 'image' | 'document';
    noDataText: string;
    documentLabel: string;
    viewFileText: string;
    downloadFileText: string;
}) => {
    const fileSrc = fileUrl || (filePath ? `/storage/${filePath}` : null);

    return (
        <div className="space-y-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
            </span>
            {fileSrc ? (
                <div className="mt-2">
                    {fileType === 'image' ? (
                        <div className="group relative">
                            <img
                                src={fileSrc}
                                alt={title}
                                className="h-32 w-32 rounded-lg border border-gray-200 object-cover shadow-sm dark:border-gray-600"
                            />
                            <div className="bg-opacity-0 group-hover:bg-opacity-30 absolute inset-0 flex items-center justify-center rounded-lg bg-black transition-all duration-200">
                                <a
                                    href={fileSrc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-white p-2 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-800"
                                >
                                    <Eye
                                        size={16}
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                            <FileText
                                size={24}
                                className="text-gray-500 dark:text-gray-400"
                            />
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
                                    href={fileSrc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    title={viewFileText}
                                >
                                    <Eye size={16} />
                                </a>
                                <a
                                    href={fileSrc}
                                    download
                                    className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                    title={downloadFileText}
                                >
                                    <Download size={16} />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-500 italic dark:text-gray-400">
                    {noDataText}
                </p>
            )}
        </div>
    );
};

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

    const parentsStatusIdMap: Record<number, string> = {
        1: 'كلا الوالدين متوفيان',
        2: 'الأب حي',
        3: 'الأم حية',
        4: 'كلا الوالدين أحياء',
    };

    const getParentsStatusLabel = (martyr: Martyr) => {
        if (martyr.parentsStatus) {
            return (
                martyr.parentsStatus.name_ar ||
                martyr.parentsStatus.name_en ||
                parentsStatusIdMap[martyr.parents_status_id || 0] ||
                t('martyrs.no_data')
            );
        }

        return parentsStatusIdMap[martyr.parents_status_id || 0] || t('martyrs.no_data');
    };

    const maritalStatusIdMap: Record<number, string> = {
        1: 'متزوج',
        2: 'أعزب',
    };

    const getMaritalStatusLabel = (martyr: Martyr) => {
        if (martyr.maritalStatus) {
            return (
                martyr.maritalStatus.name_ar ||
                martyr.maritalStatus.name_en ||
                maritalStatusIdMap[martyr.marital_status_id || 0] ||
                t('martyrs.no_data')
            );
        }

        return maritalStatusIdMap[martyr.marital_status_id || 0] || t('martyrs.no_data');
    };

    const employmentStatusIdMap: Record<number, string> = {
        1: 'موظف',
        2: 'عسكري',
    };

    const getEmploymentStatusLabel = (martyr: Martyr) => {
        if (martyr.employmentStatus) {
            // employmentStatus may have `name` or `name_ar`
            // prefer Arabic fields when available
            // @ts-ignore
            return (
                // @ts-ignore
                martyr.employmentStatus.name_ar ||
                // @ts-ignore
                martyr.employmentStatus.name ||
                // @ts-ignore
                martyr.employmentStatus.name_en ||
                employmentStatusIdMap[martyr.employment_status_id || 0] ||
                t('martyrs.no_data')
            );
        }

        return employmentStatusIdMap[martyr.employment_status_id || 0] || t('martyrs.no_data');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('martyrs.view_martyr')}: ${martyr.full_name}`} />
            <div className="flex h-full min-h-screen flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
                {/* Header */}
                <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-sidebar-border dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        {martyr.profile_image && (
                            <div className="flex-shrink-0">
                                <img
                                    src={`/storage/${martyr.profile_image}`}
                                    alt={t('martyrs.profile_image')}
                                    className="h-16 w-16 rounded-full border-2 border-gray-200 object-cover shadow-sm dark:border-gray-600"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {martyr.full_name}
                            </h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                {t('martyrs.martyr_details')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {canUpdate && (
                            <Link href={`/martyrs/${martyr.id}/edit`}>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Edit size={16} />
                                    {t('martyrs.edit_martyr')}
                                </Button>
                            </Link>
                        )}
                        <Link href={`/martyrs/${martyr.id}/print`} target="_blank">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Printer size={16} />
                                {t('martyrs.print_martyr')}
                            </Button>
                        </Link>
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
                            label={t('martyrs.file_number')}
                            value={martyr.file_number}
                            icon={FileText}
                            noDataText={t('martyrs.no_data')}
                        />
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
                        {martyr.death_date && (
                            <InfoField
                                label={t('martyrs.death_date')}
                                value={new Date(martyr.death_date).toLocaleDateString('ar-EG')}
                                icon={Heart}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        <InfoField
                            label={t('martyrs.status')}
                            value={martyr.status === 'complete' ? t('martyrs.status.complete') : t('martyrs.status.incomplete')}
                            icon={Shield}
                            noDataText={t('martyrs.no_data')}
                        />
                    </InfoCard>

                    {/* Martyr Decision Information */}
                    {martyr.has_martyr_decision && (
                        <InfoCard title={t('martyrs.martyr_decision_info')} icon={Shield}>
                            <InfoField
                                label={t('martyrs.decision_number')}
                                value={martyr.decision_number}
                                icon={FileText}
                                noDataText={t('martyrs.no_data')}
                            />
                            {martyr.decision_date && (
                                <InfoField
                                    label={t('martyrs.decision_date')}
                                    value={new Date(martyr.decision_date).toLocaleDateString('ar-EG')}
                                    icon={Heart}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                        </InfoCard>
                    )}

                    {/* Family Information */}
                    <InfoCard title={t('martyrs.family_info')} icon={Users}>
                        <InfoField
                            label={t('martyrs.parents_status')}
                            value={getParentsStatusLabel(martyr)}
                            icon={Users}
                            noDataText={t('martyrs.no_data')}
                        />
                        <InfoField
                            label={t('martyrs.marital_status')}
                            value={getMaritalStatusLabel(martyr)}
                            icon={Heart}
                            noDataText={t('martyrs.no_data')}
                        />
                        {martyr.children_count !== null && (
                            <InfoField
                                label={t('martyrs.children_count')}
                                value={martyr.children_count}
                                icon={Users}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        {martyr.wife_status && (
                            <InfoField
                                label={t('martyrs.wife_status')}
                                value={martyr.wife_status}
                                icon={Heart}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        <InfoField
                            label={t('martyrs.employment_status')}
                            value={getEmploymentStatusLabel(martyr)}
                            icon={Briefcase}
                            noDataText={t('martyrs.no_data')}
                        />
                        {martyr.jobGrade && (
                            <InfoField
                                label={t('martyrs.job_grade')}
                                value={martyr.jobGrade.name_ar}
                                icon={Briefcase}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        {martyr.employer && (
                            <InfoField
                                label={t('martyrs.employer')}
                                value={martyr.employer.name_ar}
                                icon={Briefcase}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        {martyr.employerLocation && (
                            <InfoField
                                label={t('martyrs.employer_location')}
                                value={martyr.employerLocation.name_ar}
                                icon={MapPin}
                                noDataText={t('martyrs.no_data')}
                            />
                        )}
                        <InfoField
                            label={t('martyrs.has_previous_workplace')}
                            value={martyr.has_previous_workplace ? (t('common.yes') !== 'common.yes' ? t('common.yes') : 'نعم') : 'لا'}
                            icon={Briefcase}
                            noDataText={t('martyrs.no_data')}
                        />
                        
                    </InfoCard>

                    {/* Military Information */}
                    {(martyr.military_number || martyr.militaryRank) && (
                        <InfoCard
                            title={t('martyrs.military_info')}
                            icon={Shield}
                        >
                            {martyr.military_number && (
                                <InfoField
                                    label={t('martyrs.military_number')}
                                    value={martyr.military_number}
                                    icon={Shield}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.militaryRank && (
                                <InfoField
                                    label={t('martyrs.military_rank')}
                                    value={martyr.militaryRank.name_ar}
                                    icon={Shield}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                        </InfoCard>
                    )}

                    {/* Previous Employment */}
                    {martyr.has_previous_workplace && (
                        <InfoCard title={t('martyrs.previous_employment')} icon={Briefcase}>
                            {martyr.previousEmployer && (
                                <InfoField
                                    label={t('martyrs.previous_employer')}
                                    value={martyr.previousEmployer.name_ar}
                                    icon={Briefcase}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                            {martyr.previousEmployerLocation && (
                                <InfoField
                                    label={t('martyrs.previous_employer_location')}
                                    value={martyr.previousEmployerLocation.name_ar}
                                    icon={MapPin}
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
                    )}

                    {/* Banking Information */}
                    {(martyr.bank || martyr.bank_account_number || martyr.branch) && (
                        <InfoCard
                            title={t('martyrs.banking_info')}
                            icon={Banknote}
                        >
                            {martyr.bank && (
                                <InfoField
                                    label={t('martyrs.bank_name')}
                                    value={martyr.bank.name_ar}
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
                            {martyr.branch && (
                                <InfoField
                                    label={t('martyrs.bank_branch')}
                                    value={martyr.branch.name_ar}
                                    icon={Banknote}
                                    noDataText={t('martyrs.no_data')}
                                />
                            )}
                        </InfoCard>
                    )}

                    {/* Agent Information */}
                    {(martyr.agent_name ||
                        martyr.agent_phone ||
                        martyr.agent_relationship ||
                        martyr.agent_passport_number) && (
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
                    {martyr.attachments && martyr.attachments.length > 0 && (
                        <InfoCard
                            title={t('martyrs.attachments')}
                            icon={Upload}
                        >
                            <div className="space-y-4 md:col-span-2">
                                {martyr.attachments.map((attachment) => (
                                    <FilePreview
                                        key={attachment.id}
                                        title={attachment.attachmentType?.label || t('martyrs.file')}
                                        filePath={attachment.file_path}
                                        fileUrl={attachment.file_url}
                                        fileType={attachment.mime_type?.startsWith('image/') ? 'image' : 'document'}
                                        noDataText={t('martyrs.no_data')}
                                        documentLabel={attachment.original_filename}
                                        viewFileText={t('martyrs.view_file')}
                                        downloadFileText={t('martyrs.download_file')}
                                    />
                                ))}
                            </div>
                        </InfoCard>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
