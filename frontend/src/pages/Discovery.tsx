import APIDiscoverySection from '@/components/sections/APIDiscoverySection';

interface DiscoveryProps {
  onSectionChange: (section: string) => void;
}

import { useLocation } from "react-router-dom";

const Discovery = ({ onSectionChange }) => {
  const location = useLocation();
  const query = location.state?.query || "";
  const discover = location.state?.discover || false;

  return (
    <APIDiscoverySection
      onSectionChange={onSectionChange}
      onSelectionChange={(ids) => console.log(ids)}
      initialQuery={query}
      initialDiscover={discover}
    />
  );
};


export default Discovery;