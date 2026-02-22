'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { Settings, Home, Info, Save } from 'lucide-react';
import { RichTextEditor } from '@/shared/components/RichTextEditor';

type TabType = 'home' | 'about';

interface HomeSettings {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryCTA: { text: string; link: string };
    secondaryCTA: { text: string; link: string };
    stats: Array<{ value: string; label: string }>;
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
      color: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    primaryCTA: { text: string; link: string };
    secondaryCTA: { text: string; phone: string };
  };
}

interface AboutSettings {
  mission: string;
  vision: string;
  story: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

export default function SettingsPage() {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Home settings state
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null);

  // About settings state
  const [aboutSettings, setAboutSettings] = useState<AboutSettings | null>(null);

  useEffect(() => {
    if (!hasPermission(['super_admin', 'admin'])) {
      toast.error('You do not have permission to access this page');
      return;
    }
    fetchSettings();
  }, [hasPermission]);

  async function fetchSettings() {
    setFetching(true);
    try {
      // Direct query to Supabase - no API route (kemafar pattern)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;

      // Type the data explicitly
      type SettingsRow = {
        key: string;
        content: HomeSettings | AboutSettings;
      };
      const settings = data as SettingsRow[];

      // Find home and about settings from database
      const homeData = settings?.find((s) => s.key === 'home');
      const aboutData = settings?.find((s) => s.key === 'about');

      if (homeData) setHomeSettings(homeData.content as HomeSettings);
      if (aboutData) setAboutSettings(aboutData.content as AboutSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setFetching(false);
    }
  }

  async function handleSaveHome() {
    if (!homeSettings) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Direct upsert to Supabase (kemafar pattern)
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'home',
          content: homeSettings as unknown as Record<string, unknown>,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        } as never, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast.success('Home settings saved successfully');
    } catch (error) {
      console.error('Error saving home settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAbout() {
    if (!aboutSettings) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Direct upsert to Supabase (kemafar pattern)
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'about',
          content: aboutSettings as unknown as Record<string, unknown>,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        } as never, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast.success('About settings saved successfully');
    } catch (error) {
      console.error('Error saving about settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Site Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage homepage and about page content
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'home'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Home className="w-4 h-4" />
            Home Settings
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'about'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Info className="w-4 h-4" />
            About Settings
          </button>
        </nav>
      </div>

      {/* Home Tab Content */}
      {activeTab === 'home' && homeSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Home Page Content</h2>

            {/* Hero Section */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800">Hero Section</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  value={homeSettings.hero.badge}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, badge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={homeSettings.hero.title}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Highlight
                </label>
                <input
                  type="text"
                  value={homeSettings.hero.titleHighlight}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, titleHighlight: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={homeSettings.hero.description}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      hero: { ...homeSettings.hero, description: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Call-to-Action Section</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Title
                </label>
                <input
                  type="text"
                  value={homeSettings.cta.title}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      cta: { ...homeSettings.cta, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Description
                </label>
                <textarea
                  value={homeSettings.cta.description}
                  onChange={(e) =>
                    setHomeSettings({
                      ...homeSettings,
                      cta: { ...homeSettings.cta, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveHome}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Home Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Tab Content */}
      {activeTab === 'about' && aboutSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">About Page Content</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission
              </label>
              <RichTextEditor
                value={aboutSettings.mission}
                onChange={(markdown) =>
                  setAboutSettings({ ...aboutSettings, mission: markdown })
                }
                placeholder="Enter mission statement..."
                height="200px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision
              </label>
              <RichTextEditor
                value={aboutSettings.vision}
                onChange={(markdown) =>
                  setAboutSettings({ ...aboutSettings, vision: markdown })
                }
                placeholder="Enter vision statement..."
                height="200px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story
              </label>
              <RichTextEditor
                value={aboutSettings.story}
                onChange={(markdown) =>
                  setAboutSettings({ ...aboutSettings, story: markdown })
                }
                placeholder="Tell your organization's story..."
                height="300px"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveAbout}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save About Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
