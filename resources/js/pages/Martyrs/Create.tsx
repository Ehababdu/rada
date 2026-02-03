import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Banknote,
    Briefcase,
    Calendar,
    Check,
    FileText,
    Heart,
    IdCard,
    LucideIcon,
    MapPin,
    Phone,
    Save,
    Search,
    Shield,
    Upload,
    User,
    Users,
} from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface SearchableSelectProps {
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    options: { id: number; name_ar: string; name_en: string | null }[];
    placeholder: string;
    error?: string;
    loading?: boolean;
    disabled?: boolean;
}

function SearchableSelect({
    value,
    onChange,
    options,
    placeholder,
    error,
    loading = false,
    disabled = false,
}: SearchableSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState<{
        top: number;
        left: number;
        width: number;
    }>({ top: 0, left: 0, width: 0 });

    const [localOptions, setLocalOptions] = useState(options);
    const filteredOptions = localOptions.filter(
        (option) =>
            option.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option.name_en &&
                option.name_en
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())),
    );

    const selectedOption = options.find((option) => option.id === value);

    // compute dropdown position relative to viewport when opened
    useLayoutEffect(() => {
        function updatePos() {
            const el = triggerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setPos({ top: rect.bottom, left: rect.left, width: rect.width });
        }

        if (isOpen) {
            updatePos();
            window.addEventListener('scroll', updatePos, true);
            window.addEventListener('resize', updatePos);
        }

        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [isOpen]);

    // close on outside click
    useEffect(() => {
        function handleDown(e: MouseEvent) {
            const target = e.target as Node | null;
            if (triggerRef.current && triggerRef.current.contains(target))
                return;
            if (dropdownRef.current && dropdownRef.current.contains(target))
                return;
            setIsOpen(false);
        }

        if (isOpen) document.addEventListener('mousedown', handleDown);
        return () => document.removeEventListener('mousedown', handleDown);
    }, [isOpen]);

    // keep localOptions in sync when parent options change
    useEffect(() => {
        setLocalOptions(options);
    }, [options]);

    const dropdown =
        isOpen && !disabled ? (
            <div
                ref={dropdownRef}
                style={{
                    position: 'fixed',
                    top: pos.top + 'px',
                    left: pos.left + 'px',
                    width: pos.width + 'px',
                    zIndex: 9999,
                }}
                className="mt-1 rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-2">
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {t('loading')}
                        </div>
                    ) : filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {t('no_search_results')}
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <div
                                key={option.id}
                                className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                    onChange(option.id);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                <span>{option.name_ar}</span>
                                {value === option.id && (
                                    <Check
                                        size={16}
                                        className="text-blue-500"
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        ) : null;

    return (
        <div>
            <div
                ref={triggerRef}
                className={`flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${error ? 'border-red-500' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={selectedOption ? '' : 'text-gray-500'}>
                    {selectedOption ? selectedOption.name_ar : placeholder}
                </span>
                <Search size={16} className="text-gray-400" />
            </div>

            {createPortal(dropdown, document.body)}

            {error && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

const FormField = ({
    icon: Icon,
    label,
    children,
    error,
}: {
    icon: LucideIcon;
    label: string;
    placeholder?: string;
    children: React.ReactNode;
    error?: string;
}) => (
    <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Icon size={16} className="text-blue-500 dark:text-blue-400" />
            {label}
        </Label>
        {children}
        {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
    </div>
);

const FormSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 p-6 shadow-sm dark:border-sidebar-border">
        <h3 className="mb-6 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
            {title}
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children}
        </div>
    </div>
);

interface Props {
    employmentStatuses: {
        id: number;
        name_ar: string;
        name_en: string | null;
    }[];
    militaryRanks: { id: number; name_ar: string; name_en: string | null }[];
    banks: { id: number; name_ar: string; name_en: string | null }[];
    parentsStatuses: { id: number; name_ar: string; name_en: string | null }[];
    maritalStatuses: { id: number; name_ar: string; name_en: string | null }[];
    jobGrades: { id: number; name_ar: string; name_en: string | null }[];
    employers: { id: number; name_ar: string; name_en: string | null }[];
    employerLocations: {
        id: number;
        name_ar: string;
        name_en: string | null;
    }[];
}

export default function Create({
    employmentStatuses,
    militaryRanks,
    banks,
    parentsStatuses,
    maritalStatuses,
    jobGrades,
    employers,
    employerLocations,
}: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.title'),
            href: '/martyrs',
        },
        {
            title: t('martyrs.create'),
            href: '/martyrs/create',
        },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        file_number: string;
        full_name: string;
        national_id: string;
        address: string;
        death_date: string;
        has_martyr_decision: boolean;
        decision_number: string;
        decision_date: string;
        parents_status_id: number | null;
        marital_status_id: number | null;
        children_count: number | null;
        wife_status: string | null;
        employment_status_id: number | null;
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
        profile_image: File | null;
        agent_passport_number: string | null;
        job_grade_id: number | null;
    }>({
        file_number: '',
        full_name: '',
        national_id: '',
        address: '',
        death_date: '',
        has_martyr_decision: false,
        decision_number: '',
        decision_date: '',
        parents_status_id: null,
        marital_status_id: null,
        children_count: null,
        wife_status: null,
        employment_status_id: null,
        employer_id: null,
        employer_location_id: null,
        has_previous_workplace: false,
        previous_employer_id: null,
        previous_employer_location_id: null,

        military_number: '',
        military_rank_id: null,
        bank_id: null,
        branch_id: null,
        bank_account_number: '',
        agent_name: '',
        agent_phone: '',
        agent_relationship: '',
        profile_image: null,
        agent_passport_number: '',
        job_grade_id: null,
    });

    const [militaryRanksState, setMilitaryRanksState] = useState(militaryRanks);

    const [banksState] = useState(banks);
    const [loadingBanks] = useState(false);

    const [branches, setBranches] = useState<
        { id: number; name_ar: string; name_en: string | null }[]
    >([]);
    const [loadingBranches, setLoadingBranches] = useState(false);

    const [employmentStatusesState] = useState(employmentStatuses);
    const [loadingEmploymentStatuses] = useState(false);

    const [jobGradesState] = useState(jobGrades);
    const [loadingJobGrades] = useState(false);

    const [employersState] = useState(employers);
    const [loadingEmployers] = useState(false);

    const [employerLocationsState, setEmployerLocationsState] =
        useState(employerLocations);
    const [loadingEmployerLocations, setLoadingEmployerLocations] =
        useState(false);

    const [parentsStatusesState] = useState(parentsStatuses);
    const [loadingParentsStatuses] = useState(false);

    const [maritalStatusesState] = useState(maritalStatuses);
    const [loadingMaritalStatuses] = useState(false);

    useEffect(() => {
        const selectedStatus = employmentStatusesState.find(
            (status) => status.id === data.employment_status_id,
        );
        if (
            selectedStatus &&
            selectedStatus.name_ar.toLowerCase().includes('عسكري')
        ) {
            // Filter military ranks locally instead of fetching from API
            setMilitaryRanksState(militaryRanks);
        }
    }, [data.employment_status_id, employmentStatusesState, militaryRanks]);

    useEffect(() => {
        if (data.bank_id) {
            const fetchBranches = async () => {
                setLoadingBranches(true);
                try {
                    const response = await fetch(`/api/banks/${data.bank_id}/branches`);
                    const data = await response.json();
                    setBranches(data);
                } catch {
                    // handle error
                } finally {
                    setLoadingBranches(false);
                }
            };
            fetchBranches();
        } else {
            setBranches([]);
        }
    }, [data.bank_id]);

    useEffect(() => {
        if (data.employer_id) {
            const fetchLocations = async () => {
                setLoadingEmployerLocations(true);
                try {
                    const response = await fetch(`/api/employers/${data.employer_id}/locations`);
                    const data = await response.json();
                    setEmployerLocationsState(data);
                    // Reset employer_location_id when employer changes
                    setData('employer_location_id', null);
                } catch {
                    setEmployerLocationsState([]);
                    setData('employer_location_id', null);
                } finally {
                    setLoadingEmployerLocations(false);
                }
            };
            fetchLocations();
        } else {
            setEmployerLocationsState(employerLocations);
            setData('employer_location_id', null);
        }
    }, [data.employer_id, employerLocations, setData]);

    // Handle previous employer location changes
    useEffect(() => {
        if (data.previous_employer_id) {
            // For previous employer, we'll use the same logic
            // Reset previous employer location when previous employer changes
            setData('previous_employer_location_id', null);
        }
    }, [data.previous_employer_id, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/martyrs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('martyrs.create_martyr')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 p-6 shadow-sm dark:border-sidebar-border">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {t('martyrs.create_martyr')}
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {t('martyrs.add_new')}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <FormSection title={t('martyrs.basic_info')}>
                        <FormField
                            icon={FileText}
                            label={t('martyrs.file_number')}
                            placeholder={t('martyrs.enter_file_number')}
                            error={errors.file_number}
                        >
                            <Input
                                id="file_number"
                                value={data.file_number}
                                onChange={(e) =>
                                    setData('file_number', e.target.value)
                                }
                                placeholder={t('martyrs.enter_file_number')}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            icon={User}
                            label={t('martyrs.full_name')}
                            placeholder={t('martyrs.enter_full_name')}
                            error={errors.full_name}
                        >
                            <Input
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData('full_name', e.target.value)
                                }
                                placeholder={t('martyrs.enter_full_name')}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            icon={IdCard}
                            label={t('martyrs.national_id')}
                            placeholder={t('martyrs.enter_national_id')}
                            error={errors.national_id}
                        >
                            <Input
                                id="national_id"
                                value={data.national_id}
                                onChange={(e) =>
                                    setData('national_id', e.target.value)
                                }
                                placeholder={t('martyrs.enter_national_id')}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            icon={MapPin}
                            label={t('martyrs.address')}
                            placeholder={t('martyrs.enter_address')}
                            error={errors.address}
                        >
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder={t('martyrs.enter_address')}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            icon={Calendar}
                            label={t('martyrs.death_date')}
                            placeholder={t('martyrs.enter_death_date')}
                            error={errors.death_date}
                        >
                            <Input
                                id="death_date"
                                type="date"
                                value={data.death_date}
                                onChange={(e) =>
                                    setData('death_date', e.target.value)
                                }
                                className="w-full"
                            />
                        </FormField>
                    </FormSection>

                    {/* Martyr Decision Information */}
                    <FormSection title={t('martyrs.martyr_decision_info')}>
                        <FormField
                            icon={FileText}
                            label={t('martyrs.has_martyr_decision')}
                            error={errors.has_martyr_decision}
                        >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <input
                                    type="checkbox"
                                    id="has_martyr_decision"
                                    checked={data.has_martyr_decision}
                                    onChange={(e) =>
                                        setData(
                                            'has_martyr_decision',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="has_martyr_decision"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {t('martyrs.has_martyr_decision')}
                                </label>
                            </div>
                        </FormField>

                        {data.has_martyr_decision && (
                            <>
                                <FormField
                                    icon={FileText}
                                    label={t('martyrs.decision_number')}
                                    placeholder={t(
                                        'martyrs.enter_decision_number',
                                    )}
                                    error={errors.decision_number}
                                >
                                    <Input
                                        id="decision_number"
                                        value={data.decision_number}
                                        onChange={(e) =>
                                            setData(
                                                'decision_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'martyrs.enter_decision_number',
                                        )}
                                        className="w-full"
                                    />
                                </FormField>

                                <FormField
                                    icon={Calendar}
                                    label={t('martyrs.decision_date')}
                                    placeholder={t(
                                        'martyrs.enter_decision_date',
                                    )}
                                    error={errors.decision_date}
                                >
                                    <Input
                                        id="decision_date"
                                        type="date"
                                        value={data.decision_date}
                                        onChange={(e) =>
                                            setData(
                                                'decision_date',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full"
                                    />
                                </FormField>
                            </>
                        )}
                    </FormSection>

                    {/* Family Status */}
                    <FormSection title={t('martyrs.family_status')}>
                        <FormField
                            icon={Users}
                            label={t('martyrs.parents_status')}
                            error={errors.parents_status_id}
                        >
                            <Select
                                onValueChange={(value) =>
                                    setData(
                                        'parents_status_id',
                                        value ? Number(value) : null,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={t(
                                            'martyrs.select_parents_status',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingParentsStatuses ? (
                                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {t('loading')}
                                        </div>
                                    ) : (
                                        parentsStatusesState.map((status) => (
                                            <SelectItem
                                                key={status.id}
                                                value={status.id.toString()}
                                            >
                                                {status.name_ar}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField
                            icon={Heart}
                            label={t('martyrs.marital_status')}
                            error={errors.marital_status_id}
                        >
                            <Select
                                onValueChange={(value) =>
                                    setData(
                                        'marital_status_id',
                                        value ? Number(value) : null,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={t(
                                            'martyrs.select_marital_status',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingMaritalStatuses ? (
                                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {t('loading')}
                                        </div>
                                    ) : (
                                        maritalStatusesState.map((status) => (
                                            <SelectItem
                                                key={status.id}
                                                value={status.id.toString()}
                                            >
                                                {status.name_ar}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </FormField>

                        {maritalStatusesState.find(
                            (status) => status.id === data.marital_status_id,
                        )?.name_ar === 'متزوج' && (
                            <FormField
                                icon={Users}
                                label={t('martyrs.children_count')}
                                placeholder={t('martyrs.enter_children_count')}
                                error={errors.children_count}
                            >
                                <Input
                                    id="children_count"
                                    type="number"
                                    min="0"
                                    value={
                                        data.children_count?.toString() || ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'children_count',
                                            e.target.value
                                                ? parseInt(e.target.value)
                                                : null,
                                        )
                                    }
                                    placeholder={t(
                                        'martyrs.enter_children_count',
                                    )}
                                    className="w-full"
                                />
                            </FormField>
                        )}

                        {maritalStatusesState.find(
                            (status) => status.id === data.marital_status_id,
                        )?.name_ar === 'متزوج' && (
                            <FormField
                                icon={Heart}
                                label="حالة الزوجة"
                                error={errors.wife_status}
                            >
                                <Select
                                    onValueChange={(value) =>
                                        setData('wife_status', value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="اختر حالة الزوجة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ارملة">
                                            ارملة
                                        </SelectItem>
                                        <SelectItem value="متزوجة">
                                            متزوجة
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        )}

                        <FormField
                            icon={Briefcase}
                            label={t('martyrs.employment_status')}
                            error={errors.employment_status_id}
                        >
                            <SearchableSelect
                                value={data.employment_status_id}
                                onChange={(value) =>
                                    setData(
                                        'employment_status_id',
                                        value ? Number(value) : null,
                                    )
                                }
                                options={employmentStatusesState}
                                placeholder={t(
                                    'martyrs.select_employment_status',
                                )}
                                loading={loadingEmploymentStatuses}
                            />
                        </FormField>

                        {data.employment_status_id && (
                            <FormField
                                icon={Briefcase}
                                label="جهة العمل"
                                error={errors.employer_id}
                            >
                                <SearchableSelect
                                    value={data.employer_id}
                                    onChange={(value) =>
                                        setData(
                                            'employer_id',
                                            value ? Number(value) : null,
                                        )
                                    }
                                    options={employersState}
                                    placeholder="اختر جهة العمل"
                                    loading={loadingEmployers}
                                />
                            </FormField>
                        )}

                        {data.employment_status_id && (
                            <FormField
                                icon={MapPin}
                                label="موقع العمل"
                                error={errors.employer_location_id}
                            >
                                <SearchableSelect
                                    value={data.employer_location_id}
                                    onChange={(value) =>
                                        setData(
                                            'employer_location_id',
                                            value ? Number(value) : null,
                                        )
                                    }
                                    options={employerLocationsState}
                                    placeholder="اختر موقع العمل"
                                    loading={loadingEmployerLocations}
                                />
                            </FormField>
                        )}

                        {data.employment_status_id && (
                            // Job Grade field will be conditionally rendered based on employment status
                            <></>
                        )}

                        {(() => {
                            const selectedStatus = employmentStatusesState.find(
                                (status) =>
                                    status.id === data.employment_status_id,
                            );
                            return (
                                selectedStatus &&
                                selectedStatus.name_ar === 'موظف'
                            );
                        })() && (
                            <FormField
                                icon={Briefcase}
                                label={t('martyrs.job_grade')}
                                error={errors.job_grade_id}
                            >
                                <SearchableSelect
                                    value={data.job_grade_id}
                                    onChange={(value) =>
                                        setData(
                                            'job_grade_id',
                                            value ? Number(value) : null,
                                        )
                                    }
                                    options={jobGradesState.map((grade) => ({
                                        id: grade.id,
                                        name_ar: grade.name_ar,
                                        name_en: grade.name_en,
                                    }))}
                                    placeholder={t('martyrs.select_job_grade')}
                                    loading={loadingJobGrades}
                                />
                            </FormField>
                        )}

                        <FormField
                            icon={Briefcase}
                            label="هل لديه مكان عمل سابق؟"
                            error={errors.has_previous_workplace}
                        >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <input
                                    type="checkbox"
                                    id="has_previous_workplace"
                                    checked={data.has_previous_workplace}
                                    onChange={(e) =>
                                        setData(
                                            'has_previous_workplace',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="has_previous_workplace"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    نعم، لديه مكان عمل سابق
                                </label>
                            </div>
                        </FormField>

                        {data.has_previous_workplace && (
                            <FormField
                                icon={Briefcase}
                                label="جهة العمل السابقة"
                                error={errors.previous_employer_id}
                            >
                                <SearchableSelect
                                    value={data.previous_employer_id}
                                    onChange={(value) =>
                                        setData(
                                            'previous_employer_id',
                                            value ? Number(value) : null,
                                        )
                                    }
                                    options={employersState}
                                    placeholder="اختر جهة العمل السابقة"
                                    loading={loadingEmployers}
                                />
                            </FormField>
                        )}

                        {data.has_previous_workplace && (
                            <FormField
                                icon={MapPin}
                                label="موقع العمل السابق"
                                error={errors.previous_employer_location_id}
                            >
                                <SearchableSelect
                                    value={data.previous_employer_location_id}
                                    onChange={(value) =>
                                        setData(
                                            'previous_employer_location_id',
                                            value ? Number(value) : null,
                                        )
                                    }
                                    options={employerLocationsState}
                                    placeholder="اختر موقع العمل السابق"
                                    loading={loadingEmployerLocations}
                                />
                            </FormField>
                        )}
                    </FormSection>

                    {/* Military Information */}
                    {(() => {
                        const selectedStatus = employmentStatusesState.find(
                            (status) => status.id === data.employment_status_id,
                        );
                        return (
                            selectedStatus &&
                            selectedStatus.name_ar
                                .toLowerCase()
                                .includes('عسكري')
                        );
                    })() && (
                        <FormSection title={t('martyrs.military_info')}>
                            <FormField
                                icon={Shield}
                                label={t('martyrs.military_number')}
                                placeholder={t('martyrs.enter_military_number')}
                                error={errors.military_number}
                            >
                                <Input
                                    id="military_number"
                                    value={data.military_number || ''}
                                    onChange={(e) =>
                                        setData(
                                            'military_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={t(
                                        'martyrs.enter_military_number',
                                    )}
                                    className="w-full"
                                />
                            </FormField>

                            <FormField
                                icon={Shield}
                                label={t('martyrs.military_rank')}
                                error={errors.military_rank_id}
                            >
                                <SearchableSelect
                                    value={data.military_rank_id}
                                    onChange={(value) =>
                                        setData(
                                            'military_rank_id',
                                            value ? Number(value) : null,
                                        )
                                    }
                                    options={militaryRanksState}
                                    placeholder={t(
                                        'martyrs.select_military_rank',
                                    )}
                                    loading={loadingRanks}
                                />
                            </FormField>
                        </FormSection>
                    )}

                    {/* Banking Information */}
                    <FormSection title={t('martyrs.banking_info')}>
                        <FormField
                            icon={Banknote}
                            label={t('martyrs.bank_name')}
                            error={errors.bank_id}
                        >
                            <SearchableSelect
                                value={data.bank_id}
                                onChange={(value) => {
                                    setData(
                                        'bank_id',
                                        value ? Number(value) : null,
                                    );
                                    setData('branch_id', null); // Reset branch when bank changes
                                }}
                                options={banksState}
                                placeholder={t('martyrs.select_bank')}
                                loading={loadingBanks}
                                error={errors.bank_id}
                            />
                        </FormField>

                        <FormField
                            icon={Banknote}
                            label={t('martyrs.bank_branch')}
                            error={errors.branch_id}
                        >
                            <SearchableSelect
                                value={data.branch_id}
                                onChange={(value) =>
                                    setData(
                                        'branch_id',
                                        value ? Number(value) : null,
                                    )
                                }
                                options={branches}
                                placeholder={t('martyrs.select_branch')}
                                loading={loadingBranches}
                                disabled={!data.bank_id}
                                error={errors.branch_id}
                            />
                        </FormField>

                        <FormField
                            icon={Banknote}
                            label={t('martyrs.bank_account_number')}
                            placeholder={t('martyrs.enter_bank_account')}
                            error={errors.bank_account_number}
                        >
                            <Input
                                id="bank_account_number"
                                value={data.bank_account_number || ''}
                                onChange={(e) =>
                                    setData(
                                        'bank_account_number',
                                        e.target.value,
                                    )
                                }
                                placeholder={t('martyrs.enter_bank_account')}
                                className="w-full"
                            />
                        </FormField>
                    </FormSection>

                    {/* Agent Information */}
                    <FormSection title={t('martyrs.agent_info')}>
                        <FormField
                            icon={User}
                            label={t('martyrs.agent_name')}
                            placeholder={t('martyrs.enter_agent_name')}
                            error={errors.agent_name}
                        >
                            <Input
                                id="agent_name"
                                value={data.agent_name || ''}
                                onChange={(e) =>
                                    setData('agent_name', e.target.value)
                                }
                                placeholder={t('martyrs.enter_agent_name')}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            icon={Phone}
                            label={t('martyrs.agent_phone')}
                            placeholder={t('martyrs.enter_agent_phone')}
                            error={errors.agent_phone}
                        >
                            <Input
                                id="agent_phone"
                                value={data.agent_phone || ''}
                                onChange={(e) =>
                                    setData('agent_phone', e.target.value)
                                }
                                placeholder={t('martyrs.enter_agent_phone')}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            icon={Users}
                            label={t('martyrs.agent_relationship')}
                            placeholder={t('martyrs.enter_agent_relationship')}
                            error={errors.agent_relationship}
                        >
                            <Input
                                id="agent_relationship"
                                value={data.agent_relationship || ''}
                                onChange={(e) =>
                                    setData(
                                        'agent_relationship',
                                        e.target.value,
                                    )
                                }
                                placeholder={t(
                                    'martyrs.enter_agent_relationship',
                                )}
                                className="w-full"
                            />
                        </FormField>

                        <FormField
                            icon={IdCard}
                            label={t('martyrs.agent_passport_number')}
                            placeholder={t('martyrs.enter_agent_passport')}
                            error={errors.agent_passport_number}
                        >
                            <Input
                                id="agent_passport_number"
                                value={data.agent_passport_number || ''}
                                onChange={(e) =>
                                    setData(
                                        'agent_passport_number',
                                        e.target.value,
                                    )
                                }
                                placeholder={t('martyrs.enter_agent_passport')}
                                className="w-full"
                            />
                        </FormField>
                    </FormSection>

                    {/* File Uploads */}
                    <FormSection title={t('martyrs.files')}>
                        <FormField
                            icon={Upload}
                            label={t('martyrs.profile_image')}
                            error={errors.profile_image}
                        >
                            <Input
                                id="profile_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'profile_image',
                                        e.target.files?.[0] || null,
                                    )
                                }
                                className="w-full file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                            />
                        </FormField>
                        {/* --- IGNORE ---  */}
                    </FormSection>

                    {/* Submit Button */}
                    <div className="flex justify-end rounded-lg border-t border-gray-200 p-6 pt-6 dark:border-gray-700">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            <Save size={20} />
                            {processing
                                ? t('loading')
                                : t('martyrs.create_martyr')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
