import { HeroSection } from '@/features/home/components/HeroSection';
import { FeaturesSection } from '@/features/home/components/FeaturesSection';
import { StatsSection } from '@/features/home/components/StatsSection';
import { ProductsPreview } from '@/features/home/components/ProductsPreview';
import { CTASection } from '@/features/home/components/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <ProductsPreview />
      <CTASection />
    </>
  );
}
