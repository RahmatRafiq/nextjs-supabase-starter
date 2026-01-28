'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { UserRole, Profile } from '@/types/auth-definitions';
import { getProfileService, signInService, signOutService } from './auth.service';
import { checkPermission, isAuthor } from './auth.utils';

export type { UserRole, Profile };

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  hasPermission: (requiredRoles: UserRole[]) => boolean;
  canManageUsers: () => boolean;
  canManageMembers: () => boolean;
  canManageLeadership: () => boolean;
  canPublishArticles: () => boolean;
  canEditOwnContent: (authorId: string) => boolean;

  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(false);

  // Prevent multiple fetch calls
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await getProfileService(userId);
      if (error) {
        if (mountedRef.current) {
          setError(error as Error);
          // Don't nullify profile on temporary errors if we had one? 
          // But strict correctness says if we fetched and got nothing, it's null.
          setProfile(null);
        }
      } else {
        if (mountedRef.current) {
          setProfile(prev => {
            // Simple equality check to prevent re-renders if data is same
            if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
            return data;
          });
          setError(null);
        }
      }
    } catch (err) {
      console.error('[AuthContext] Unexpected error:', err);
      if (mountedRef.current) setError(err as Error);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    async function handleAuthChange(session: Session | null) {
      if (!mountedRef.current) return;

      // Update session/user with stability checks
      setSession(prev => {
        if (prev?.access_token === session?.access_token) return prev;
        return session;
      });

      setUser(prev => {
        if (prev?.id === session?.user?.id && prev?.updated_at === session?.user?.updated_at) return prev;
        return session?.user ?? null;
      });

      if (session?.user) {
        // Only fetch profile if we don't have it or if user changed
        // We can check local profile state vs session user
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      if (mountedRef.current) setLoading(false);
    }

    // Initialize
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[AuthContext] Session error:', error);
        if (mountedRef.current) setLoading(false);
      } else {
        handleAuthChange(session);
      }
    });

    // Listen
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    const { error } = await signInService(email, password);
    if (error) throw error;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await signOutService();
    if (mountedRef.current) {
      setUser(null);
      setProfile(null);
      setSession(null);
    }
  }, []);

  const hasPermission = useCallback((requiredRoles: UserRole[]) => checkPermission(profile, requiredRoles), [profile]);
  const canManageUsers = useCallback(() => hasPermission(['super_admin']), [hasPermission]);
  const canManageMembers = useCallback(() => hasPermission(['super_admin', 'admin']), [hasPermission]);
  const canManageLeadership = useCallback(() => hasPermission(['super_admin', 'admin']), [hasPermission]);
  const canPublishArticles = useCallback(() => hasPermission(['super_admin', 'admin']), [hasPermission]);
  const canEditOwnContent = useCallback((authorId: string) => isAuthor(user, authorId), [user]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      setLoading(true);
      await fetchProfile(user.id);
      if (mountedRef.current) setLoading(false);
    }
  }, [user, fetchProfile]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signOut,
    hasPermission,
    canManageUsers,
    canManageMembers,
    canManageLeadership,
    canPublishArticles,
    canEditOwnContent,
    refreshProfile,
  }), [
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signOut,
    hasPermission,
    canManageUsers,
    canManageMembers,
    canManageLeadership,
    canPublishArticles,
    canEditOwnContent,
    refreshProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
