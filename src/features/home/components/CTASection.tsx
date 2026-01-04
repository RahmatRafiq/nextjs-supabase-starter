/**
 * CTASection Component
 * Modern CTA for agrotourism booking
 */

'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Calendar, Phone, MapPin, Clock, Users, Sparkles } from 'lucide-react';
import homeData from '../../../../public/data/home.json';
import { motion } from 'framer-motion';

export function CTASection() {
  const { cta } = homeData;

  const benefits = [
    { icon: MapPin, text: '5 Hektar Area Hijau' },
    { icon: Clock, text: 'Buka Setiap Hari' },
    { icon: Users, text: 'Cocok untuk Keluarga' },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-primary-50/50" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/5" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Pengalaman Tak Terlupakan</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              {cta.title}
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {cta.description}
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-primary-100"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group shadow-xl">
                <Link href={cta.primaryCTA.link}>
                  <Calendar className="mr-2 w-5 h-5" />
                  {cta.primaryCTA.text}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group"
              >
                <Link href={`tel:${cta.secondaryCTA.phone}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  {cta.secondaryCTA.text}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-primary-100">
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-primary-50 rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-primary-300 mx-auto mb-2" />
                    <p className="text-primary-600 font-medium">Foto Kebun</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600">30+</div>
                  <div className="text-xs text-gray-600 mt-1">Tanaman</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-2xl font-bold text-secondary-600">100%</div>
                  <div className="text-xs text-gray-600 mt-1">Organik</div>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600">5ha</div>
                  <div className="text-xs text-gray-600 mt-1">Lahan</div>
                </div>
              </div>

              {/* Decorative badge */}
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-secondary-500 text-white px-6 py-3 rounded-full shadow-lg"
              >
                <p className="text-sm font-bold">Promo!</p>
              </motion.div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border-2 border-primary-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pengunjung/Bulan</p>
                  <p className="text-lg font-bold text-gray-900">1000+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
