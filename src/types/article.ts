/**
 * Article types
 * Used in admin panel and public pages
 */

import { User } from './user';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author_id: string;
  category: string | null;
  tags: string[] | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  author?: User;
}
