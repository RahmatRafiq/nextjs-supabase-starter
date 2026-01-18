/**
 * About Page
 * Company information and history
 */

import { Metadata } from 'next';
import { Timeline } from '@/features/about/components/Timeline';
import { Section } from '@/shared/components/ui/Section';
import { Leaf, Target, Heart, Award, Users, TrendingUp } from 'lucide-react';
import aboutData from '../../../public/data/about.json';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Tentang HMJF UIN Alauddin Makassar - Himpunan Mahasiswa Jurusan Farmasi',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Section className="pb-8 pt-16 md:pt-24 bg-gray-50 border-b border-gray-100">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Tentang Kami
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
            Mengenal lebih dekat HMJF UIN Alauddin Makassar dan perjalanan kami dalam mengembangkan mahasiswa Farmasi yang profesional.
          </p>
        </div>
      </Section>

      {/* Story Section - Modern Text Layout */}
      <Section className="py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3">
              <div className="sticky top-24">
                <div className="flex items-center gap-3 mb-4 text-primary-600">
                  <Leaf className="w-6 h-6" />
                  <span className="font-bold tracking-wider uppercase text-sm">Cerita Kami</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Perjalanan Menuju Dedikasi
                </h2>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-gray-700 leading-relaxed text-lg md:text-xl text-balance">
                {aboutData.story}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Vision - Split Layout */}
      <Section className="bg-gray-900 text-white py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary-400">
                <Target className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Misi Kami</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed border-l-2 border-primary-600 pl-6">
                {aboutData.mission}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-secondary-400">
                <Heart className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Visi Kami</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed border-l-2 border-secondary-600 pl-6">
                {aboutData.vision}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Values - Open Grid */}
      <Section className="py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {aboutData.values.map((value, index) => (
              <div key={index} className="group text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                  <Leaf className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Statistics - Bold Numbers */}
      <Section className="py-24 bg-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {Object.entries(aboutData.statistics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-4xl md:text-6xl font-black text-gray-900 mb-2 tracking-tighter">
                  {value}
                </div>
                <div className="text-sm font-bold text-primary-600 uppercase tracking-widest">
                  {key === 'landArea' && 'Anggota Aktif'}
                  {key === 'productTypes' && 'Event / Tahun'}
                  {key === 'visitorsPerYear' && 'Divisi'}
                  {key === 'farmerPartners' && 'Tahun Berdiri'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section className="py-24">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
            Perjalanan Kami
          </h2>
          <Timeline items={aboutData.timeline} />
        </div>
      </Section>

      {/* Affiliations - Clean List */}
      <Section className="py-24 bg-gray-900 text-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-16 text-center">Kemitraan & Afiliasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {aboutData.affiliations.map((affiliation) => (
              <div key={affiliation.name} className="border-t pt-8 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <Award className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{affiliation.name}</h3>
                    <p className="text-xs font-bold text-primary-400 mb-3 uppercase tracking-wider">{affiliation.type}</p>
                    <p className="text-gray-400 text-sm">{affiliation.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Certifications - Simple Grid */}
      <Section className="py-24">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aboutData.certifications.map((cert) => (
              <div key={cert.name} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-gray-50 transition-colors duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Award className="w-10 h-10 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h3>
                  <p className="text-primary-600 font-medium">Tahun {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
