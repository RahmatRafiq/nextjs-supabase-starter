/**
 * Supabase Server Client - Privileged server-side instance
 *
 * Creates a Supabase client using the service role key, which bypasses Row Level Security (RLS).
 * This client has full database access and should ONLY be used in secure server environments.
 *
 * @remarks
 * **SECURITY WARNING:**
 * - Uses SUPABASE_SERVICE_ROLE_KEY (NEVER expose to browsers!)
 * - Bypasses ALL RLS policies (full database access)
 * - No automatic user authentication (runs as service role)
 * - Must be used ONLY in server-side code (API routes, server actions, server components)
 *
 * **When to Use:**
 * - ✅ Admin operations that need to bypass RLS
 * - ✅ Bulk operations on behalf of users
 * - ✅ System-level tasks (cleanup, migrations, cron jobs)
 * - ✅ API routes that need elevated permissions
 * - ❌ NEVER in client components
 * - ❌ NEVER in browser-accessible code
 * - ❌ Regular CRUD operations (use client.ts instead)
 *
 * **Use Cases:**
 * 1. **Admin User Management**: Create/update users with specific roles
 * 2. **Batch Operations**: Update multiple records across users
 * 3. **System Operations**: Database maintenance, analytics aggregation
 * 4. **Webhooks**: Process external events with full permissions
 *
 * **Permission Model:**
 * This client operates as the 'service_role' user:
 * - Can read/write ANY table regardless of RLS
 * - Can access auth.users table directly
 * - Can perform operations that users cannot
 * - Should validate permissions manually in your code
 *
 * @example
 * ```ts
 * // API Route example (app/api/admin/users/route.ts)
 * import { supabaseServer } from '@/lib/supabase/server';
 *
 * export async function POST(request: Request) {
 *   // IMPORTANT: Validate user is admin BEFORE using server client
 *   const { user } = await getSession();
 *   if (!isAdmin(user)) {
 *     return new Response('Unauthorized', { status: 403 });
 *   }
 *
 *   if (!supabaseServer) {
 *     return new Response('Server client not configured', { status: 500 });
 *   }
 *
 *   // Now safe to use server client (bypasses RLS)
 *   const { data, error } = await supabaseServer
 *     .from('users')
 *     .update({ role: 'admin' })
 *     .eq('id', userId);
 *
 *   return Response.json({ data, error });
 * }
 * ```
 *
 * @example
 * ```ts
 * // Bad example - DO NOT DO THIS
 * 'use client'; // ❌ NEVER use server client in client components!
 * import { supabaseServer } from '@/lib/supabase/server';
 *
 * function BadComponent() {
 *   // This exposes service key to browser - SECURITY VULNERABILITY!
 *   const data = await supabaseServer.from('articles').select('*');
 * }
 * ```
 *
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs#server-side} Server-side Auth
 * @see {@link https://supabase.com/docs/guides/database/postgres/row-level-security#bypassing-rls} Bypassing RLS
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Server-side Supabase client with service role privileges
 *
 * @remarks
 * **Initialization:**
 * - Returns `null` if environment variables are not set (safe fallback)
 * - Always check for null before using: `if (!supabaseServer) throw error`
 * - Only initializes on server (service key is not available in browser)
 *
 * **Environment Variables:**
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Secret key (NEVER commit to git, NEVER expose to client)
 *
 * **Best Practices:**
 * 1. Always validate user permissions before executing queries
 * 2. Check for null before using
 * 3. Use specific queries (avoid SELECT *)
 * 4. Log all service role operations for audit trail
 * 5. Prefer client.ts for operations that can use RLS
 */
export const supabaseServer = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null;
