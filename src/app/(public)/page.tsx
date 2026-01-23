import dynamic from 'next/dynamic';
import { HeroSection } from '@/features/home/components/HeroSection';
import { HOME_CONTENT } from '@/config';

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

export default function HomePage() {
  return (
    <>
      <HeroSection data={HOME_CONTENT.hero} />
      <FeaturesSection data={HOME_CONTENT.features} />
      <StatsSection />
      <ArticlesPreview />
      <EventsPreview />
      <CTASection data={HOME_CONTENT.cta} />
    </>
  );
}
