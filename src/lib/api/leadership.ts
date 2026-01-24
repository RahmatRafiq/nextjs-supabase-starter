/**
 * Leadership API - Simplified data fetching
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Social media JSONB structure
 */
interface SocialMediaRaw {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

/**
 * Leadership from database (raw snake_case)
 */
interface LeadershipRaw {
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
  social_media: SocialMediaRaw | null;
  period_start: string;
  period_end: string;
  order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Leadership member with camelCase fields (for frontend)
 */
export interface LeadershipMember {
  id: string;
  name: string;
  position: string;
  division?: string;
  period: {
    start: string;
    end: string;
  };
  email?: string;
  phone?: string;
  photo: string;
  bio?: string;
  socialMedia?: {
    instagram?: string;
    linkedin?: string;
  };
  order: number;
}

/**
 * Transform raw database leadership to frontend format
 */
function transformLeadership(raw: LeadershipRaw): LeadershipMember {
  // Parse period from period_start and period_end
  const period = {
    start: raw.period_start,
    end: raw.period_end,
  };

  return {
    id: raw.id,
    name: raw.name,
    position: raw.position,
    division: raw.division ?? undefined,
    period,
    email: raw.email ?? undefined,
    phone: raw.phone ?? undefined,
    photo: raw.photo ?? '/images/default-avatar.png',
    bio: raw.bio ?? undefined,
    socialMedia: raw.social_media ? {
      instagram: raw.social_media.instagram,
      linkedin: raw.social_media.linkedin,
    } : undefined,
    order: raw.order,
  };
}

/**
 * Get all leadership members
 */
export async function getLeadership(): Promise<LeadershipMember[]> {
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching leadership:', error);
    throw new Error('Failed to fetch leadership');
  }

  return (data ?? []).map(transformLeadership);
}

/**
 * Get active leadership (current period)
 */
export async function getActiveLeadership(): Promise<LeadershipMember[]> {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .lte('period_start', now)
    .gte('period_end', now)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching active leadership:', error);
    throw new Error('Failed to fetch active leadership');
  }

  return (data ?? []).map(transformLeadership);
}

/**
 * Get leadership by period year (e.g., "2024")
 */
export async function getLeadershipByPeriod(year: string): Promise<LeadershipMember[]> {
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .gte('period_start', `${year}-01-01`)
    .lte('period_start', `${year}-12-31`)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching leadership by period:', error);
    throw new Error('Failed to fetch leadership by period');
  }

  return (data ?? []).map(transformLeadership);
}

/**
 * Get leadership by division
 */
export async function getLeadershipByDivision(division: string): Promise<LeadershipMember[]> {
  const now = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .eq('division', division)
    .lte('period_start', now)
    .gte('period_end', now)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching leadership by division:', error);
    throw new Error('Failed to fetch leadership by division');
  }

  return (data ?? []).map(transformLeadership);
}

/**
 * Get leadership member by ID
 */
export async function getLeadershipById(id: string): Promise<LeadershipMember | null> {
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching leadership by ID:', error);
    throw new Error('Failed to fetch leadership member');
  }

  return data ? transformLeadership(data) : null;
}
