import { CategoryHighlights } from './sections/CategoryHighlights';
import { FeaturedProducts } from './sections/FeaturedProducts';
import { HeroSection } from './sections/HeroSection';
import { Newsletter } from './sections/Newsletter';
import { PromoBanner } from './sections/PromoBanner';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <CategoryHighlights />
      <FeaturedProducts />
      <PromoBanner />
      <Newsletter />
    </>
  );
}

export default LandingPage;
