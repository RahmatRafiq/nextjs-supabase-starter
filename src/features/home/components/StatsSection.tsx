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
    value: 200,
    suffix: '+',
    label: 'Anggota Aktif',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    icon: Award,
    value: 50,
    suffix: '+',
    label: 'Event per Tahun',
    color: 'from-green-500 to-green-600',
  },
  {
    id: '3',
    icon: TrendingUp,
    value: 8,
    suffix: '',
    label: 'Divisi Aktif',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: '4',
    icon: Leaf,
    value: 10,
    suffix: ' Tahun',
    label: 'Pengalaman Berorganisasi',
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
    <section className="relative py-40 overflow-hidden bg-gray-900">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-gray-900 to-gray-900" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-600/10 to-transparent" />

      <div className="container-custom relative z-10">
        {/* Simple centered header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            HMJF dalam <span className="text-primary-400">Angka</span>
          </h2>
        </motion.div>

        {/* Minimal stats - no cards, just numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                {/* Icon - minimal */}
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary-400 mx-auto mb-6" />

                {/* Big number - focus on data */}
                <div className="text-white mb-4">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="text-gray-400 font-medium text-sm md:text-base">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Optional divider */}
        <div className="mt-24 pt-16 border-t border-gray-800">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Organisasi mahasiswa farmasi yang aktif mengembangkan akademik, soft skills, dan pengabdian masyarakat
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
