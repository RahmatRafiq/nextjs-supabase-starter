/**
 * FeaturesSection Component
 * Modern bento-style layout without cards
 */

'use client';

import { Leaf, Users, GraduationCap, Heart, LucideIcon } from 'lucide-react';
import homeData from '../../../../public/data/home.json';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Users,
  GraduationCap,
  Heart,
};

export function FeaturesSection() {
  const { features } = homeData;

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/30 to-white" />

      {/* Organic blob shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header - Bold typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {features.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600">
            {features.description}
          </p>
        </motion.div>

        {/* Bento Grid - Asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.items.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Leaf;
            const isLarge = index === 0 || index === 3;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative ${isLarge ? 'lg:col-span-2' : ''}`}
              >
                {/* Glassmorphism background - no borders */}
                <div className="relative h-full p-8 md:p-10 rounded-3xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500">
                  {/* Subtle gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color.replace('bg-', 'from-').replace('text-', 'to-')}/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    {/* Icon - minimal, no heavy backgrounds */}
                    <div className="mb-6">
                      <Icon className={`w-12 h-12 ${feature.color.includes('text-') ? feature.color : 'text-primary-600'}`} strokeWidth={1.5} />
                    </div>

                    {/* Title - varying sizes for contrast */}
                    <h3 className={`font-bold text-gray-900 mb-4 ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-gray-600 leading-relaxed ${isLarge ? 'text-lg' : 'text-base'}`}>
                      {feature.description}
                    </p>

                    {/* Decorative element - subtle */}
                    <div className="absolute top-8 right-8 w-2 h-2 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
