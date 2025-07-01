export interface Category {
    id: number;
    name: string;
    slug: string;
    monthly_fee: number;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    category_id?: number;
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface Contribution {
    id: number;
    user_id: number;
    amount: number;
    date: string;
    recorded_by_id: number;
    notes?: string;
    user?: User;
    recorded_by?: User;
    created_at: string;
    updated_at: string;
}

export interface UserBalance {
    monthly_fee: number;
    months_due: number;
    total_expected: number;
    total_paid: number;
    outstanding_balance: number;
    months_behind: number;
    is_up_to_date: boolean;
    status: 'up_to_date' | 'behind_one_month' | 'significantly_behind' | 'no_category';
    as_of_date: string;
}

export interface ContributionSummary {
    total_collected: number;
    total_outstanding: number;
    monthly_target: number;
    collection_rate: number;
    total_members: number;
    by_category: CategorySummary[];
    recent_contributions: Contribution[];
    period: {
        start: string;
        end: string;
    };
}

export interface CategorySummary {
    category: string;
    total_members: number;
    total_collected: number;
    total_outstanding: number;
    monthly_fee: number;
}

export interface PaginatedContributions {
    data: Contribution[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
}
