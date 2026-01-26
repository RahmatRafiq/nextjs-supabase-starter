import { Profile, UserRole } from '@/types/auth-definitions';

export function checkPermission(profile: Profile | null, requiredRoles: UserRole[]): boolean {
    if (!profile) return false;
    return requiredRoles.includes(profile.role);
}

export function isAuthor(user: { id: string } | null, authorId: string): boolean {
    if (!user) return false;
    return user.id === authorId;
}
