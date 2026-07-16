import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { apiFetch, apiFetchWithAuth } from '@/helpers/Helper'; // Adjust the import path as necessary
import { 
  MagnifyingGlass, 
  ChartBar, 
  CloudArrowDown,
} from 'phosphor-react';
import { useAuth } from '@/AuthContext'; // Adjust the import path as necessary
import APICards from './APICards'; // Import the new component
import type { Api } from './APICards'; // Import the Api type

gsap.registerPlugin(ScrollTrigger);

// --- INTERFACES ---
interface APIDiscoverySectionProps {
  onSectionChange: (section: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  initialQuery?: string;
  initialDiscover?: boolean;
}

// --- MAIN COMPONENT ---
const APIDiscoverySection = ({ onSectionChange, onSelectionChange, initialDiscover, initialQuery }: APIDiscoverySectionProps) => {

  const [dbSearchQuery, setDbSearchQuery] = useState(initialQuery || '');
  const [localSearchQuery, setLocalSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAPIs, setSelectedAPIs] = useState<string[]>([]);
  
  const [allApis, setAllApis] = useState<Api[]>([]); // Master list of APIs from DB
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);

  // --- Rating Modal State ---
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [apiToRate, setApiToRate] = useState<Api | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const [discoverymode, setDiscoveryMode] = useState(initialDiscover || false);

  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { isLoggedIn } = useAuth(); // Use the auth context to get user info

  const categories = ['all', 'payment', 'weather', 'social', 'ai', 'data', 'finance'];

  // --- Data Fetching Logic ---
  // --- Data Fetching Logic ---
    const fetchApisFromDb = useCallback(async (discover = false, query: string) => {
      if (discover){
        setDiscoveryMode(true);
      }
      setLoading(true);
      setError(null);
      setPage(1); // Reset page on new search
      setLoadingMessage(discover ? `Discovering new APIs for "${query}"...` : `Searching for "${query}"...`);

      try {
        let data;
        // If discovering, we first call the discover endpoint, and then immediately
        // fetch from our DB to get the newly added APIs.
        if (discover) {
          await apiFetch('/apis/discover', {
            method: 'POST',
            body: JSON.stringify({ search: query }),
          });
        }

        // This part runs for both "Search DB" and after a "Discover New" completes.
        const endpoint = `/apis/fromdb?search=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}&fetch_all=true`;
        data = await apiFetch(endpoint);
        setAllApis(data.apis || []);

      } catch (err: any) {
        console.error("Search Error:", err);
        setError(err.message);
        setAllApis([]);
      } finally {
        setLoading(false);
        setDiscoveryMode(false);
      }
    }, [selectedCategory]); // Note: dbSearchQuery is no longer needed as a dependency

  // --- Initial data fetch ---
  useEffect(() => {
    if (initialQuery){
      fetchApisFromDb(initialDiscover, initialQuery || '');
    }
    else {
      fetchApisFromDb(false, '');
    }

  }, []); // Runs only once on mount


  // --- Frontend Filtering and Pagination ---
  const filteredApis = useMemo(() => {
    return allApis.filter(api => {
      const queryMatch = localSearchQuery.trim() === '' || 
                         api.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(localSearchQuery.toLowerCase());
      const categoryMatch = selectedCategory === 'all' || api.category === selectedCategory;
      return queryMatch && categoryMatch;
    });
  }, [allApis, localSearchQuery, selectedCategory]);

  const paginatedApis = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    return filteredApis.slice(startIndex, startIndex + perPage);
  }, [filteredApis, page, perPage]);


  // --- Rating Logic Handlers ---
  const handleOpenRatingModal = (api: Api, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from being selected
    setApiToRate(api);
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
    setApiToRate(null);
  };

  const handleRatingSubmit = async (ratings: Record<string, number>) => {
    if (!apiToRate) return;
    setIsSubmittingRating(true);
    try {
      await apiFetchWithAuth('/apis/rate', {
        method: 'POST',
        body: JSON.stringify({
          api_id: apiToRate.id,
          ...ratings
        }),
      });
      handleCloseRatingModal();
      // Refetch APIs to show the updated average ratings immediately
      fetchApisFromDb(false, dbSearchQuery); 
    } catch (err: any) {
      console.error("Rating submission error:", err);
      // You could display this error in the modal itself
      alert(`Error submitting rating: ${err.message}`);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page on category change
  };

  const handleDbSearch = (discover = false) => {
        // This sets the state for the next render
        setDbSearchQuery(localSearchQuery);
        // But we pass the current value directly to the function to avoid stale state
        fetchApisFromDb(discover, localSearchQuery);
    }

  // --- UI Logic ---
  const toggleAPISelection = (apiId: string) => {
    const newSelection = selectedAPIs.includes(apiId)
      ? selectedAPIs.filter(id => id !== apiId)
      : [...selectedAPIs, apiId];
      
    if (newSelection.length > 3) return;

    setSelectedAPIs(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <section ref={sectionRef} id="discovery" className="py-24 px-6 min-h-screen" data-scroll-section>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">Discover Perfect APIs</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered search to find the exact APIs you need for your project.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8 sticky top-4 z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text" value={localSearchQuery} onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDbSearch(false)}
                placeholder="Search by name, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleDbSearch(false)} className="btn-glass flex items-center space-x-2">
                <MagnifyingGlass size={20} /><span>Search DB</span>
              </button>
              <button onClick={() => handleDbSearch(true)} className="btn-neon flex items-center space-x-2">
                <CloudArrowDown size={20} /><span>Discover New</span>
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center mt-4">
            {categories.map((category) => (
              <button
                key={category} onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-xl transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-primary text-primary-foreground glow-primary'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >{category}</button>
            ))}
          </div>
          {selectedAPIs.length > 1 && (
            <div className="mt-4 flex justify-center">
              <button onClick={() => onSectionChange('comparison')} className="btn-neon flex items-center space-x-2">
                <ChartBar size={20} /><span>Compare Selected APIs ({selectedAPIs.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Display */}
        <APICards
            apis={paginatedApis}
            loading={loading}
            loadingMessage={loadingMessage}
            error={error}
            selectedAPIs={selectedAPIs}
            page={page}
            totalApis={filteredApis.length} // Total is based on the filtered list
            perPage={perPage}
            isLoggedIn={isLoggedIn}
            apiToRate={apiToRate}
            isRatingModalOpen={isRatingModalOpen}
            isSubmittingRating={isSubmittingRating}
            onPageChange={setPage}
            onToggleAPISelection={toggleAPISelection}
            onSectionChange={onSectionChange}
            onOpenRatingModal={handleOpenRatingModal}
            onCloseRatingModal={handleCloseRatingModal}
            onRatingSubmit={handleRatingSubmit}
        />
      </div>
    </section>
  );
};

export default APIDiscoverySection;
