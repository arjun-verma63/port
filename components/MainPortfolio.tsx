'use client';

import { useEffect } from 'react';
import Navbar from '@/components/nav/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ProjectGrid from '@/components/sections/ProjectGrid';
import SkillsModule from '@/components/sections/SkillsModule';
import ProjectDrawer from '@/components/drawers/ProjectDrawer';
import ContactModal from '@/components/contact/ContactModal';
import Footer from '@/components/sections/Footer';
import InteractiveBackground from '@/components/ui/InteractiveBackground';

export default function MainPortfolio() {

  useEffect(() => {
    // Refresh ScrollTrigger after all images are loaded
    const handleLoad = () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      <InteractiveBackground />
      <Navbar />
      <HeroSection />
      <ProjectGrid />
      <SkillsModule />
      <Footer />
      <ProjectDrawer />
      <ContactModal />
    </>
  );
}
