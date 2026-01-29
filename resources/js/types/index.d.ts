import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
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
    parents_status?: string;
    marital_status?: string;
    employment_status?: string;
    children_count?: number;
    previous_employer_id?: number | null;
    previous_employer_location_id?: number | null;
    military_number?: string;
    military_rank?: string;
    bank_name?: string;
    bank_account_number?: string;
    bank_branch?: string;
    agent_name?: string;
    agent_phone?: string;
    agent_relationship?: string;
    agent_passport_number?: string;
    profile_image?: string | null;
    
    status?: 'draft' | 'pending' | 'approved' | 'rejected';
    deleted_at?: string | null;
    military_rank_id?: number | null;
    bank_id?: number | null;
    branch_id?: number | null;
    employment_status_id?: number | null;
    parents_status_id?: number | null;
    marital_status_id?: number | null;
    created_at?: string;
    updated_at?: string;
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
