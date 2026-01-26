import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types/auth-definitions';

export async function getProfileService(userId: string) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            // If profile not found (PGRST116), wait and retry once (trigger delay)
            if (error.code === 'PGRST116') {
                // Wait 1 second
                await new Promise(resolve => setTimeout(resolve, 1000));

                const { data: retryData, error: retryError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (!retryError && retryData) {
                    return { data: retryData as Profile, error: null };
                }
                return { data: null, error: error };
            }
            return { data: null, error };
        }

        return { data: data as Profile, error: null };
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function signInService(email: string, password: string) {
    return supabase.auth.signInWithPassword({
        email,
        password,
    });
}

export async function signOutService() {
    return supabase.auth.signOut();
}
