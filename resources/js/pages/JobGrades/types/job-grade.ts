export interface JobGrade {
    id: number;
    name_ar: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface JobGradesResponse {
    current_page: number;
    data: JobGrade[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}