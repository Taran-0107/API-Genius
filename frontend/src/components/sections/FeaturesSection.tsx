import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MagnifyingGlass, 
  Code, 
  Users, 
  Key, 
  ChartBar, 
  Lightning,
  Shield,
  Rocket
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

interface FeaturesSectionProps {
  onSectionChange: (section: string) => void;
}

const FeaturesSection = ({ onSectionChange }: FeaturesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      id: 'discovery',
      icon: MagnifyingGlass,
      title: 'AI-Powered Discovery',
      description: 'Find the perfect APIs using natural language. Our AI understands your requirements and suggests the best matches.',
      color: 'primary'
    },
    {
      id: 'integration',
      icon: Code,
      title: 'Instant Integration',
      description: 'Generate production-ready code in multiple languages. Copy, test, and deploy with confidence.',
      color: 'secondary'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Developer Community',
      description: 'Connect with other developers, share experiences, and get help with API integrations.',
      color: 'accent'
    },
    {
      id: 'keys',
      icon: Key,
      title: 'Secure Key Management',
      description: 'Safely store and manage your API keys with enterprise-grade encryption and security.',
      color: 'primary'
    },
    {
      id: 'comparison',
      icon: ChartBar,
      title: 'Smart Comparison',
      description: 'Compare APIs side-by-side with detailed metrics, pricing, and performance data.',
      color: 'secondary'
    },
    {
      id: 'monitoring',
      icon: Lightning,
      title: 'Real-time Monitoring',
      description: 'Track API performance, uptime, and usage with detailed analytics and alerts.',
      color: 'accent'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security First',
      description: 'Built-in security scanning and best practices to keep your integrations safe.',
      color: 'primary'
    },
    {
      id: 'deployment',
      icon: Rocket,
      title: 'One-Click Deploy',
      description: 'Deploy your API integrations to popular platforms with a single click.',
      color: 'secondary'
    }
  ];

  useEffect(() => {
    const cards = cardsRef.current?.children;
    if (!cards) return;

    // Animate cards on scroll
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-primary group-hover:glow-primary';
      case 'secondary':
        return 'text-secondary group-hover:glow-secondary';
      case 'accent':
        return 'text-accent group-hover:glow-accent';
      default:
        return 'text-primary group-hover:glow-primary';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-32 px-6"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to discover, integrate, and manage APIs in one beautiful platform
          </p>
        </div>

        {/* Features Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isClickable = ['discovery', 'integration', 'community', 'keys', 'comparison'].includes(feature.id);
            
            return (
              <div
                key={feature.id}
                className={`
                  group glass-card h-full transition-all duration-500 hover:scale-105
                  ${isClickable ? 'cursor-pointer hover:neon-border-primary' : ''}
                `}
                onClick={() => isClickable && onSectionChange(feature.id)}
              >
                <div className="mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-glow flex items-center justify-center ${getColorClasses(feature.color)}`}>
                    <Icon size={28} />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-glow">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {isClickable && (
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-primary font-medium">
                      Explore →
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="glass-card max-w-2xl mx-auto p-8">
            <h3 className="text-2xl font-bold mb-4 text-gradient">
              Ready to revolutionize your API workflow?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of developers who are already building faster with API Genius.
            </p>
            <button
              onClick={() => onSectionChange('discovery')}
              className="btn-neon text-lg px-8 py-4"
            >
              Start Discovering APIs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;