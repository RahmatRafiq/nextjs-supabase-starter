/**
 * User Roles
 */
export type UserRole = 'super_admin' | 'admin' | 'kontributor';

/**
 * User Profile
 */
export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
    raw_app_meta_data?: {
        role?: UserRole;
        [key: string]: any;
    };
}
