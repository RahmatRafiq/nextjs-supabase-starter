/**
 * User types
 * Used in admin panel and public pages
 */

import { UserRole } from '@/types/auth-definitions';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type Profile = User; // Alias for consistency
