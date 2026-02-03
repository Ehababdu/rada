interface Martyr {
    id: number;
    file_number: string | null;
    full_name: string;
    national_id: string;
    address: string;
    children_count: number | null;
    military_number: string | null;
    bank_account_number?: string | null;
    agent_name: string | null;
    agent_phone: string | null;
    agent_relationship?: string | null;
    profile_image?: string | null;
    agent_passport_number?: string | null;
    national_id_file?: string | null;
    art_image?: string | null;
    death_date: string | null;
    has_martyr_decision: boolean;
    decision_number: string | null;
    decision_date?: string | null;

    // Relations
    military_rank?: { id: number; name_ar: string; name_en: string } | null;
    job_grade?:
    | { id: number; name_ar: string; name_en?: string }
    | string
    | null;
    bank?: { id: number; name_ar: string } | null;
    branch?: { id: number; name_ar: string } | null;
    employment_status?: {
        id: number;
        name?: string;
        name_ar?: string;
        name_en?: string;
    } | null;
    parents_status?: { id: number; name_ar: string; name_en: string } | null;
    marital_status?: { id: number; name_ar: string; name_en: string } | null;
    employer?: { id: number; name_ar: string; name_en?: string } | null;
    employer_location?: {
        id: number;
        name_ar: string;
        name_en?: string;
    } | null;
    previous_employer?: {
        id: number;
        name_ar: string;
        name_en?: string;
    } | null;
    previous_employer_location?: {
        id: number;
        name_ar: string;
        name_en?: string;
    } | null;

    wife_status?: string | null;

    military_rank_id?: number | null;
    bank_id?: number | null;
    branch_id?: number | null;
    employment_status_id?: number | null;
    parents_status_id?: number | null;
    marital_status_id?: number | null;

    status: string;
    created_at: string;
    updated_at: string;
}

interface Filters {
    [key: string]: string | undefined;
    search?: string;
    marital_status_id?: string;
    employment_status_id?: string;
    bank_id?: string;
    branch_id?: string;
    parents_status_id?: string;
    death_date_from?: string;
    military_number?: string;
    military_rank?: string;
    branch?: string;
    decision_number?: string;
    has_martyr_decision?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    per_page?: string;
    employer_id?: string;
    previous_employer_id?: string;
    decision_date_from?: string;
    status?: string;
    wife_status?: string;
}

interface Props {
    martyrs: {
        data: Martyr[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: Filters;
    maritalStatuses: Array<{ id: number; name_ar: string; name_en: string }>;
    employmentStatuses: Array<{ id: number; name: string }>;
    banks: Array<{ id: number; name_ar: string }>;
    parentsStatuses: Array<{ id: number; name_ar: string; name_en: string }>;
    militaryRanks?: Array<{ id: number; name_ar: string; name_en: string }>;
    branches?: Array<{ id: number; name_ar: string; bank_id: number }>;
    employers?: Array<{ id: number; name_ar: string; name_en?: string }>;
    previousEmployers?: Array<{ id: number; name_ar: string; name_en?: string }>;
}

export type { Martyr, Filters, Props };