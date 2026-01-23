/**
 * About Page
 * Company information and history
 */

import { Metadata } from 'next';
import { AboutContent } from '@/features/about/components/AboutContent';
import { ABOUT_CONTENT } from '@/config';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Tentang HMJF UIN Alauddin Makassar - Himpunan Mahasiswa Jurusan Farmasi',
};

export default function AboutPage() {
  return <AboutContent data={ABOUT_CONTENT} />;
}
