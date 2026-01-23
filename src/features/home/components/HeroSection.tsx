/**
 * HeroSection Component
 * Main hero section for homepage - Optimized
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { CountingNumber } from '@/shared/components/ui/CountingNumber';
import { HomeSettings } from '@/config';

// Optimized animation variants for better performance
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};

interface HeroSectionProps {
  data: HomeSettings['hero'];
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <div className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-20">
      {/* Abstract Background Shapes - Clean & Modern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-50 rounded-full blur-[100px] opacity-60 translate-y-1/3 -translate-x-1/4" />

      <div className="container-custom relative z-10 w-full" style={{ minHeight: '600px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Text Content - Editorially aligned */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col justify-center"
            style={{ minHeight: '500px' }}
          >
            {/* Badge - Minimalist pill */}
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 w-fit mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600 tracking-wide uppercase">{data.badge}</span>
            </motion.div>

            {/* Headline - Massive & Tight - LCP Element Optimized */}
            <motion.h1
              variants={item}
              className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.1] md:leading-[1] tracking-tighter mb-8"
              style={{ contentVisibility: 'auto', minHeight: '200px' }}
            >
              {data.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                {data.titleHighlight}
              </span>
            </motion.h1>

            {/* Description - Reader friendly */}
            <motion.p variants={item} className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl border-l-4 border-gray-100 pl-6 mb-10">
              {data.description}
            </motion.p>

            {/* CTAs - Minimal buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Link
                href={data.primaryCTA.link}
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {data.primaryCTA.text}
                <Activity className="w-5 h-5" />
              </Link>
              <Link
                href={data.secondaryCTA.link}
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover:border-gray-300 flex items-center justify-center"
              >
                {data.secondaryCTA.text}
              </Link>
            </motion.div>

            {/* Stats - Horizontal minimalist */}
            <motion.div variants={item} className="flex items-center gap-12 mt-16 pt-8 border-t border-gray-100">
              {data.stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl font-black text-gray-900">
                    <CountingNumber
                      value={parseInt(stat.value.replace(/\D/g, ''))}
                      suffix={stat.value.replace(/[0-9]/g, '')}
                      duration={2.5}
                    />
                  </p>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual - Editorial Image Composition (No Card Box) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="lg:col-span-5 relative h-[600px] hidden lg:block"
            style={{ minHeight: '600px' }}
          >
            {/* Main Hero Image - Organic Shape */}
            <div className="relative z-10 w-full h-full">
              <div className="absolute right-0 top-0 w-4/5 h-4/5 rounded-[4rem] rounded-tr-[10rem] overflow-hidden shadow-2xl shadow-primary-900/10" style={{ transform: 'rotate(3deg)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"
                  alt="Pharmacy Student"
                  fill
                  className="object-cover"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating Accent Image */}
              <div className="absolute left-0 bottom-20 w-3/5 h-2/5 rounded-[3rem] rounded-bl-[6rem] overflow-hidden shadow-xl shadow-secondary-900/10 border-4 border-white" style={{ transform: 'rotate(-6deg)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=2079"
                  alt="Lab Work"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
              </div>

              {/* Minimal floating elements */}
              <div className="absolute top-20 -left-10 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg animate-float">
                <Sparkles className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
