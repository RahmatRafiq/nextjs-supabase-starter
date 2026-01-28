'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { getActiveLeadership, type LeadershipMember } from '@/lib/api/leadership';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

/**
 * Format position string for display
 * Examples: 'ketua' → 'Ketua', 'wakil-ketua' → 'Wakil Ketua', 'coordinator' → 'Koordinator'
 */
function formatPosition(position: string): string {
  return position
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format division string for display
 * Examples: 'internal-affairs' → 'Internal Affairs', 'media-information' → 'Media Information'
 */
function formatDivision(division: string): string {
  return division
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Core positions determined by absence of division (already dynamic)
const corePositions = ['ketua', 'wakil-ketua', 'sekretaris', 'bendahara'];

export default function LeadershipPage() {
  const [coreLeadership, setCoreLeadership] = useState<LeadershipMember[]>([]);
  const [groupedByDivision, setGroupedByDivision] = useState<Record<string, LeadershipMember[]>>({});
  const [_loading, setLoading] = useState(true);

  // Parallax Setup
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getActiveLeadership();

        // Split into core and division leadership
        const core = all.filter((member) => !member.division && corePositions.includes(member.position));
        const divisionLeadership = all.filter((member) => member.division);

        // Group by division
        const grouped = divisionLeadership.reduce((acc, member) => {
          const div = member.division ?? '';
          if (!acc[div]) {
            acc[div] = [];
          }
          acc[div].push(member);
          return acc;
        }, {} as Record<string, LeadershipMember[]>);

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


  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      {/* Hero Section - Cinematic & Abstract */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0 opacity-60"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black" />
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-secondary-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </motion.div>

        <div className="container-custom relative z-10 text-center mix-blend-screen">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, letterSpacing: '0em' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '-0.02em' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter mb-6"
          >
            Leadership
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto font-light tracking-wide px-4"
          >
            The visionaries behind the movement.
          </motion.p>
        </div>
      </section>

      {/* Core Team - Editorial Posters (Floating Images) */}
      <section className="bg-black py-20 md:py-32 text-white relative z-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            {coreLeadership.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="group relative"
              >
                {/* Free-standing Image - No Container/Card Styles */}
                <div className="relative aspect-[3/4] overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out bg-gradient-to-br from-primary-900/30 to-gray-900/30 flex items-center justify-center">
                  {member.photo ? (
                    <>
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      {/* Subtle Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <User className="w-24 h-24 text-primary-300" />
                    </motion.div>
                  )}
                </div>

                {/* Typography - Minimal & Clean */}
                <div className="border-t border-gray-800 pt-4 group-hover:border-primary-500 transition-colors duration-500">
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{member.name}</h3>
                  <p className="text-primary-500 text-sm font-mono tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                    {formatPosition(member.position)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Division Leadership - Editorial List (Non-Grid) */}
      <section className="bg-white py-20 md:py-32">
        <div className="container-custom">
          {Object.entries(groupedByDivision).map(([division, members]) => (
            <motion.div
              key={division}
              className="mb-24 md:mb-32 last:mb-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Division Header - Big Typography */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 mb-12">
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-4 md:mb-0">
                  {formatDivision(division)}
                </h2>
                <span className="text-2xl font-bold font-mono text-gray-300 mt-4 md:mt-0">
                  {String(members.length).padStart(2, '0')} MEMBERS
                </span>
              </div>

              {/* Members List - Interactive Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {members.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    className="flex items-center gap-6 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {/* Circle Avatar - Transitions to Square on Hover */}
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-full group-hover:rounded-none transition-all duration-500 bg-gradient-to-br from-primary-100/50 to-gray-100/50 flex items-center justify-center">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                        >
                          <User className="w-10 h-10 text-primary-300" />
                        </motion.div>
                      )}
                    </div>

                    {/* Text Info */}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-sm text-gray-500 font-mono mt-1 uppercase tracking-wide">
                        {formatPosition(member.position)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
