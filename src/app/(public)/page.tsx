import dynamic from 'next/dynamic';
import { HeroSection } from '@/features/home/components/HeroSection';
import { getHomeSettings } from '@/lib/api/settings';

const FeaturesSection = dynamic(() => import('@/features/home/components/FeaturesSection').then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="h-96" />,
});

const StatsSection = dynamic(() => import('@/features/home/components/StatsSection').then(mod => ({ default: mod.StatsSection })), {
  loading: () => <div className="h-64" />,
});

const ArticlesPreview = dynamic(() => import('@/features/home/components/ArticlesPreview').then(mod => ({ default: mod.ArticlesPreview })), {
  loading: () => <div className="h-96" />,
});

const EventsPreview = dynamic(() => import('@/features/home/components/EventsPreview').then(mod => ({ default: mod.EventsPreview })), {
  loading: () => <div className="h-96" />,
});

const CTASection = dynamic(() => import('@/features/home/components/CTASection').then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="h-64" />,
});

export default async function HomePage() {
  const homeContent = await getHomeSettings();

  return (
    <>
      <HeroSection data={homeContent.hero} />
      <FeaturesSection data={homeContent.features} />
      <StatsSection />
      <ArticlesPreview />
      <EventsPreview />
      <CTASection data={homeContent.cta} />
    </>
  );
}
