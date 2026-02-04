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
import { Head, router, useForm } from '@inertiajs/react';
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

// Add useToast import
import { useToast } from '@/hooks/use-toast';

interface SearchableSelectProps {
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    options: { id: number; name_ar: string; name_en: string | null }[];
    placeholder: string;
    error?: string;
    loading?: boolean;
    disabled?: boolean;
    apiEndpoint?: string;
}

const SearchableSelect = ({
    value,
    onChange,
    options,
    placeholder,
    error,
    loading = false,
    disabled = false,
    apiEndpoint,
}: SearchableSelectProps) => {
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
    const [fetching, setFetching] = useState(false);
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

    // fetch options from API when searchTerm changes (debounced) or when opened
    useEffect(() => {
        if (!apiEndpoint) return;

        let mounted = true;
        let timer: ReturnType<typeof setTimeout> | null = null;

        const doFetch = () => {
            setFetching(true);
            fetch(`${apiEndpoint}?search=${encodeURIComponent(searchTerm)}`)
                .then((r) => r.json())
                .then((data) => {
                    if (!mounted) return;
                    setLocalOptions(data || []);
                })
                .catch(() => {
                    if (!mounted) return;
                    setLocalOptions([]);
                })
                .finally(() => mounted && setFetching(false));
        };

        // only fetch when open
        if (isOpen) {
            // debounce 250ms
            timer = setTimeout(doFetch, 250);
        }

        return () => {
            mounted = false;
            if (timer) clearTimeout(timer);
        };
    }, [searchTerm, apiEndpoint, isOpen]);

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
                    {loading || fetching ? (
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
};

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

interface Martyr {
    id: number;
    file_number: string;
    full_name: string;
    national_id: string;
    address: string;
    death_date: string;
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
    employer_id?: number | null;
    employer_location_id?: number | null;
    has_previous_workplace?: boolean;
    previous_employer_id?: number | null;
    previous_employer_location_id?: number | null;
    job_grade_id: number | null;
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
    employer?: {
        id: number;
        name_ar: string;
        name_en: string | null;
    } | null;
    employer_location?: {
        id: number;
        name_ar: string;
        name_en: string | null;
    } | null;
    previous_employer?: {
        id: number;
        name_ar: string;
        name_en: string | null;
    } | null;
    previous_employer_location?: {
        id: number;
        name_ar: string;
        name_en: string | null;
    } | null;
}

interface Props {
    martyr: Martyr;
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

export default function Edit({
    martyr,
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
    const { toast } = useToast();

    const formatDateForInput = (d: unknown): string => {
        if (!d) return '';
        const s = String(d);
        // Try native parse (ISO)
        const dt = new Date(s);
        if (!isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
        // Try dd/mm/yyyy
        const parts = s.split('/');
        if (parts.length === 3) {
            const [dd, mm, yyyy] = parts;
            return `${yyyy.padStart(4, '0')}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        }
        return '';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('martyrs.title'),
            href: '/martyrs',
        },
        {
            title: t('martyrs.edit'),
            href: `/martyrs/${martyr.id}/edit`,
        },
    ];

    const { data, setData, processing, errors } = useForm<{
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
        job_grade_id: number | null;
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
        profile_image: File | undefined;
        agent_passport_number: string | null;
    }>({
        file_number: martyr.file_number,
        full_name: martyr.full_name,
        national_id: martyr.national_id,
        address: martyr.address,
        death_date: formatDateForInput(martyr.death_date),
        has_martyr_decision: martyr.has_martyr_decision || false,
        decision_number: martyr.decision_number || '',
        decision_date: formatDateForInput(martyr.decision_date),
        parents_status_id: martyr.parents_status_id,
        marital_status_id: martyr.marital_status_id,
        children_count: martyr.children_count,
        wife_status: martyr.wife_status,
        employment_status_id: martyr.employment_status_id,
        job_grade_id: martyr.job_grade_id,
        workplace: martyr.workplace,
        previous_workplace: martyr.previous_workplace,
        employer_id: martyr.employer_id ?? martyr.employer?.id ?? null,
        employer_location_id:
            martyr.employer_location_id ?? martyr.employer_location?.id ?? null,
        has_previous_workplace: martyr.has_previous_workplace ?? false,
        previous_employer_id:
            martyr.previous_employer_id ?? martyr.previous_employer?.id ?? null,
        previous_employer_location_id:
            martyr.previous_employer_location_id ??
            martyr.previous_employer_location?.id ??
            null,
        military_number: martyr.military_number,
        military_rank_id: martyr.military_rank_id,
        bank_id: martyr.bank_id,
        branch_id: martyr.branch_id,
        bank_account_number: martyr.bank_account_number,
        agent_name: martyr.agent_name,
        agent_phone: martyr.agent_phone,
        agent_relationship: martyr.agent_relationship,
        profile_image: undefined,
        agent_passport_number: martyr.agent_passport_number,
    });

    const [currentMilitaryRanks] =
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            militaryRanks,
        );

    const [currentBanks] =
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            banks,
        );

    const [branches, setBranches] = useState<
        { id: number; name_ar: string; name_en: string | null }[]
    >([]);
    const [loadingBranches, setLoadingBranches] = useState(false);

    const [employersState, setEmployersState] = // eslint-disable-line @typescript-eslint/no-unused-vars
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            employers,
        );
    const [loadingEmployers] = useState(false);
    const [employerLocationsState, setEmployerLocationsState] =
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            employerLocations,
        );
    const [loadingEmployerLocations, setLoadingEmployerLocations] =
        useState(false);
    const [previousEmployerLocationsState, setPreviousEmployerLocationsState] =
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            employerLocations,
        );
    const [
        loadingPreviousEmployerLocations,
        setLoadingPreviousEmployerLocations,
    ] = useState(false);
    const prevEmployerIdRef = useRef<number | null>(
        martyr.employer_id ?? martyr.employer?.id ?? null,
    );
    const prevPreviousEmployerIdRef = useRef<number | null>(
        martyr.previous_employer_id ?? martyr.previous_employer?.id ?? null,
    );

    const [currentEmploymentStatuses] =
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            employmentStatuses,
        );

    const [currentParentsStatuses] =
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            parentsStatuses,
        );

    const [currentMaritalStatuses] =
        useState<{ id: number; name_ar: string; name_en: string | null }[]>(
            maritalStatuses,
        );

    const [loadingParentsStatuses] = useState(false);
    const [loadingMaritalStatuses] = useState(false);
    const [loadingEmploymentStatuses] = useState(false);
    const [loadingRanks] = useState(false);
    const [loadingBanks] = useState(false);

    // image preview: show existing saved image or newly selected file preview
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        martyr.profile_image ?? null,
    );
    const previewObjectUrlRef = useRef<string | null>(null);

    // ensure form data contains normalized values for custom selects (fixes cases where UI shows value but form is empty)
    useEffect(() => {
        setData(
            'parents_status_id',
            martyr.parents_status_id ?? data.parents_status_id ?? null,
        );
        setData(
            'marital_status_id',
            martyr.marital_status_id ?? data.marital_status_id ?? null,
        );
        setData(
            'employment_status_id',
            martyr.employment_status_id ?? data.employment_status_id ?? null,
        );
        setData(
            'employer_id',
            martyr.employer_id ??
                martyr.employer?.id ??
                data.employer_id ??
                null,
        );
        setData(
            'employer_location_id',
            martyr.employer_location_id ??
                martyr.employer_location?.id ??
                data.employer_location_id ??
                null,
        );
        setData(
            'previous_employer_id',
            martyr.previous_employer_id ??
                martyr.previous_employer?.id ??
                data.previous_employer_id ??
                null,
        );
        setData(
            'previous_employer_location_id',
            martyr.previous_employer_location_id ??
                martyr.previous_employer_location?.id ??
                data.previous_employer_location_id ??
                null,
        );
        setData('bank_id', martyr.bank_id ?? data.bank_id ?? null);
        setData('branch_id', martyr.branch_id ?? data.branch_id ?? null);
        setData(
            'job_grade_id',
            martyr.job_grade_id ?? data.job_grade_id ?? null,
        );
        setData(
            'military_rank_id',
            martyr.military_rank_id ?? data.military_rank_id ?? null,
        );
        // run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data.bank_id) {
            setLoadingBranches(true);
            fetch(`/api/banks/${data.bank_id}/branches`)
                .then((response) => response.json())
                .then((data) => {
                    setBranches(data);
                    setLoadingBranches(false);
                })
                .catch(() => {
                    setLoadingBranches(false);
                });
        } else {
            setBranches([]);
        }
    }, [data.bank_id]);

    // load employer locations when employer changes (similar to Create)
    useEffect(() => {
        let mounted = true;
        if (data.employer_id) {
            setLoadingEmployerLocations(true);
            fetch(`/api/employers/${data.employer_id}/locations`)
                .then((r) => r.json())
                .then((d) => {
                    if (!mounted) return;
                    setEmployerLocationsState(d || []);
                })
                .catch(() => {
                    if (!mounted) return;
                    setEmployerLocationsState([]);
                })
                .finally(() => mounted && setLoadingEmployerLocations(false));
            // reset current employer_location only when employer actually changed
            if (prevEmployerIdRef.current !== data.employer_id) {
                setData('employer_location_id', null);
            }
        } else {
            setEmployerLocationsState(employerLocations);
            setData('employer_location_id', null);
        }

        prevEmployerIdRef.current = data.employer_id ?? null;

        return () => {
            mounted = false;
        };
    }, [data.employer_id, employerLocations, setData]);

    // load previous employer locations when previous_employer changes
    useEffect(() => {
        let mounted = true;
        if (data.previous_employer_id) {
            setLoadingPreviousEmployerLocations(true);
            fetch(`/api/employers/${data.previous_employer_id}/locations`)
                .then((r) => r.json())
                .then((d) => {
                    if (!mounted) return;
                    setPreviousEmployerLocationsState(d || []);
                })
                .catch(() => {
                    if (!mounted) return;
                    setPreviousEmployerLocationsState([]);
                })
                .finally(
                    () => mounted && setLoadingPreviousEmployerLocations(false),
                );
            if (
                prevPreviousEmployerIdRef.current !== data.previous_employer_id
            ) {
                setData('previous_employer_location_id', null);
            }
        } else {
            setPreviousEmployerLocationsState(employerLocations);
            setData('previous_employer_location_id', null);
        }

        prevPreviousEmployerIdRef.current = data.previous_employer_id ?? null;

        return () => {
            mounted = false;
        };
    }, [data.previous_employer_id, employerLocations, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data as Record<string, unknown>).forEach(
            ([key, value]) => {
                // skip undefined or null to avoid clearing server values
                if (value === undefined || value === null) return;

                // if it's a File (profile_image), append directly
                if (value instanceof File) {
                    formData.append(key, value);
                    return;
                }

                // arrays/objects -> JSON
                if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                    return;
                }

                formData.append(key, String(value));
            },
        );

        // include _method override so Laravel accepts PUT with multipart/form-data
        formData.append('_method', 'PUT');

        router.visit(`/martyrs/${martyr.id}`, {
            method: 'post',
            data: formData,
            onSuccess: () => {
                toast({
                    title: t('martyrs.updated_successfully'),
                    variant: 'default',
                });
                // Redirect to martyrs list after successful update
                router.visit('/martyrs');
            },
            onError: () => {
                toast({
                    title: t('error'),
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('martyrs.edit_martyr')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 p-6 shadow-sm dark:border-sidebar-border">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {t('martyrs.edit_martyr')}
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {t('martyrs.edit_martyr_description')}
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                value={
                                    data.parents_status_id
                                        ? String(data.parents_status_id)
                                        : ''
                                }
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
                                        currentParentsStatuses.map((status) => (
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
                                value={
                                    data.marital_status_id
                                        ? String(data.marital_status_id)
                                        : ''
                                }
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
                                        currentMaritalStatuses.map((status) => (
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

                        {currentMaritalStatuses.find(
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

                        {currentMaritalStatuses.find(
                            (status) => status.id === data.marital_status_id,
                        )?.name_ar === 'متزوج' && (
                            <FormField
                                icon={Heart}
                                label="حالة الزوجة"
                                error={errors.wife_status}
                            >
                                <Select
                                    value={data.wife_status || ''}
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
                                options={currentEmploymentStatuses}
                                placeholder={t(
                                    'martyrs.select_employment_status',
                                )}
                                loading={loadingEmploymentStatuses}
                                apiEndpoint="/api/employment-statuses"
                            />
                        </FormField>

                        {data.employment_status_id && (
                            <>
                                <FormField
                                    icon={Briefcase}
                                    label={t('martyrs.employer')}
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
                                        placeholder={
                                            t('martyrs.select_employer') ||
                                            'اختر جهة العمل'
                                        }
                                        loading={loadingEmployers}
                                    />
                                </FormField>

                                <FormField
                                    icon={MapPin}
                                    label={t('martyrs.employer_location')}
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
                                        placeholder={
                                            t(
                                                'martyrs.select_employer_location',
                                            ) || 'اختر موقع العمل'
                                        }
                                        loading={loadingEmployerLocations}
                                    />
                                </FormField>
                            </>
                        )}

                        {(() => {
                            const selectedStatus =
                                currentEmploymentStatuses.find(
                                    (status) =>
                                        status.id === data.employment_status_id,
                                );
                            return (
                                selectedStatus &&
                                (selectedStatus.name_ar
                                    .toLowerCase()
                                    .includes('employee') ||
                                    selectedStatus.name_ar === 'موظف')
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
                                    options={jobGrades}
                                    placeholder={t('martyrs.select_job_grade')}
                                />
                            </FormField>
                        )}

                        <FormField
                            icon={Briefcase}
                            label={t('martyrs.has_previous_workplace')}
                            error={errors.has_previous_workplace}
                        >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <input
                                    type="checkbox"
                                    id="has_previous_workplace"
                                    checked={Boolean(
                                        data.has_previous_workplace,
                                    )}
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
                                    {t('martyrs.has_previous_workplace') ||
                                        'نعم، لديه مكان عمل سابق'}
                                </label>
                            </div>
                        </FormField>

                        {data.has_previous_workplace && (
                            <FormField
                                icon={Briefcase}
                                label={
                                    t('martyrs.previous_employer') ||
                                    'جهة العمل السابقة'
                                }
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
                                    placeholder={
                                        t('martyrs.select_previous_employer') ||
                                        'اختر جهة العمل السابقة'
                                    }
                                    loading={loadingEmployers}
                                />
                            </FormField>
                        )}

                        {data.has_previous_workplace && (
                            <FormField
                                icon={MapPin}
                                label={
                                    t('martyrs.previous_employer_location') ||
                                    'موقع العمل السابق'
                                }
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
                                    options={previousEmployerLocationsState}
                                    placeholder={
                                        t(
                                            'martyrs.select_previous_employer_location',
                                        ) || 'اختر موقع العمل السابق'
                                    }
                                    loading={loadingPreviousEmployerLocations}
                                />
                            </FormField>
                        )}
                    </FormSection>

                    {/* Military Information */}
                    {(() => {
                        const selectedStatus = currentEmploymentStatuses.find(
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
                                    options={currentMilitaryRanks}
                                    placeholder={t(
                                        'martyrs.select_military_rank',
                                    )}
                                    loading={loadingRanks}
                                    apiEndpoint="/api/military-ranks"
                                />
                            </FormField>
                        </FormSection>
                    )}

                    {/* Banking Information */}
                    <FormSection title={t('martyrs.banking_info')}>
                        <FormField
                            icon={Banknote}
                            label={t('martyrs.bank')}
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
                                options={currentBanks}
                                placeholder={t('martyrs.select_bank')}
                                loading={loadingBanks}
                                error={errors.bank_id}
                                apiEndpoint="/api/banks"
                            />
                        </FormField>

                        <FormField
                            icon={Banknote}
                            label={t('martyrs.branch')}
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
                                apiEndpoint={
                                    data.bank_id
                                        ? `/api/banks/${data.bank_id}/branches`
                                        : undefined
                                }
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
                            placeholder={t('martyrs.select_agent_relationship')}
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
                                    'martyrs.select_agent_relationship',
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

                    {/* Attachments */}
                    <FormSection title={t('martyrs.attachments')}>
                        <FormField
                            icon={Upload}
                            label={t('martyrs.profile_image')}
                            error={errors.profile_image}
                        >
                            {previewUrl && (
                                <div className="mb-3">
                                    <img
                                        src={
                                            previewUrl.startsWith('blob:')
                                                ? previewUrl
                                                : `/storage/${previewUrl}`
                                        }
                                        alt="profile"
                                        className="h-28 w-28 rounded-md border object-cover"
                                    />
                                </div>
                            )}

                            <Input
                                id="profile_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file =
                                        e.target.files?.[0] || undefined;
                                    setData('profile_image', file);
                                    // revoke previous object URL
                                    if (previewObjectUrlRef.current) {
                                        URL.revokeObjectURL(
                                            previewObjectUrlRef.current,
                                        );
                                        previewObjectUrlRef.current = null;
                                    }
                                    if (file) {
                                        const obj = URL.createObjectURL(file);
                                        previewObjectUrlRef.current = obj;
                                        setPreviewUrl(obj);
                                    } else {
                                        setPreviewUrl(
                                            martyr.profile_image ?? null,
                                        );
                                    }
                                }}
                                className="w-full file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900 dark:file:text-green-300"
                            />
                        </FormField>
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
                                : t('martyrs.update_martyr')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
