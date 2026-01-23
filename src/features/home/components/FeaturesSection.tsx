/**
 * FeaturesSection Component
 * Modern bento-style layout without cards - Optimized
 */

'use client';

import { Leaf, Users, GraduationCap, Heart, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from '@/shared/components/ui/Section';
import { HomeSettings } from '@/config';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Users,
  GraduationCap,
  Heart,
};

interface FeaturesSectionProps {
  data: HomeSettings['features'];
}

export function FeaturesSection({ data }: FeaturesSectionProps) {
  return (
    <Section className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Header - Sticky */}
          <div className="lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter">
                {data.title}
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed border-l-2 border-primary-500 pl-6">
                {data.description}
              </p>
            </motion.div>
          </div>

          {/* Features List - Minimalist & Clean */}
          <div className="space-y-12">
            {data.items.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Leaf;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-6 items-start">
                    {/* Icon - No box, just icon */}
                    <div className="mt-1 p-3 rounded-2xl bg-gray-50 group-hover:bg-primary-50 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-gray-900 group-hover:text-primary-600 transition-colors duration-300" />
                    </div>

                    <div className="border-b border-gray-100 pb-12 w-full group-last:border-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-gray-500 leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
