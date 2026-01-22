'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { Users, FileText, Calendar, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface Stats {
  members: number;
  articles: number;
  events: number;
  leadership: number;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    members: 0,
    articles: 0,
    events: 0,
    leadership: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [membersRes, articlesRes, eventsRes, leadershipRes] = await Promise.all([
        supabase.from('members').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('leadership').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        members: membersRes.count || 0,
        articles: articlesRes.count || 0,
        events: eventsRes.count || 0,
        leadership: leadershipRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { name: 'Total Members', value: stats.members, icon: Users, color: 'bg-blue-500' },
    { name: 'Articles', value: stats.articles, icon: FileText, color: 'bg-emerald-500' },
    { name: 'Events', value: stats.events, icon: Calendar, color: 'bg-purple-500' },
    { name: 'Leadership', value: stats.leadership, icon: Award, color: 'bg-orange-500' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {profile?.full_name || profile?.email}!
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.name}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">{card.name}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile?.role !== 'kontributor' && (
            <Link
              href="/admin/members/new"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Add New Member
            </Link>
          )}
          <Link
            href="/admin/articles/new"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Create Article
          </Link>
          <Link
            href="/admin/events/new"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <p className="text-sm text-emerald-800">
          You are logged in as{' '}
          <span className="font-semibold capitalize">{profile?.role.replace('_', ' ')}</span>
        </p>
      </div>
    </div>
  );
}
