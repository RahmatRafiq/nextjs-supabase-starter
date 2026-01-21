/**
 * Repository Factory
 *
 * Central switching mechanism between JSON and Supabase repositories.
 * Uses environment variable feature flags to control which implementation to use.
 *
 * Benefits:
 * - Zero breaking changes to existing pages
 * - Instant rollback via environment variables
 * - Progressive testing (entity-by-entity)
 * - Clean removal when migration complete
 */

import { IMemberRepository } from '@/core/repositories/IMemberRepository';
import { IArticleRepository } from '@/core/repositories/IArticleRepository';
import { IEventRepository } from '@/core/repositories/IEventRepository';
import { ILeadershipRepository } from '@/core/repositories/ILeadershipRepository';

// JSON implementations
import { JsonMemberRepository } from './JsonMemberRepository';
import { JsonArticleRepository } from './JsonArticleRepository';
import { JsonEventRepository } from './JsonEventRepository';
import { JsonLeadershipRepository } from './JsonLeadershipRepository';

// Supabase implementations
import { SupabaseMemberRepository } from './SupabaseMemberRepository';
import { SupabaseArticleRepository } from './SupabaseArticleRepository';
import { SupabaseEventRepository } from './SupabaseEventRepository';
import { SupabaseLeadershipRepository } from './SupabaseLeadershipRepository';

export class RepositoryFactory {
  /**
   * Get Member Repository
   *
   * Returns Supabase implementation if NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true,
   * otherwise returns JSON implementation.
   */
  static getMemberRepository(): IMemberRepository {
    const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_MEMBERS === 'true';
    return useSupabase ? new SupabaseMemberRepository() : new JsonMemberRepository();
  }

  /**
   * Get Article Repository
   *
   * Returns Supabase implementation if NEXT_PUBLIC_USE_SUPABASE_ARTICLES=true,
   * otherwise returns JSON implementation.
   */
  static getArticleRepository(): IArticleRepository {
    const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_ARTICLES === 'true';
    return useSupabase ? new SupabaseArticleRepository() : new JsonArticleRepository();
  }

  /**
   * Get Event Repository
   *
   * Returns Supabase implementation if NEXT_PUBLIC_USE_SUPABASE_EVENTS=true,
   * otherwise returns JSON implementation.
   */
  static getEventRepository(): IEventRepository {
    const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_EVENTS === 'true';
    return useSupabase ? new SupabaseEventRepository() : new JsonEventRepository();
  }

  /**
   * Get Leadership Repository
   *
   * Returns Supabase implementation if NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=true,
   * otherwise returns JSON implementation.
   */
  static getLeadershipRepository(): ILeadershipRepository {
    const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP === 'true';
    return useSupabase ? new SupabaseLeadershipRepository() : new JsonLeadershipRepository();
  }
}
