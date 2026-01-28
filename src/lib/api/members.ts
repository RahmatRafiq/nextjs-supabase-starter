/**
 * Members API - Simplified data fetching
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Social media JSONB structure
 */
interface SocialMediaRaw {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

/**
 * Member from database (raw snake_case)
 */
interface MemberRaw {
  id: string;
  name: string;
  nim: string;
  email: string;
  phone: string | null;
  photo: string | null;
  batch: string;
  status: 'active' | 'inactive' | 'alumni';
  division: string | null;
  position: string | null;
  joined_at: string;
  graduated_at: string | null;
  bio: string | null;
  interests: string[] | null;
  achievements: string[] | null;
  social_media: SocialMediaRaw | null;
  created_at: string;
  updated_at: string;
}

/**
 * Member with camelCase fields (for frontend)
 */
export interface Member {
  id: string;
  name: string;
  nim: string;
  email: string;
  phone?: string;
  photo?: string;
  batch: string;
  status: 'active' | 'inactive' | 'alumni';
  division?: string;
  position?: string;
  joinedAt: string;
  graduatedAt?: string;
  bio?: string;
  interests?: string[];
  achievements?: string[];
  socialMedia?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

/**
 * Check if photo URL is valid
 */
function isValidPhotoUrl(url: string | null): boolean {
  if (!url) return false;
  if (url.includes('w3.org')) return false;
  if (url.trim() === '') return false;
  return true;
}

/**
 * Transform raw database member to frontend format
 */
function transformMember(raw: MemberRaw): Member {
  return {
    id: raw.id,
    name: raw.name,
    nim: raw.nim,
    email: raw.email,
    phone: raw.phone ?? undefined,
    photo: isValidPhotoUrl(raw.photo) ? raw.photo! : undefined,
    batch: raw.batch,
    status: raw.status,
    division: raw.division ?? undefined,
    position: raw.position ?? undefined,
    joinedAt: raw.joined_at,
    graduatedAt: raw.graduated_at ?? undefined,
    bio: raw.bio ?? undefined,
    interests: raw.interests ?? undefined,
    achievements: raw.achievements ?? undefined,
    socialMedia: raw.social_media ? {
      instagram: raw.social_media.instagram,
      linkedin: raw.social_media.linkedin,
      twitter: raw.social_media.twitter,
    } : undefined,
  };
}

/**
 * Get all members
 */
export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to fetch members');
  }

  return (data ?? []).map(transformMember);
}

/**
 * Get active members only
 */
export async function getActiveMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching active members:', error);
    throw new Error('Failed to fetch active members');
  }

  return (data ?? []).map(transformMember);
}

/**
 * Get members by division
 */
export async function getMembersByDivision(division: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('division', division)
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching members by division:', error);
    throw new Error('Failed to fetch members by division');
  }

  return (data ?? []).map(transformMember);
}

/**
 * Get members by batch
 */
export async function getMembersByBatch(batch: string): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('batch', batch)
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching members by batch:', error);
    throw new Error('Failed to fetch members by batch');
  }

  return (data ?? []).map(transformMember);
}

/**
 * Get member by ID
 */
export async function getMemberById(id: string): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching member by ID:', error);
    throw new Error('Failed to fetch member');
  }

  return data ? transformMember(data) : null;
}
