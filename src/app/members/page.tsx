import { Metadata } from 'next';
import Image from 'next/image';
import { JsonMemberRepository } from '@/infrastructure/repositories/JsonMemberRepository';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Anggota - HMJF UIN Alauddin',
  description: 'Daftar anggota Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { batch?: string; division?: string };
}) {
  const memberRepo = new JsonMemberRepository();
  const { batch, division } = searchParams;

  let members = await memberRepo.getByStatus('active');

  if (batch) {
    members = members.filter((m) => m.batch === batch);
  }
  if (division) {
    members = members.filter((m) => m.division === division);
  }

  // Get unique batches
  const allMembers = await memberRepo.getAll();
  const batches = [...new Set(allMembers.map((m) => m.batch))].sort().reverse();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Anggota
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Daftar anggota aktif HMJF UIN Alauddin Makassar
          </p>
        </div>
      </section>

      {/* Filters - Bold Tabs */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
            <a
              href="/members"
              className={`px-8 py-4 font-bold whitespace-nowrap transition-all rounded-2xl flex-shrink-0 ${
                !batch
                  ? 'bg-gray-900 text-white shadow-lg scale-105'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Semua Angkatan
            </a>
            {batches.map((b) => (
              <a
                key={b}
                href={`/members?batch=${b}`}
                className={`px-8 py-4 font-bold whitespace-nowrap transition-all rounded-2xl flex-shrink-0 ${
                  batch === b
                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Angkatan {b}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Members Grid - Modern Layout */}
      <section className="container-custom py-16">
        <div className="mb-12">
          <p className="text-xl text-gray-600">
            Menampilkan <span className="text-3xl font-bold text-gray-900">{members.length}</span> anggota
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-500 text-xl">Tidak ada anggota ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {members.map((member) => (
              <div key={member.id} className="group">
                {/* Photo - minimal frame */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-4 bg-gradient-to-br from-primary-100/50 to-gray-100/50 flex items-center justify-center">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <User className="w-16 h-16 text-primary-300" />
                  )}
                </div>
                {/* Info - clean typography */}
                <div className="text-center">
                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{member.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{member.nim}</p>
                  <p className="text-xs text-primary-600 font-bold">Angkatan {member.batch}</p>
                  {member.division && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">{member.division}</p>
                  )}
                  {member.position && (
                    <p className="text-xs text-gray-700 font-semibold mt-1 line-clamp-1">{member.position}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
