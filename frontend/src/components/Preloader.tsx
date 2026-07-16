import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    const logo = logoRef.current;
    const text = textRef.current;

    if (!container || !progress || !logo || !text) return;

    // Initial states
    gsap.set([logo, text], { opacity: 0, scale: 0.8 });
    gsap.set(progress, { width: '0%' });

    // Entrance animation
    const tl = gsap.timeline();
    
    tl.to([logo, text], {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.2
    })
    .to(progress, {
      width: '100%',
      duration: 2.5,
      ease: 'power2.out',
    }, '-=0.3')
    .to([logo, text], {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.5')
    .to(container, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        container.style.display = 'none';
        onComplete();
      }
    }, '+=0.3');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl float animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/20 rounded-full blur-2xl float animation-delay-400"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center glow-primary">
            <div className="w-12 h-12 bg-foreground rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary shimmer"></div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef}>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            API Genius
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-Powered API Discovery & Integration
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 w-80 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-primary rounded-full glow-primary"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;