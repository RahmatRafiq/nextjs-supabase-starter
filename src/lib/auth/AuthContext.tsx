'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type UserRole = 'super_admin' | 'admin' | 'kontributor';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null; // Added error state
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
  const [error, setError] = useState<Error | null>(null); // Added error state

  // Track if we're currently fetching to prevent race conditions
  const isFetchingRef = useRef(false);
  const pendingFetchRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: force loading to false after 10 seconds
    // Safety timeout: force loading to false after 10 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && !initializedRef.current) {
        console.warn('[AuthContext] Loading timeout - forcing loading to false');
        setLoading(false);
        initializedRef.current = true;
      }
    }, 10000);

    async function initAuth(): Promise<void> {
      // Prevent multiple initializations
      if (initializedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] Already initialized, skipping');
        }
        return;
      }

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

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Auth state change event:', event, 'session:', !!session);
      }

      // Don't process ANY events during initial load - let initAuth handle everything
      if (!initializedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] Skipping event during initialization:', event);
        }
        return;
      }

      // Only update session state, don't trigger profile refetch unless necessary
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Only fetch profile on SIGNED_IN event (user just logged in)
        if (event === 'SIGNED_IN') {
          await fetchProfile(session.user.id);
        }
        // For TOKEN_REFRESHED, keep existing profile - don't refetch
        // This prevents random logouts from failed profile refetch during token refresh
        else if (event === 'TOKEN_REFRESHED') {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[AuthContext] Token refreshed, keeping existing profile');
          }
        }
        else if (event === 'SIGNED_OUT') {
          setProfile(null);
          if (mounted) {
            setLoading(false);
            initializedRef.current = false;
          }
        }
      } else {
        // Only clear profile on explicit SIGNED_OUT event
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount. fetchProfile is stable.

  async function fetchProfile(userId: string, silent = false): Promise<void> {
    const isMounted = { current: true };

    // Prevent concurrent fetches - queue the request instead of ignoring it
    if (isFetchingRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Fetch already in progress, queuing for later');
      }
      // Queue this request to run after current fetch completes
      pendingFetchRef.current = userId;
      return;
    }

    // Skip if already fetched for this user AND we're doing a silent refresh
    if (silent && profile?.id === userId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Profile already loaded, skipping silent refresh');
      }
      return;
    }

    isFetchingRef.current = true;

    try {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Fetching profile for user:', userId);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Error fetching profile:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });
        }

        // If profile not found (PGRST116), it might be creating via trigger.
        // Wait a bit and retry once.
        if (error.code === 'PGRST116') {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[AuthContext] Profile not found (PGRST116), waiting for trigger...');
          }

          if (!silent) {
            // Wait 1 second and try again
            await new Promise(resolve => setTimeout(resolve, 1000));

            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            if (!retryError && retryData) {
              setProfile(retryData);
              return;
            }
          }

          throw error;
        }

        // For other errors, log and continue
        console.error('[AuthContext] Profile fetch failed with error:', error);
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        const fetchedProfile = data as Profile;
        console.warn('[AuthContext] Profile fetched successfully:', {
          id: fetchedProfile.id,
          email: fetchedProfile.email,
          role: fetchedProfile.role,
        });
      }

      setProfile(data);
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AuthContext] Error in fetchProfile:', error);
      }

      // Only clear profile on PGRST116 (profile not found) during initial creation
      // For ALL other errors (network, timeout, permission), keep existing profile to prevent random logouts
      const err = error as { code?: string };
      if (err.code === 'PGRST116' && !profile) {
        // Only set null if profile doesn't exist yet (initial load/creation)
        setProfile(null);
        setError(error as Error);
      } else {
        // Keep existing profile for all other errors - prevents random logouts
        console.warn('[AuthContext] Fetch failed but keeping existing profile to prevent logout:', error);
        // Clear error after 5 seconds to avoid persistent error states
        setError(error as Error);
        setTimeout(() => {
          if (isMounted.current) {
            setError(null);
          }
        }, 5000);
      }

      // Don't throw - we want to complete initialization even if profile fetch fails
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      initializedRef.current = true;

      // Process pending fetch if any
      if (pendingFetchRef.current) {
        const pendingUserId = pendingFetchRef.current;
        pendingFetchRef.current = null;
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] Processing pending fetch for:', pendingUserId);
        }
        // Use setTimeout to avoid potential stack overflow with recursive calls
        setTimeout(() => fetchProfile(pendingUserId, true), 0);
      }
    }
  }

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    // Reset all state on sign out
    setUser(null);
    setProfile(null);
    setSession(null);
    isFetchingRef.current = false;
    initializedRef.current = false;
  }, []);

  // Permission helpers - memoized with useCallback to prevent re-renders
  const hasPermission = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!profile) {
      return false;
    }
    return requiredRoles.includes(profile.role);
  }, [profile]);

  const canManageUsers = useCallback((): boolean => {
    return hasPermission(['super_admin']);
  }, [hasPermission]);

  const canManageMembers = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canManageLeadership = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canPublishArticles = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canEditOwnContent = useCallback((authorId: string): boolean => {
    if (!user) {
      return false;
    }
    return user.id === authorId;
  }, [user]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      await fetchProfile(user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // fetchProfile is stable, no need to include

  // Memoize context value to prevent unnecessary re-renders
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
    error, // Add to dependency array
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
