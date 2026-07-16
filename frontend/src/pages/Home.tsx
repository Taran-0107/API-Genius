import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';

interface HomeProps {
  onSectionChange: (section: string) => void;
}

const Home = ({ onSectionChange }: HomeProps) => {
  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-secondary/5 via-transparent to-transparent"></div>
      </div>

      <HeroSection onSectionChange={onSectionChange} />
      <FeaturesSection onSectionChange={onSectionChange} />
    </div>
  );
};

export default Home;