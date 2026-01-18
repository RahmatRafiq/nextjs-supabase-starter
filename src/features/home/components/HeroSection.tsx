/**
 * HeroSection Component
 * Main hero section for homepage
 */

'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import homeData from '../../../../public/data/home.json';
import { motion } from 'framer-motion';
import { ParallaxHero } from '@/shared/components/ui/ParallaxHero';

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

export function HeroSection() {
  const { hero } = homeData;

  return (
    <ParallaxHero className="bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl"
          />
        </div>

        <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div
              variants={item}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  "0 10px 30px -15px rgba(79, 70, 229, 0.3)",
                  "0 10px 40px -15px rgba(79, 70, 229, 0.5)",
                  "0 10px 30px -15px rgba(79, 70, 229, 0.3)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-primary-700 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg border border-primary-100 cursor-default"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>{hero.badge}</span>
            </motion.div>

            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {hero.title}{' '}
              <span className="text-primary-600">
                {hero.titleHighlight}
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
              {hero.description}
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group shadow-lg hover:shadow-xl">
                <Link href={hero.primaryCTA.link}>
                  {hero.primaryCTA.text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <Link href={hero.secondaryCTA.link}>
                  <Leaf className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {hero.secondaryCTA.text}
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-6 pt-8">
              {hero.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-default p-4 rounded-xl hover:bg-white/50 transition-all"
                >
                  <div className="text-3xl font-bold text-primary-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Placeholder with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="relative h-96 lg:h-[500px] bg-gradient-to-br from-primary-200 to-secondary-200 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Animated gradient overlay */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-br from-primary-300/30 to-secondary-300/30"
              />

              {/* Placeholder content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-center text-white"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Leaf className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  </motion.div>
                  <p className="text-lg font-medium">Hero Image</p>
                  <p className="text-sm opacity-75">Tambahkan foto kebun di sini</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Animated floating elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-400/40 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-primary-400/40 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
        </div>
      </section>
    </ParallaxHero>
  );
}
