import { supabase } from '@/lib/supabase/client';
import { HOME_CONTENT, ABOUT_CONTENT, HomeSettings, AboutSettings } from '@/config';

/**
 * Site Settings from database (raw)
 */
interface SiteSettingsRaw {
  id: string;
  key: string;
  content: HomeSettings | AboutSettings; // JSONB column
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Fetch home settings from database with fallback to config
 */
export async function getHomeSettings(): Promise<HomeSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'home')
    .single();

  // If error or no data, use fallback from config
  if (error || !data) {
    return HOME_CONTENT;
  }

  // Return content from database
  return (data as SiteSettingsRaw).content as HomeSettings;
}

/**
 * Fetch about settings from database with fallback to config
 */
export async function getAboutSettings(): Promise<AboutSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'about')
    .single();

  // If error or no data, use fallback from config
  if (error || !data) {
    return ABOUT_CONTENT;
  }

  // Return content from database
  return (data as SiteSettingsRaw).content as AboutSettings;
}
