/**
 * Dynamic Status System
 * Provides a flexible and customizable status management system
 */

export interface StatusConfig {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon?: string;
  description?: string;
}

export interface StatusGroup {
  [key: string]: StatusConfig;
}

// Predefined status configurations
export const STATUS_CONFIGS: Record<string, StatusGroup> = {
  martyr: {
    draft: {
      key: 'draft',
      label: 'مسودة',
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-800 dark:text-gray-200',
      icon: 'FileText',
      description: 'الشهيد في حالة مسودة'
    },
    pending: {
      key: 'pending',
      label: 'قيد المراجعة',
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      icon: 'Clock',
      description: 'الشهيد قيد المراجعة'
    },
    approved: {
      key: 'approved',
      label: 'معتمد',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      icon: 'CheckCircle',
      description: 'تم اعتماد الشهيد'
    },
    rejected: {
      key: 'rejected',
      label: 'مرفوض',
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      icon: 'XCircle',
      description: 'تم رفض الشهيد'
    }
  },

  compensation: {
    pending: {
      key: 'pending',
      label: 'قيد المعالجة',
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      icon: 'Clock',
      description: 'التعويض قيد المعالجة'
    },
    approved: {
      key: 'approved',
      label: 'مكتمل',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      icon: 'CheckCircle',
      description: 'تم إكمال التعويض'
    },
    rejected: {
      key: 'rejected',
      label: 'مرفوض',
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      icon: 'XCircle',
      description: 'تم رفض التعويض'
    }
  },

  general: {
    active: {
      key: 'active',
      label: 'نشط',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      icon: 'CheckCircle',
      description: 'الحالة نشطة'
    },
    inactive: {
      key: 'inactive',
      label: 'غير نشط',
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-800 dark:text-gray-200',
      icon: 'MinusCircle',
      description: 'الحالة غير نشطة'
    },
    suspended: {
      key: 'suspended',
      label: 'موقوف',
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-800',
      textColor: 'text-orange-800 dark:text-orange-200',
      icon: 'AlertTriangle',
      description: 'الحالة موقوفة'
    },
    processing: {
      key: 'processing',
      label: 'قيد المعالجة',
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      icon: 'Loader',
      description: 'قيد المعالجة'
    }
  }
};

/**
 * Get status configuration for a specific group and key
 */
export function getStatusConfig(group: string, key: string): StatusConfig | null {
  return STATUS_CONFIGS[group]?.[key] || null;
}

/**
 * Get all statuses for a specific group
 */
export function getStatusGroup(group: string): StatusGroup {
  return STATUS_CONFIGS[group] || {};
}

/**
 * Get status label
 */
export function getStatusLabel(group: string, key: string): string {
  const config = getStatusConfig(group, key);
  return config?.label || key;
}

/**
 * Get status color classes
 */
export function getStatusClasses(group: string, key: string): { bgColor: string; textColor: string } {
  const config = getStatusConfig(group, key);
  return config ? {
    bgColor: config.bgColor,
    textColor: config.textColor
  } : {
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-800 dark:text-gray-200'
  };
}

/**
 * Get all statuses in a group as an array
 */
export function getStatusGroupAsArray(group: string): StatusConfig[] {
  const groupConfig = STATUS_CONFIGS[group];
  if (!groupConfig) return [];

  return Object.values(groupConfig);
}
export function registerStatusGroup(groupName: string, statuses: StatusGroup): void {
  STATUS_CONFIGS[groupName] = statuses;
}

/**
 * Register a custom status in an existing group
 */
export function registerStatus(groupName: string, statusKey: string, config: StatusConfig): void {
  if (!STATUS_CONFIGS[groupName]) {
    STATUS_CONFIGS[groupName] = {};
  }
  STATUS_CONFIGS[groupName][statusKey] = config;
}