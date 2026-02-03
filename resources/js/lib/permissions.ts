/**
 * Permission utilities for data table operations
 */

interface AuthUser {
    permissions?: Array<{ name: string }>;
    roles?: Array<{ name: string }>;
}

interface AuthData {
    user?: AuthUser;
    permissions?: string[];
    roles?: string[];
}

export interface UserPermissions {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canExport: boolean;
    canBulkDelete: boolean;
    canViewDetails: boolean;
}

/**
 * Default permissions (no permissions)
 */
export const DEFAULT_PERMISSIONS: UserPermissions = {
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canExport: false,
    canBulkDelete: false,
    canViewDetails: false,
};

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(
    permissions: UserPermissions,
    action: keyof UserPermissions,
): boolean {
    return permissions[action] ?? false;
}

/**
 * Check if user can perform any action
 */
export function hasAnyPermission(permissions: UserPermissions): boolean {
    return Object.values(permissions).some(Boolean);
}

/**
 * Check if user is super admin
 */
export function isUserSuperAdmin(auth: AuthData): boolean {
    if (!auth?.user) return false;
    const userRoles: string[] =
        auth.roles || auth.user?.roles?.map((r) => r.name) || [];
    return userRoles.includes('Super Admin');
}

/**
 * Get permissions from user roles/abilities
 * This should be implemented based on your authentication system
 */
export function getUserPermissions(
    auth: AuthData,
    resource: string,
): UserPermissions {
    if (!auth?.user) return DEFAULT_PERMISSIONS;

    // Collect permission names from shared props or embedded user relations
    const userPermissions: string[] =
        auth.permissions ||
        auth.user?.permissions?.map((p) => p.name) ||
        [];

    // Collect role names from shared props or embedded user relations
    const userRoles: string[] =
        auth.roles || auth.user?.roles?.map((r) => r.name) || [];

    // Super Admin gets everything by default
    const isSuperAdmin = userRoles.includes('Super Admin');

    // Check if user has specific permissions for this resource
    const canCreate =
        isSuperAdmin || userPermissions.includes(`${resource}.create`);
    const canRead =
        isSuperAdmin || userPermissions.includes(`${resource}.view`);
    const canUpdate =
        isSuperAdmin || userPermissions.includes(`${resource}.edit`);
    const canDelete =
        isSuperAdmin || userPermissions.includes(`${resource}.delete`);
    const canExport =
        isSuperAdmin ||
        userPermissions.includes(`${resource}.export`) ||
        userPermissions.includes(`${resource}.view`);
    const canBulkDelete = canDelete;
    const canViewDetails = canRead;

    return {
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        canExport,
        canBulkDelete,
        canViewDetails,
    };
}

/**
 * Permission-based action visibility
 */
export function getVisibleActions<TData>(
    item: TData,
    permissions: UserPermissions,
    customActions?: ((item: TData) => boolean)[],
): string[] {
    const actions: string[] = [];

    if (permissions.canViewDetails) actions.push('view');
    if (permissions.canUpdate) actions.push('edit');
    if (permissions.canDelete) actions.push('delete');

    // Add custom actions if provided
    customActions?.forEach((check, index) => {
        if (check(item)) actions.push(`custom_${index}`);
    });

    return actions;
}

/**
 * Check if bulk actions should be shown
 */
export function canShowBulkActions(
    permissions: UserPermissions,
    selectedCount: number,
): boolean {
    return (
        (permissions.canBulkDelete || permissions.canExport) &&
        selectedCount > 0
    );
}
