/**
 * StatsSection Component
 * Animated statistics and achievements
 */

'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Users, Leaf, Award, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    id: '1',
    icon: Users,
    value: 1000,
    suffix: '+',
    label: 'Pengunjung per Bulan',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    icon: Leaf,
    value: 30,
    suffix: '+',
    label: 'Jenis Tanaman Organik',
    color: 'from-green-500 to-green-600',
  },
  {
    id: '3',
    icon: Award,
    value: 100,
    suffix: '%',
    label: 'Produk Organik',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: '4',
    icon: TrendingUp,
    value: 5,
    suffix: 'ha',
    label: 'Luas Lahan Hijau',
    color: 'from-primary-500 to-primary-600',
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!nodeRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(count, value, { duration: 2, ease: 'easeOut' });
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(nodeRef.current);

    return () => observer.disconnect();
  }, [count, value, hasAnimated]);

  return (
    <div ref={nodeRef} className="text-5xl md:text-6xl font-bold">
      {displayValue}
      <span className="text-4xl md:text-5xl">{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-4">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">Pencapaian Kami</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
            Dipercaya oleh Ribuan Pengunjung
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan keluarga yang telah merasakan pengalaman agrowisata organik terbaik
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative h-full p-8 bg-white rounded-3xl shadow-xl border-2 border-transparent hover:border-primary-200 transition-all duration-300 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Counter */}
                  <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-3`}>
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {stat.label}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full opacity-50" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 rounded-full border-2 border-primary-100">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">
                Rating 4.8/5.0
              </p>
              <p className="text-xs text-gray-600">dari 500+ review</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
