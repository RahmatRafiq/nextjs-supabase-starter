/**
 * Member types
 * Used in admin panel and public pages
 */

export interface Member {
  id: string;
  name: string;
  nim: string;
  email: string;
  phone: string | null;
  batch: string;
  major: string | null;
  photo: string | null;
  bio: string | null;
  join_date: string;
  status: 'active' | 'inactive' | 'alumni';
  social_media: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  created_at: string;
  updated_at: string;
}
