import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { JsonArticleRepository } from '@/infrastructure/repositories/JsonArticleRepository';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Artikel - HMJF UIN Alauddin',
  description: 'Kumpulan artikel, blog, opini, publikasi, dan informasi dari Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const articleRepo = new JsonArticleRepository();
  const category = searchParams.category as keyof typeof ARTICLE_CATEGORIES | undefined;

  const articles = category
    ? await articleRepo.getByCategory(category as any)
    : await articleRepo.getAll();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Artikel
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Kumpulan artikel, blog, opini, publikasi ilmiah, dan informasi terkini dari HMJF
          </p>
        </div>
      </section>

      {/* Category Filter - Floating Pills */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/articles"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                !category
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </Link>
            {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
              <Link
                key={key}
                href={`/articles?category=${key}`}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                  category === key
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Masonry Grid - No Cards */}
      <section className="container-custom py-16">
        {articles.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-500 text-xl">Belum ada artikel tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {articles.map((article, index) => {
              const isFeatured = index === 0;
              const isLarge = index % 5 === 0;

              return (
                <article
                  key={article.id}
                  className={`group relative ${
                    isFeatured
                      ? 'md:col-span-8 md:row-span-2'
                      : isLarge
                      ? 'md:col-span-7'
                      : 'md:col-span-5'
                  }`}
                >
                  <Link href={`/articles/${article.slug}`} className="block">
                    {/* Image with overlay - no card container */}
                    <div className={`relative overflow-hidden rounded-3xl ${
                      isFeatured ? 'aspect-[4/5]' : 'aspect-[16/10]'
                    }`}>
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Gradient for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Category badge - minimal */}
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-full">
                          {ARTICLE_CATEGORIES[article.category]}
                        </span>
                      </div>

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        {/* Author */}
                        <div className="flex items-center gap-3 mb-4">
                          {article.author.avatar && (
                            <Image
                              src={article.author.avatar}
                              alt={article.author.name}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-white/50"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {article.author.name}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-white/80">
                              <time>{format(new Date(article.publishedAt), 'd MMM yyyy', { locale: id })}</time>
                              {article.views && <span>• {article.views} views</span>}
                            </div>
                          </div>
                        </div>

                        {/* Title - varying sizes */}
                        <h2 className={`font-bold text-white mb-3 line-clamp-2 ${
                          isFeatured
                            ? 'text-3xl md:text-4xl'
                            : isLarge
                            ? 'text-2xl md:text-3xl'
                            : 'text-xl md:text-2xl'
                        }`}>
                          {article.title}
                        </h2>

                        {/* Excerpt - only for featured/large */}
                        {(isFeatured || isLarge) && (
                          <p className="text-white/90 line-clamp-2 mb-4 text-base md:text-lg">
                            {article.excerpt}
                          </p>
                        )}

                        {/* Tags - minimal */}
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
