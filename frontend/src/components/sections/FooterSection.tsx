import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  GithubLogo, 
  LinkedinLogo, 
  TwitterLogo,
  PaperPlaneTilt,
  Code,
  Heart
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        {
          opacity: 0,
          y: 60
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Floating particles animation
    const particles = document.querySelectorAll('.footer-particle');
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: -30,
        x: Math.sin(index) * 20,
        duration: 4 + index,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.5
      });
    });
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative py-24 px-6 bg-card/50 border-t border-border overflow-hidden"
      data-scroll-section
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="footer-particle absolute top-1/4 left-1/6 w-2 h-2 bg-primary/30 rounded-full blur-sm"></div>
        <div className="footer-particle absolute top-1/2 left-1/3 w-3 h-3 bg-secondary/20 rounded-full blur-sm"></div>
        <div className="footer-particle absolute bottom-1/3 right-1/4 w-2 h-2 bg-accent/30 rounded-full blur-sm"></div>
        <div className="footer-particle absolute top-3/4 right-1/6 w-4 h-4 bg-primary/20 rounded-full blur-sm"></div>
        <div className="footer-particle absolute bottom-1/4 left-1/2 w-2 h-2 bg-secondary/30 rounded-full blur-sm"></div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center glow-primary">
                <div className="w-6 h-6 bg-foreground rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-primary shimmer"></div>
                </div>
              </div>
              <span className="text-2xl font-bold text-gradient">API Genius</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              The ultimate AI-powered platform for API discovery, integration, and management. 
              Built by developers, for developers.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl hover:glow-primary transition-all"
              >
                <GithubLogo size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl hover:glow-primary transition-all"
              >
                <LinkedinLogo size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl hover:glow-primary transition-all"
              >
                <TwitterLogo size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Platform</h3>
            <ul className="space-y-3">
              <li>
                <a href="#discovery" className="text-muted-foreground hover:text-primary transition-colors">
                  API Discovery
                </a>
              </li>
              <li>
                <a href="#integration" className="text-muted-foreground hover:text-primary transition-colors">
                  Code Integration
                </a>
              </li>
              <li>
                <a href="#community" className="text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#comparison" className="text-muted-foreground hover:text-primary transition-colors">
                  API Comparison
                </a>
              </li>
              <li>
                <a href="#keys" className="text-muted-foreground hover:text-primary transition-colors">
                  Key Manager
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Best Practices
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="glass-card mb-12 text-center">
          <h3 className="text-xl font-semibold mb-2 text-gradient">Stay Updated</h3>
          <p className="text-muted-foreground mb-6">
            Get the latest API updates, tutorials, and community highlights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@example.com"
              className="flex-1 px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all"
            />
            <button
              type="submit"
              className="btn-neon flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <PaperPlaneTilt size={18} />
              <span>Subscribe</span>
            </button>
          </form>
        </div>

        {/* Future Features Teaser */}
        <div className="glass-card mb-12">
          <h3 className="text-lg font-semibold mb-6 text-center text-gradient">
            Coming Soon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Code, title: 'CI/CD Integration', desc: 'Automated API testing in your pipeline' },
              { icon: Code, title: 'SDK Generator', desc: 'Auto-generate SDKs for any API' },
              { icon: Code, title: 'Debug Assistant', desc: 'AI-powered API debugging' },
              { icon: Code, title: 'Plugin Marketplace', desc: 'Extend functionality with plugins' }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                  <Icon className="mx-auto mb-2 text-primary" size={24} />
                  <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 md:mb-0">
            <span>© 2024 API Genius. Made with</span>
            <Heart className="text-red-400" size={16} weight="fill" />
            <span>for developers</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;