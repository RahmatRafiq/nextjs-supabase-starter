/**
 * FeaturesSection Component
 * Modern bento-style layout without cards - Optimized
 */

'use client';

import { Leaf, Users, GraduationCap, Heart, LucideIcon } from 'lucide-react';
import homeData from '../../../../public/data/home.json';
import { motion } from 'framer-motion';
import { Section } from '@/shared/components/ui/Section';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Users,
  GraduationCap,
  Heart,
};

export function FeaturesSection() {
  const { features } = homeData;

  return (
    <Section className="overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/30 to-white pointer-events-none" />

      {/* Organic blob shapes - CSS Animation */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl animate-float-delayed pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header - Bold typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            {features.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
            {features.description}
          </p>
        </motion.div>

        {/* Bento Grid - Asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.items.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Leaf;
            const isLarge = index === 0 || index === 3;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                className={`group relative ${isLarge ? 'lg:col-span-2' : ''}`}
              >
                {/* Glassmorphism background */}
                <div className="relative h-full p-8 md:p-10 rounded-[2rem] bg-white border border-gray-100/50 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300">
                  {/* Subtle gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color.replace('bg-', 'from-').replace('text-', 'to-')}/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6 w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                      <Icon className={`w-7 h-7 ${feature.color.includes('text-') ? feature.color : 'text-primary-600'}`} />
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold text-gray-900 mb-3 ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-gray-600 leading-relaxed ${isLarge ? 'text-lg' : 'text-base'}`}>
                      {feature.description}
                    </p>

                    {/* Decorative Arrow for large cards */}
                    {isLarge && (
                      <div className="mt-8 text-primary-600 font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Learn more &rarr;
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
