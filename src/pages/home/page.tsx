import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateOrganizationSchema, generateEducationalOrganizationSchema } from '@/lib/seo';
import HeroSection from './components/HeroSection';
import MascotSection from './components/MascotSection';
import FeaturesSection from './components/FeaturesSection';
import PricingBanner from './components/PricingBanner';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import LibrasHistorySection from './components/LibrasHistorySection';
import InterpreterGuide from '@/components/feature/InterpreterGuide';

export default function Home() {
  const seo = pageSEO.home;
  const canonical = `${SITE_URL}/`;
  
  const schema = [
    generateWebPageSchema(seo.title, seo.description, canonical),
    generateOrganizationSchema(),
    generateEducationalOrganizationSchema(),
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={canonical}
        ogTitle={seo.title}
        ogDescription={seo.description}
        ogType="website"
        ogUrl={canonical}
        schema={schema}
      />
      <main>
        <Navbar />
        <div data-guide="hero"><HeroSection /></div>
        <div data-guide="mascot"><MascotSection /></div>
        <div data-guide="features"><FeaturesSection /></div>
        <div data-guide="history"><LibrasHistorySection /></div>
        <div data-guide="pricing"><PricingBanner /></div>
        <div data-guide="about"><AboutSection /></div>
        <div data-guide="testimonials"><TestimonialsSection /></div>
        <div data-guide="cta"><CTASection /></div>
        <Footer />
      </main>
      <InterpreterGuide />
    </>
  );
}