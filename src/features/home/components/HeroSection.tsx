/**
 * HeroSection Component
 * Main hero section for homepage - Optimized
 */

'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import homeData from '../../../../public/data/home.json';
import { motion } from 'framer-motion';
import { ParallaxHero } from '@/shared/components/ui/ParallaxHero';
import { cn } from '@/lib/utils';

// Simplified animation variants - Reduced complexity
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2, // Small delay to let hydration settle
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }, // Faster duration
};

export function HeroSection() {
  const { hero } = homeData;

  return (
    <ParallaxHero className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden pt-32 pb-16 md:py-32 flex items-center min-h-[90vh]">
      {/* CSS-based Background Animations (Zero JS overhead for these loops) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={item}
              className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-primary-700 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-primary-100 cursor-default"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              <span>{hero.badge}</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              {hero.title}{' '}
              <span className="gradient-text">
                {hero.titleHighlight}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={item} className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
              {hero.description}
            </motion.p>

            {/* Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Link href={hero.primaryCTA.link}>
                  {hero.primaryCTA.text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover:bg-primary-50 border-primary-200">
                <Link href={hero.secondaryCTA.link}>
                  <Leaf className="mr-2 w-5 h-5 text-primary-600" />
                  {hero.secondaryCTA.text}
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
              {hero.stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image/Visual Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto">
              {/* Main Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 rounded-[2rem] shadow-2xl overflow-hidden transform rotate-3 transition-transform hover:rotate-0 duration-500">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="absolute inset-0 flex items-center justify-center text-white/90">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center animate-float">
                      <Leaf className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Griya Flora</h3>
                    <p className="text-primary-100">Pusat Agrowisata Babulu</p>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-10 -left-12 bg-white p-4 rounded-xl shadow-xl animate-float-delayed z-20 max-w-[200px]">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Review 4.9/5</p>
                    <p className="text-xs text-gray-500">Dari Pengunjung</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-20 -right-8 bg-white p-4 rounded-xl shadow-xl animate-float z-20">
                <div className="flex items-center space-x-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p className="font-bold text-gray-800 text-sm">Buka Setiap Hari</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxHero>
  );
}
