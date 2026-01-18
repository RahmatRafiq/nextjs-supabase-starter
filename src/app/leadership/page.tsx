'use client';

import Image from 'next/image';
import { JsonLeadershipRepository } from '@/infrastructure/repositories/JsonLeadershipRepository';
import { DIVISIONS } from '@/lib/constants';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { LeadershipListItem, Leadership } from '@/core/entities/Leadership';

const positionLabels: Record<string, string> = {
  'ketua': 'Ketua',
  'wakil-ketua': 'Wakil Ketua',
  'sekretaris': 'Sekretaris',
  'bendahara': 'Bendahara',
  'coordinator': 'Koordinator',
  'member': 'Anggota',
};

export default function LeadershipPage() {
  const [coreLeadership, setCoreLeadership] = useState<LeadershipListItem[]>([]);
  const [groupedByDivision, setGroupedByDivision] = useState<Record<string, LeadershipListItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadershipRepo = new JsonLeadershipRepository();
        const core = await leadershipRepo.getCore();
        const all = await leadershipRepo.getAll();

        // Group by division
        const divisionLeadership = all.filter((member) => member.division);
        const grouped = divisionLeadership.reduce((acc, member) => {
          const div = member.division!;
          if (!acc[div]) acc[div] = [];
          acc[div].push(member);
          return acc;
        }, {} as Record<string, LeadershipListItem[]>);

        setCoreLeadership(core);
        setGroupedByDivision(grouped);
      } catch (error) {
        console.error('Failed to fetch leadership:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Kepengurusan
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Struktur kepengurusan HMJF UIN Alauddin periode 2025-2026
          </p>
        </div>
      </section>

      {/* Core Leadership - Modern Grid */}
      <section className="container-custom py-24">
        <div className="max-w-5xl mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Pengurus <span className="text-primary-600">Inti</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreLeadership.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              whileHover={{ y: -8 }}
              className="group"
            >
              {/* Image - minimal frame */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6 bg-gradient-to-br from-primary-100/50 to-gray-100/50">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Info - clean typography */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-bold mb-4">{positionLabels[member.position]}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="line-clamp-1">{member.email}</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Division Leadership - Bento Style */}
      <section className="relative py-24 overflow-hidden bg-gray-50">
        <div className="container-custom">
          <div className="max-w-5xl mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Koordinator <span className="text-primary-600">Divisi</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedByDivision).map(([division, members]) => (
              <div key={division} className="relative">
                {/* Division header - bold */}
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {DIVISIONS[division as keyof typeof DIVISIONS]}
                  </h3>
                  <div className="w-16 h-1 bg-primary-600 rounded-full" />
                </div>
                {/* Members - minimal layout */}
                <div className="space-y-6">
                  {members.map((member) => (
                    <div key={member.id} className="relative group">
                      <div className="flex items-center gap-4">
                        {/* Avatar - larger, cleaner */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            className="rounded-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                            {member.name}
                          </p>
                          <p className="text-sm text-primary-600 font-semibold mb-2">
                            {positionLabels[member.position]}
                          </p>
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-xs text-gray-600 hover:text-primary-600 transition-colors line-clamp-1 block"
                            >
                              {member.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
