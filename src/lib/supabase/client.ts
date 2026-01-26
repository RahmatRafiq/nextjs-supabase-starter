/**
 * Supabase Client - Browser-side instance
 *
 * Creates a Supabase client for use in client components and browser environments.
 * This client uses the anon/public key which respects Row Level Security (RLS) policies.
 *
 * @remarks
 * **Security Model:**
 * - Uses NEXT_PUBLIC_SUPABASE_ANON_KEY (safe to expose to browsers)
 * - All queries are subject to RLS policies based on authenticated user
 * - User's JWT token is automatically included in requests
 * - Cannot bypass RLS policies (use server.ts for privileged operations)
 *
 * **Authentication Flow:**
 * - Sessions are persisted in localStorage (key: 'kemafar-auth')
 * - Tokens auto-refresh before expiry (default: 55 minutes)
 * - Uses PKCE flow for OAuth (recommended for public clients)
 * - Detects auth callbacks in URL (e.g., /auth/callback?code=...)
 *
 * **When to Use:**
 * - ✅ Client components (use client)
 * - ✅ Browser-side data fetching (articles, events, members)
 * - ✅ User authentication (signIn, signUp, signOut)
 * - ✅ Real-time subscriptions
 * - ❌ Admin operations that bypass RLS (use server.ts instead)
 * - ❌ Server components (use server-side instance instead)
 *
 * **RLS Behavior:**
 * All queries respect user permissions:
 * - Public: Can view published articles, active members, etc.
 * - Kontributor: Can view/edit own content
 * - Admin: Can manage most resources
 * - Super Admin: Full access (defined in SQL policies)
 *
 * @example
 * ```tsx
 * // Client component example
 * 'use client';
 * import { supabase } from '@/lib/supabase/client';
 *
 * async function fetchArticles() {
 *   const { data, error } = await supabase
 *     .from('articles')
 *     .select('*')
 *     .eq('status', 'published');  // RLS ensures only allowed data returned
 *
 *   if (error) throw error;
 *   return data;
 * }
 * ```
 *
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs} Next.js Auth Guide
 * @see {@link https://supabase.com/docs/guides/auth/sessions/pkce-flow} PKCE Flow Documentation
 * @see {@link https://supabase.com/docs/guides/database/postgres/row-level-security} RLS Documentation
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your .env.local file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your .env.local file.'
  );
}

/**
 * Browser-safe Supabase client instance
 *
 * @remarks
 * This is a singleton instance - all imports get the same client.
 * The client automatically manages auth state across the entire app.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    /** Persist auth session in localStorage (survives page refresh) */
    persistSession: true,
    /** Auto-refresh JWT tokens before expiry (prevents logout) */
    autoRefreshToken: true,
    /** Detect OAuth callback URLs (e.g., /auth/callback) */
    detectSessionInUrl: true,
    /** Use localStorage for session storage (undefined on server) */
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    /** Storage key prefix (allows multiple Supabase apps on same domain) */
    storageKey: 'kemafar-auth',
    /** Use PKCE flow (recommended for public clients, more secure than implicit flow) */
    flowType: 'pkce',
  },
});
