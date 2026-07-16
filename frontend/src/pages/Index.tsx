import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Preloader from '@/components/Preloader';
import ScrollManager from '@/components/ScrollManager';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import APIDiscoverySection from '@/components/sections/APIDiscoverySection';
import IntegrationSection from '@/components/sections/IntegrationSection';
import CommunitySection from '@/components/sections/CommunitySection';
import KeyManagerSection from '@/components/sections/KeyManagerSection';
import ComparisonSection from '@/components/sections/ComparisonSection';
import FooterSection from '@/components/sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Disable scroll during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="relative bg-background text-foreground">
      
      <ScrollManager>
        <main className="relative">
          {/* Background Elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/5 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-secondary/5 via-transparent to-transparent"></div>
          </div>

          {/* Sections */}
          <HeroSection onSectionChange={handleSectionChange} />
          <FeaturesSection onSectionChange={handleSectionChange} />
          <APIDiscoverySection onSectionChange={handleSectionChange} />
          <IntegrationSection onSectionChange={handleSectionChange} />
          <CommunitySection />
          <KeyManagerSection />
          <ComparisonSection />
          <FooterSection />
        </main>
      </ScrollManager>
    </div>
  );
};

export default Index;
