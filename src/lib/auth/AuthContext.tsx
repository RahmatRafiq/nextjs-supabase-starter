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

  const isFetchingRef = useRef(false);
  const pendingFetchRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const hasSetLoadingFalseRef = useRef(false);

  const fetchProfile = useCallback(async (userId: string, silent = false): Promise<void> => {
    if (isFetchingRef.current) {
      pendingFetchRef.current = userId;
      return;
    }

    if (silent && profile?.id === userId) return;

    isFetchingRef.current = true;

    try {
      const { data, error } = await getProfileService(userId);

      if (error) {
        const err = error as { code?: string };
        if (err.code === 'PGRST116' && !profile) {
          setProfile(null);
          setError(error as Error);
        } else {
          if (!profile) setError(error as Error);
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('[AuthContext] Unexpected error:', err);
    } finally {
      isFetchingRef.current = false;

      if (!hasSetLoadingFalseRef.current) {
        setLoading(false);
        hasSetLoadingFalseRef.current = true;
        initializedRef.current = true;
      }

      if (pendingFetchRef.current) {
        const pendingUserId = pendingFetchRef.current;
        pendingFetchRef.current = null;
        setTimeout(() => fetchProfile(pendingUserId, true), 0);
      }
    }
  }, [profile]);

  useEffect(() => {
    let mounted = true;

    const safetyTimeout = setTimeout(() => {
      if (mounted && !hasSetLoadingFalseRef.current) {
        setLoading(false);
        hasSetLoadingFalseRef.current = true;
        initializedRef.current = true;
      }
    }, 10000);

    async function initAuth(): Promise<void> {
      if (initializedRef.current) return;

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[AuthContext] Error getting session:', error);
          }
          if (mounted) {
            setLoading(false);
            initializedRef.current = true;
          }
          return;
        }

        if (!mounted) {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
          initializedRef.current = true;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Auth initialization error:', error);
        }
        if (mounted) {
          setLoading(false);
          initializedRef.current = true;
        }
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext]', event);
      }

      if (!initializedRef.current) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        if (event === 'SIGNED_IN') {
          await fetchProfile(session.user.id);
        } else if (event === 'TOKEN_REFRESHED') {
          // No-op
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          if (mounted) {
            setLoading(false);
            initializedRef.current = false;
          }
        }
      } else {
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          if (mounted) {
            setLoading(false);
            initializedRef.current = false;
          }
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    const { error } = await signInService(email, password);
    if (error) throw error;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await signOutService();

    setUser(null);
    setProfile(null);
    setSession(null);
    isFetchingRef.current = false;
    initializedRef.current = false;
  }, []);

  const hasPermission = useCallback((requiredRoles: UserRole[]) => checkPermission(profile, requiredRoles), [profile]);
  const canManageUsers = useCallback(() => hasPermission(['super_admin']), [hasPermission]);
  const canManageMembers = useCallback(() => hasPermission(['super_admin', 'admin']), [hasPermission]);
  const canManageLeadership = useCallback(() => hasPermission(['super_admin', 'admin']), [hasPermission]);
  const canPublishArticles = useCallback(() => hasPermission(['super_admin', 'admin']), [hasPermission]);
  const canEditOwnContent = useCallback((authorId: string) => isAuthor(user, authorId), [user]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      await fetchProfile(user.id);
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
