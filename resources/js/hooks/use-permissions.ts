import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { UserPermissions, getUserPermissions } from '@/lib/permissions';

export interface UsePermissionsReturn {
    permissions: UserPermissions;
    can: (action: keyof UserPermissions) => boolean;
    canAny: () => boolean;
    canAll: () => boolean;
}

/**
 * Hook for checking user permissions for a specific resource
 */
export function usePermissions(resource: string): UsePermissionsReturn {
    const { auth } = usePage().props as any;

    const permissions = useMemo(() => {
        return getUserPermissions(auth, resource);
    }, [auth, resource]);

    const can = (action: keyof UserPermissions): boolean => {
        return permissions[action] ?? false;
    };

    const canAny = (): boolean => {
        return Object.values(permissions).some(Boolean);
    };

    const canAll = (): boolean => {
        return Object.values(permissions).every(Boolean);
    };

    return {
        permissions,
        can,
        canAny,
        canAll,
    };
}

/**
 * Direct permission check function
 */
export function can(action: keyof UserPermissions, resource: string): boolean {
    const { auth } = usePage().props as any;
    const permissions = getUserPermissions(auth, resource);
    return permissions[action] ?? false;
}