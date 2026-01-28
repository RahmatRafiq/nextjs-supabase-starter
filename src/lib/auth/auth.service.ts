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
