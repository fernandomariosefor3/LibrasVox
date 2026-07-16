import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { SEOHead } from '@/components/feature/SEOHead';
import { pageSEO, SITE_URL, generateWebPageSchema, generateOrganizationSchema, generateEducationalOrganizationSchema } from '@/lib/seo';
import HeroSection from './components/HeroSection';
import MascotSection from './components/MascotSection';
import ChooseHowSection from './components/ChooseHowSection';
import LearnSection from './components/LearnSection';
import PracticeSection from './components/PracticeSection';
import ProgressSection from './components/ProgressSection';
import SchoolsSection from './components/SchoolsSection';
import LibrasHistorySection from './components/LibrasHistorySection';
import AccessibilitySection from './components/AccessibilitySection';
import PlatformOverviewSection from './components/PlatformOverviewSection';
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
        <div data-guide="choose-how"><ChooseHowSection /></div>
        <div data-guide="learn"><LearnSection /></div>
        <div data-guide="practice"><PracticeSection /></div>
        <div data-guide="progress"><ProgressSection /></div>
        <div data-guide="schools"><SchoolsSection /></div>
        <div data-guide="history"><LibrasHistorySection /></div>
        <div data-guide="accessibility"><AccessibilitySection /></div>
        <div data-guide="overview"><PlatformOverviewSection /></div>
        <Footer />
      </main>
      <InterpreterGuide />
    </>
  );
}
