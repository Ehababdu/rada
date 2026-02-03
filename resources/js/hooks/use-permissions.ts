import {
    UserPermissions,
    getUserPermissions,
    type AuthData,
} from '@/lib/permissions';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

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
    const { props } = usePage<{ auth: AuthData }>();
    const { auth } = props;

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
