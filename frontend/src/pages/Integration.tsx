import IntegrationSection from '@/components/sections/IntegrationSection';

interface IntegrationProps {
  onSectionChange: (section: string) => void;
}

const Integration = ({ onSectionChange }: IntegrationProps) => {
  return (
    <div className="pt-24">
      <IntegrationSection onSectionChange={onSectionChange} />
    </div>
  );
};

export default Integration;