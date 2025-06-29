import { Auth } from '@/types';

/**
 * Check if a user can view all contributions
 */
export function canViewAllContributions(auth: Auth): boolean {
    return auth?.permissions?.contributions?.viewAll ?? false;
}

/**
 * Check if a user can create contributions
 */
export function canCreateContributions(auth: Auth): boolean {
    return auth?.permissions?.contributions?.create ?? false;
}

/**
 * Check if a user can delete contributions
 */
export function canDeleteContributions(auth: Auth): boolean {
    return auth?.permissions?.contributions?.delete ?? false;
}

/**
 * Check if a user can access admin features
 */
export function canAccessAdmin(auth: Auth): boolean {
    return auth?.permissions?.admin?.access ?? false;
}

/**
 * Check if a user can view own contributions (all authenticated users can)
 */
export function canViewOwnContributions(auth: Auth): boolean {
    return auth?.user !== null;
}
