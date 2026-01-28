'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Article as ArticleListItem } from '@/lib/api/articles';
import { ARTICLE_CATEGORIES } from '@/config/domain.config';

interface ArticlesGridProps {
  articles: ArticleListItem[];
}

export function ArticlesGrid({ articles }: ArticlesGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500 text-xl">Belum ada artikel tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {articles.map((article, index) => {
        const isFeatured = index === 0;
        const isLarge = index % 5 === 0;

        return (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              delay: index * 0.1,
              duration: 0.6,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            whileHover={{
              y: -12,
              transition: { duration: 0.3 },
            }}
            className={`group relative ${isFeatured
                ? 'md:col-span-8 md:row-span-2'
                : isLarge
                  ? 'md:col-span-7'
                  : 'md:col-span-5'
              }`}
          >
            <Link href={`/articles/${article.slug}`} className="block">
              {/* Image with overlay - no card container */}
              <div className={`relative overflow-hidden rounded-3xl ${isFeatured ? 'aspect-[4/5]' : 'aspect-[16/10]'
                }`}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                >
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </motion.div>

                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Category badge - minimal */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="absolute top-6 left-6"
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-full shadow-lg"
                  >
                    {ARTICLE_CATEGORIES[article.category]}
                  </motion.span>
                </motion.div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  {/* Author */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-center gap-3 mb-4"
                  >
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
                  </motion.div>

                  {/* Title - varying sizes */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className={`font-bold text-white mb-3 line-clamp-2 ${isFeatured
                        ? 'text-3xl md:text-4xl'
                        : isLarge
                          ? 'text-2xl md:text-3xl'
                          : 'text-xl md:text-2xl'
                      }`}
                  >
                    {article.title}
                  </motion.h2>

                  {/* Excerpt - only for featured/large */}
                  {(isFeatured || isLarge) && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="text-white/90 line-clamp-2 mb-4 text-base md:text-lg"
                    >
                      {article.excerpt}
                    </motion.p>
                  )}

                  {/* Tags - minimal */}
                  {article.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="flex flex-wrap gap-2"
                    >
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ delay: index * 0.1 + 0.7 + tagIndex * 0.05 }}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
