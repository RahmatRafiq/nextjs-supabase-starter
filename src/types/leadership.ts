/**
 * Leadership types
 * Used in admin panel and public pages
 */

export interface Leadership {
  id: string;
  name: string;
  position: string;
  division: string | null;
  photo: string;
  email: string | null;
  phone: string | null;
  nim: string | null;
  batch: string | null;
  bio: string | null;
  social_media: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  period_start: string;
  period_end: string;
  order: number;
  created_at: string;
  updated_at: string;
}
