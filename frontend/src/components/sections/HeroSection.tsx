import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagnifyingGlass, Sparkle } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onSectionChange: (section: string, query?: string) => void;
}

const HeroSection = ({ onSectionChange }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const search = searchRef.current;
    const spline = splineRef.current;

    if (!title || !subtitle || !search || !spline) return;

    // Initial states
    gsap.set([title, subtitle, search], { 
      opacity: 0, 
      y: 60, 
      filter: 'blur(10px)' 
    });
    gsap.set(spline, { 
      opacity: 0, 
      scale: 0.8 
    });

    // Entrance animation
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.to(spline, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'back.out(1.7)'
    })
    .to([title, subtitle, search], {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power2.out',
      stagger: 0.2
    }, '-=0.8');

    // Floating animation for background elements
    gsap.to('.hero-orb-1', {
      y: -30,
      x: 20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    gsap.to('.hero-orb-2', {
      y: 20,
      x: -15,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    gsap.to('.hero-orb-3', {
      y: -25,
      x: 10,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSectionChange('discovery', searchQuery);  // pass query
    }
  };


  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-scroll-section
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-orb-1 absolute top-1/4 left-1/6 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="hero-orb-2 absolute bottom-1/4 right-1/6 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="hero-orb-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>
      </div>

      {/* Spline 3D Background */}
      <div ref={splineRef} className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/orb-zJg06r7sdbhpkezjJHJCuKW7/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="opacity-60"
          title="3D Orb Animation"
        ></iframe>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl font-bold mb-6 text-gradient leading-tight"
          >
            API Genius
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            AI-Powered API Discovery & Integration Platform for Modern Developers
          </p>
        </div>

        {/* Search Interface */}
        <div ref={searchRef} className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="glass-card p-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 flex items-center space-x-3">
                <Sparkle className="text-primary" size={24} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe your API needs... e.g., 'I need a payment processing API'"
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-lg"
                />
              </div>
              <button
                type="submit"
                className="btn-neon flex items-center space-x-2 min-w-fit"
              >
                <MagnifyingGlass size={20} />
                <span className="hidden sm:inline">Discover APIs</span>
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              'Payment Processing',
              'Weather Data',
              'Social Media',
              'Machine Learning',
              'Authentication'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                }}
                className="btn-glass text-sm hover:neon-border-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;