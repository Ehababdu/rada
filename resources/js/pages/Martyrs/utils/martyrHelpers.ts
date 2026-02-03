const MARITAL_STATUS_SINGLE = 1;

// Type definitions for helper functions
type LocalizableItem = string | { name_ar?: string; name_en?: string } | null | undefined;
type BankBranchItem = { name_ar?: string } | null | undefined;
type EmploymentStatusItem = { name?: string } | null | undefined;

// Helper functions for optimized rendering
const getLocalizedName = (item: LocalizableItem, isRTL: boolean): string => {
    if (!item) return '-';
    if (typeof item === 'string') return item;
    return isRTL ? (item.name_ar ?? item.name_en ?? '-') : (item.name_en ?? item.name_ar ?? '-');
};

const getBankBranchName = (item: BankBranchItem): string => {
    return item?.name_ar || '-';
};

const getEmploymentStatusName = (item: EmploymentStatusItem): string => {
    return item?.name || '-';
};

export { MARITAL_STATUS_SINGLE, getLocalizedName, getBankBranchName, getEmploymentStatusName };