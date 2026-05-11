import Hero from '@/components/sections/Hero';
import CurvyProductSlider from '@/components/sections/CurvyProductSlider';
import Stats from '@/components/sections/Stats';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import Partners from '@/components/sections/Partners';
import NewsletterCTA from '@/components/sections/NewsletterCTA';
import DistributorBanner from '@/components/sections/DistributorBanner';
import LogisticsTrustStrip from '@/components/sections/LogisticsTrustStrip';
import CoverageMap from '@/components/sections/CoverageMap';
import LogisticsCapabilities from '@/components/sections/LogisticsCapabilities';
import FeaturedPartnerBrands from '@/components/sections/FeaturedPartnerBrands';
import { SectionDivider } from '@/components/ui/SectionDivider';

/**
 * Composition is intentionally flat — easy to read, easy to reorder. The
 * SectionDivider components add a subtle wave between alternating bg colors
 * so transitions feel intentional rather than abrupt.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CurvyProductSlider />
      <LogisticsTrustStrip />
      <Stats />
      <SectionDivider fromColor="#FFFFFF" toColor="#F8FAFC" />
      <WhyChooseUs />
      <SectionDivider fromColor="#F8FAFC" toColor="#FFFFFF" />
      <CoverageMap />
      <SectionDivider fromColor="#FFFFFF" toColor="#F8FAFC" />
      <LogisticsCapabilities />
      <SectionDivider fromColor="#F8FAFC" toColor="#FFFFFF" />
      <FeaturedProducts />
      <SectionDivider fromColor="#FFFFFF" toColor="#F8FAFC" />
      <Services />
      <SectionDivider fromColor="#F8FAFC" toColor="#FFFFFF" />
      <Testimonials />
      <SectionDivider fromColor="#FFFFFF" toColor="#F8FAFC" />
      <Partners />
      <SectionDivider fromColor="#F8FAFC" toColor="#FFFFFF" />
      <FeaturedPartnerBrands />
      <NewsletterCTA />
      <DistributorBanner />
    </>
  );
}
