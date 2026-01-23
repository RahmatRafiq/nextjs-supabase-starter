/**
 * CTASection Component
 * Modern CTA for agrotourism booking
 */

'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { HomeSettings } from '@/config';

interface CTASectionProps {
  data: HomeSettings['cta'];
}

export function CTASection({ data }: CTASectionProps) {
  return (
    <section className="relative py-40 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Big, bold CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              {data.title}
            </h2>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              {data.description}
            </p>

            {/* CTA Buttons - prominent */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" variant="secondary" asChild className="group text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-transform">
                <Link href={data.primaryCTA.link}>
                  {data.primaryCTA.text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-primary-700 transition-all"
              >
                <Link href={`tel:${data.secondaryCTA.phone}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  {data.secondaryCTA.text}
                </Link>
              </Button>
            </div>

            {/* Simple stats - no cards */}
            <div className="flex flex-wrap justify-center gap-12 pt-12 border-t border-white/20">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">200+</p>
                <p className="text-white/80">Anggota Aktif</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">50+</p>
                <p className="text-white/80">Event per Tahun</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">8</p>
                <p className="text-white/80">Divisi Aktif</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
