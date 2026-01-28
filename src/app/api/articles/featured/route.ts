import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Create a fresh client for this request to bypass any shared instance caching
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
      },
    });

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)
      .returns<any[]>();

    if (error) {
      throw error;
    }

    // Transform raw data to match frontend expectations (handling camelCase)
    const transformedArticles = articles.map(raw => ({
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      excerpt: raw.excerpt,
      content: raw.content,
      category: raw.category,
      coverImage: raw.cover_image,
      tags: raw.tags || [],
      featured: raw.featured,
      status: raw.status,
      author: {
        name: raw.author?.name || 'Unknown',
        role: raw.author?.email || '',
        avatar: undefined,
      },
      publishedAt: raw.published_at,
      updatedAt: raw.updated_at,
    }));

    return NextResponse.json(transformedArticles);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured articles' },
      { status: 500 }
    );
  }
}
