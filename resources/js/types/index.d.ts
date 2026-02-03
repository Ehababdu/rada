import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { Config, RouteParam } from 'ziggy-js';

declare global {
    function route(): {
        current(name?: string, params?: RouteParam, config?: Config): boolean;
    };
    function route(
        name: string,
        params?: RouteParam,
        absolute?: boolean,
        config?: Config,
    ): string;

    interface Window {
        Echo?: unknown;
    }
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Flash {
    success?: string;
    error?: string;
    [key: string]: string | undefined;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash: Flash;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    roles?: {
        id: number;
        name: string;
        display_name?: string;
    }[];
    permissions?: {
        id: number;
        name: string;
        display_name?: string;
    }[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links?: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface Martyr {
    id: number;
    full_name: string;
    national_id: string;
    address?: string;
    parents_status_id?: number | null;
    marital_status_id?: number | null;
    employment_status_id?: number | null;
    children_count?: number;
    wife_status?: string;
    job_grade_id?: number | null;
    employer_id?: number | null;
    employer_location_id?: number | null;
    has_previous_workplace?: boolean;
    previous_employer_id?: number | null;
    previous_employer_location_id?: number | null;
    military_number?: string;
    military_rank_id?: number | null;
    bank_id?: number | null;
    branch_id?: number | null;
    bank_account_number?: string;
    agent_name?: string;
    agent_phone?: string;
    agent_relationship?: string;
    agent_passport_number?: string;
    profile_image?: string | null;
    death_date?: string;
    has_martyr_decision?: boolean;
    decision_number?: string;
    decision_date?: string;
    status?: 'complete' | 'incomplete';
    deleted_at?: string | null;
    created_at?: string;
    updated_at?: string;

    // Relationships
    parents_status?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    marital_status?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    employment_status?: {
        id: number;
        name: string;
    } | null;
    job_grade?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    military_rank?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    bank?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    branch?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    employer?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    employerLocation?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    previousEmployer?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
    previousEmployerLocation?: {
        id: number;
        name_ar: string;
        name_en: string;
    } | null;
}

export interface Compensation {
    id: number;
    martyr_id: number;
    martyr_name: string;
    martyr_national_id: string;
    recipient_name: string;
    recipient_passport_number: string;
    amount: number;
    receipt_date: string;
    receipt_date_formatted?: string;
    created_at?: string;
    updated_at?: string;
}
