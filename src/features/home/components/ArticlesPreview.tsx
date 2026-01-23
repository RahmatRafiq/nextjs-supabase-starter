'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import type { ArticleListItem } from '@/core/entities/Article';
import { ARTICLE_CATEGORIES } from '@/lib/constants';

export function ArticlesPreview() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Header - Bold & Asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Artikel <span className="text-primary-600">Terbaru</span>
            </h2>
            <p className="text-xl text-gray-600">Bacaan terkini dari HMJF</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <Link
              href="/articles"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Modern Grid - No cards, overlapping images */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {articles.map((article, index) => {
            const isFeatured = index === 0;
            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className={`group relative ${isFeatured ? 'md:col-span-7 md:row-span-2' : 'md:col-span-5'}`}
              >
                {/* Image - larger, more prominent */}
                <div className={`relative overflow-hidden rounded-3xl ${isFeatured ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category badge - floating */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full">
                      {ARTICLE_CATEGORIES[article.category]}
                    </span>
                  </div>

                  {/* Content overlay - on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <time>{format(new Date(article.publishedAt), 'd MMM yyyy', { locale: id })}</time>
                    </div>
                    <h3 className={`font-bold text-white mb-3 line-clamp-2 ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                      {article.title}
                    </h3>
                    {isFeatured && (
                      <p className="text-white/90 line-clamp-2 mb-4">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
