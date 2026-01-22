/**
 * Form data types
 * Used in admin CRUD pages
 */

import { UserRole } from '@/lib/auth/AuthContext';

// User Forms
export interface UserFormData {
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string;
}

export interface CreateUserFormData extends UserFormData {
  password: string;
}

// Leadership Forms
export interface LeadershipFormData {
  name: string;
  position: string;
  division: string;
  photo: string;
  email: string;
  phone: string;
  nim: string;
  batch: string;
  bio: string;
  social_media: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  period_start: string;
  period_end: string;
  order: number;
}

// Member Forms
export interface MemberFormData {
  name: string;
  nim: string;
  email: string;
  phone: string;
  batch: string;
  major: string;
  photo: string;
  bio: string;
  join_date: string;
  status: 'active' | 'inactive' | 'alumni';
  social_media: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Article Forms
export interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
}

// Event Forms
export interface EventFormData {
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  registration_link: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  max_participants: number | null;
  tags: string[];
}
