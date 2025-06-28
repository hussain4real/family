import { Auth, User } from '@/types';

/**
 * Check if a user has a specific permission
 * Can accept either User object with permissions or Auth object
 */
export function hasPermission(userOrAuth: User | Auth | null | undefined, permission: string): boolean {
    if (!userOrAuth) {
        return false;
    }

    // Check if it's an Auth object (has permissions array directly)
    if ('permissions' in userOrAuth && Array.isArray(userOrAuth.permissions)) {
        return userOrAuth.permissions.includes(permission);
    }

    // Check if it's a User object with permissions array
    if ('permissions' in userOrAuth && userOrAuth.permissions) {
        return userOrAuth.permissions.includes(permission);
    }

    return false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(userOrAuth: User | Auth | null | undefined, permissions: string[]): boolean {
    if (!userOrAuth) {
        return false;
    }

    // Check if it's an Auth object
    if ('permissions' in userOrAuth && Array.isArray(userOrAuth.permissions)) {
        return permissions.some(permission => (userOrAuth as Auth).permissions.includes(permission));
    }

    // Check if it's a User object with permissions
    if ('permissions' in userOrAuth && userOrAuth.permissions) {
        return permissions.some(permission => userOrAuth.permissions!.includes(permission));
    }

    return false;
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(userOrAuth: User | Auth | null | undefined, permissions: string[]): boolean {
    if (!userOrAuth) {
        return false;
    }

    // Check if it's an Auth object
    if ('permissions' in userOrAuth && Array.isArray(userOrAuth.permissions)) {
        return permissions.every(permission => (userOrAuth as Auth).permissions.includes(permission));
    }

    // Check if it's a User object with permissions
    if ('permissions' in userOrAuth && userOrAuth.permissions) {
        return permissions.every(permission => userOrAuth.permissions!.includes(permission));
    }

    return false;
}

/**
 * Check if a user has a specific role
 */
export function hasRole(userOrAuth: User | Auth | null | undefined, role: string): boolean {
    if (!userOrAuth) {
        return false;
    }

    // Check if it's an Auth object
    if ('roles' in userOrAuth && Array.isArray(userOrAuth.roles)) {
        return userOrAuth.roles.includes(role);
    }

    // Check if it's a User object with roles
    if ('roles' in userOrAuth && userOrAuth.roles) {
        return userOrAuth.roles.includes(role);
    }

    return false;
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(userOrAuth: User | Auth | null | undefined, roles: string[]): boolean {
    if (!userOrAuth) {
        return false;
    }

    // Check if it's an Auth object
    if ('roles' in userOrAuth && Array.isArray(userOrAuth.roles)) {
        return roles.some(role => (userOrAuth as Auth).roles.includes(role));
    }

    // Check if it's a User object with roles
    if ('roles' in userOrAuth && userOrAuth.roles) {
        return roles.some(role => userOrAuth.roles!.includes(role));
    }

    return false;
}

/**
 * Check if a user can access admin features (financial secretary role or admin permissions)
 */
export function canAccessAdmin(userOrAuth: User | Auth | null | undefined): boolean {
    return hasRole(userOrAuth, 'financial-secretary') ||
        hasPermission(userOrAuth, 'view-all-contributions');
}
