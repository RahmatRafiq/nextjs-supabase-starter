/**
 * ProductsPreview Component
 * Show featured products on homepage with modern animations
 */

'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, ShoppingBag, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Product } from '@/core/entities/Product';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const categoryInfo = {
  fruits: { label: 'Buah', color: 'bg-red-100 text-red-700', icon: '🍓' },
  vegetables: { label: 'Sayur', color: 'bg-green-100 text-green-700', icon: '🥬' },
  flowers: { label: 'Bunga', color: 'bg-pink-100 text-pink-700', icon: '🌸' },
  processed: { label: 'Olahan', color: 'bg-amber-100 text-amber-700', icon: '🍯' },
};

export function ProductsPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products client-side
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="container-custom">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-primary-50/30 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Produk Pilihan</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 font-heading">
              Produk Segar Kami
            </h2>
            <p className="text-xl text-gray-600 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary-600" />
              Langsung dari kebun organik ke meja Anda
            </p>
          </div>
          <Button size="lg" variant="outline" asChild className="hidden lg:flex group shadow-md">
            <Link href={ROUTES.products}>
              Lihat Semua
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => {
            const category = categoryInfo[product.category];

            return (
              <motion.div key={product.id} variants={item}>
                <Link href={`${ROUTES.products}/${product.slug}`}>
                  <Card
                    className="overflow-hidden group cursor-pointer border-2 border-transparent hover:border-primary-200 transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Image Section */}
                      <div className="relative h-56 bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
                        {/* Animated background pattern */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                          }}
                          transition={{ duration: 20, repeat: Infinity }}
                          className="absolute inset-0 opacity-10"
                        >
                          <div className="w-full h-full" style={{
                            backgroundImage: `radial-gradient(circle, ${product.category === 'fruits' ? '#f87171' : product.category === 'vegetables' ? '#4ade80' : product.category === 'flowers' ? '#f472b6' : '#fbbf24'} 1px, transparent 1px)`,
                            backgroundSize: '20px 20px',
                          }} />
                        </motion.div>

                        {/* Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <ShoppingBag className="w-20 h-20 text-primary-300 group-hover:text-primary-400 transition-colors" />
                          </motion.div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          {!product.available ? (
                            <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                              Habis
                            </div>
                          ) : (
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="bg-primary-600/90 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1"
                            >
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Tersedia
                            </motion.div>
                          )}
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <div className={`${category.color} backdrop-blur-sm text-xs font-semibold px-3 py-2 rounded-full shadow-md flex items-center gap-1.5`}>
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          {product.price ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 mb-1">Harga</span>
                              <span className="text-xl font-bold text-primary-600">
                                {product.price}
                              </span>
                            </div>
                          ) : (
                            <div className="flex-1" />
                          )}

                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-primary-600 font-semibold text-sm"
                          >
                            <span>Detail</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </CardContent>
                    </motion.div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 lg:hidden"
        >
          <Button size="lg" variant="outline" asChild className="group shadow-md">
            <Link href={ROUTES.products}>
              Lihat Semua Produk
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
