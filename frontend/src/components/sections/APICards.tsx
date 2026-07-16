import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MagnifyingGlass, 
  Star, 
  Clock, 
  CurrencyDollar, 
  ShieldCheck, 
  Code, 
  Heart, 
  CaretLeft,
  CaretRight
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

// --- INTERFACES ---
export interface Api {
  id: string;
  name: string;
  category: string;
  description: string;
  homepage_url: string;
  docs_url: string;
  avg_ease_of_use: number | null;
  avg_docs_quality: number | null;
  avg_latency: number | null;
  rating_count: number;
}

interface APICardsProps {
    apis: Api[];
    loading: boolean;
    loadingMessage: string;
    error: string | null;
    selectedAPIs: string[];
    page: number;
    totalApis: number;
    perPage: number;
    isLoggedIn: boolean;
    apiToRate: Api | null;
    isRatingModalOpen: boolean;
    isSubmittingRating: boolean;
    onPageChange: (page: number) => void;
    onToggleAPISelection: (apiId: string) => void;
    onSectionChange: (section: string) => void;
    onOpenRatingModal: (api: Api, e: React.MouseEvent) => void;
    onCloseRatingModal: () => void;
    onRatingSubmit: (ratings: Record<string, number>) => void;
}


// --- HELPER COMPONENTS ---

// Helper component for star ratings
const StarRating = ({ count, rating, onRatingChange }: { count: number, rating: number, onRatingChange: (newRating: number) => void }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Star
            key={index}
            size={24}
            className="cursor-pointer transition-colors"
            weight="fill"
            color={ratingValue <= (hoverRating || rating) ? '#facc15' /* yellow-400 */ : '#404040' /* neutral-700 */}
            onMouseEnter={() => setHoverRating(ratingValue)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(ratingValue)}
          />
        );
      })}
    </div>
  );
};


// Rating Modal Component
const RatingModal = ({ api, isOpen, onClose, onSubmit, isSubmitting }: { api: Api, isOpen: boolean, onClose: () => void, onSubmit: (ratings: any) => void, isSubmitting: boolean }) => {
  if (!isOpen) return null;

  const [ratings, setRatings] = useState({
    ease_of_use: 0,
    docs_quality: 0,
    cost_efficiency: 0,
    latency_score: 0, // Backend expects 'latency_score' for rating submission
  });

  const handleRatingChange = (metric: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [metric]: value }));
  };

  const ratingMetrics = [
    { key: 'ease_of_use' as const, label: 'Ease of Use' },
    { key: 'docs_quality' as const, label: 'Documentation Quality' },
    { key: 'cost_efficiency' as const, label: 'Cost Efficiency' },
    { key: 'latency_score' as const, label: 'Performance / Latency' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="glass-card w-full max-w-lg p-8 rounded-2xl neon-border-primary" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-center mb-2">Rate "{api.name}"</h3>
        <p className="text-muted-foreground text-center mb-6">Your feedback helps everyone find better APIs.</p>
        
        <div className="space-y-4">
          {ratingMetrics.map(metric => (
            <div key={metric.key} className="flex justify-between items-center">
              <span className="text-lg">{metric.label}</span>
              <StarRating
                count={5}
                rating={ratings[metric.key]}
                onRatingChange={(value) => handleRatingChange(metric.key, value)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 btn-glass">Cancel</button>
          <button 
            onClick={() => onSubmit(ratings)} 
            disabled={isSubmitting}
            className="flex-1 btn-neon disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

const formatNumber = (value: number | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined || typeof value !== 'number') {
    return 'N/A';
  }
  return value.toFixed(decimals);
};

const getDifficultyColor = (easeOfUse: number | null) => {
    if (easeOfUse === null) return 'text-muted-foreground';
    if (easeOfUse >= 4.5) return 'text-green-400';
    if (easeOfUse >= 3.5) return 'text-blue-400';
    if (easeOfUse >= 2.5) return 'text-yellow-400';
    return 'text-red-400';
};

const Metric = ({ icon, value, label, color = 'text-accent' }: { icon: React.ReactNode, value: string, label: string, color?: string }) => (
    <div className="text-center">
        <div className={`flex items-center justify-center space-x-1 ${color}`}>
            {icon}
            <span className="text-sm font-medium">{value}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
);


// --- CARDS COMPONENT ---
const APICards = ({
    apis, loading, loadingMessage, error, selectedAPIs, page, totalApis, perPage, isLoggedIn, apiToRate, isRatingModalOpen, isSubmittingRating,
    onPageChange, onToggleAPISelection, onSectionChange, onOpenRatingModal, onCloseRatingModal, onRatingSubmit
}: APICardsProps) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const animationContextRef = useRef<gsap.Context | null>(null);
  const totalPages = Math.ceil(totalApis / perPage);

  // --- Animation Effect ---
  useEffect(() => {
    if (animationContextRef.current) {
      animationContextRef.current.revert();
    }
    if (loading || error || apis.length === 0) return;

    const timeoutId = setTimeout(() => {
      const cardsContainer = cardsRef.current;
      if (!cardsContainer) return;
      const cards = Array.from(cardsContainer.children);
      if (cards.length === 0) return;

      animationContextRef.current = gsap.context(() => {
        gsap.set(cards, { opacity: 0, y: 30, scale: 0.98 });
        gsap.to(cards, {
          opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.1,
          scrollTrigger: {
            trigger: cardsContainer, start: 'top 85%', end: 'bottom 15%', toggleActions: 'play none none none', once: true
          }
        });
      }, cardsContainer);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [apis, loading, error]);

  useEffect(() => {
    return () => {
      if (animationContextRef.current) {
        animationContextRef.current.revert();
      }
    };
  }, []);

  return (
    <>
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: loading ? '400px' : 'auto' }}>
          {loading ? (
            <div className="lg:col-span-2 text-center py-20">
              <div className="w-16 h-16 mx-auto border-4 border-muted border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
            </div>
          ) : error ? (
            <div className="lg:col-span-2 text-center py-20 bg-red-500/10 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-red-400">An Error Occurred</h3>
              <pre className="text-red-300 text-left p-4 bg-black/20 rounded-md overflow-x-auto"><code>{error}</code></pre>
            </div>
          ) : apis.length > 0 ? (
            apis.map((api) => (
              <div
                key={api.id}
                className={`glass-card transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col ${
                  selectedAPIs.includes(api.id) ? 'neon-border-primary glow-primary' : ''
                }`}
                onClick={() => onToggleAPISelection(api.id)}
                style={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{api.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400" size={16} weight="fill" />
                        <span className="text-sm text-muted-foreground">{api.rating_count} reviews</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{api.description}</p>
                  </div>
                   <button
                    onClick={(e) => { e.stopPropagation(); onToggleAPISelection(api.id); }}
                    className={`p-2 rounded-xl transition-all ${selectedAPIs.includes(api.id) ? 'text-red-400 hover:text-red-300' : 'text-muted-foreground hover:text-primary'}`}
                   >
                    <Heart size={20} weight={selectedAPIs.includes(api.id) ? 'fill' : 'regular'} />
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 border-t border-border/20 pt-4">
                    <Metric icon={<Clock size={16} />} value={api.avg_latency ? `${Math.round(api.avg_latency)}ms` : 'N/A'} label="Latency" />
                    <Metric icon={<ShieldCheck size={16} />} value={`${formatNumber(api.avg_docs_quality)}/5`} label="Docs" />
                    <Metric icon={<Code size={16} />} value={api.avg_ease_of_use && typeof api.avg_ease_of_use === 'number' ? `${formatNumber(api.avg_ease_of_use)}/5` : 'N/A'} label="Ease of Use" color={getDifficultyColor(api.avg_ease_of_use)} />
                    <Metric icon={<CurrencyDollar size={16} />} value="Varies" label="Pricing" />
                </div>
                <div className="flex gap-2 mt-auto">
                  <button onClick={(e) => { e.stopPropagation(); onSectionChange('integration'); }} className="flex-1 btn-neon text-sm py-2">Generate Code</button>
                  <a href={api.docs_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 btn-glass text-sm py-2 text-center">View Docs</a>
                  
                  {isLoggedIn && (
                  <button 
                    onClick={(e) => onOpenRatingModal(api, e)} 
                    className="btn-glass text-sm py-2 px-3 flex items-center space-x-2" 
                    title="Rate this API"
                  >
                    <Star size={16} />
                    <span>Rate</span>
                  </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2 text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                <MagnifyingGlass size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No APIs found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page === 1} onClick={() => onPageChange(page - 1)}
              className="btn-glass flex items-center gap-2 disabled:opacity-50"
            >
              <CaretLeft size={18} /> Prev
            </button>
            <span className="text-lg font-medium text-foreground">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages} onClick={() => onPageChange(page + 1)}
              className="btn-glass flex items-center gap-2 disabled:opacity-50"
            >
              Next <CaretRight size={18} />
            </button>
          </div>
        )}
        {/* --- RATING MODAL RENDER --- */}
        {apiToRate && (
            <RatingModal
            api={apiToRate}
            isOpen={isRatingModalOpen}
            onClose={onCloseRatingModal}
            onSubmit={onRatingSubmit}
            isSubmitting={isSubmittingRating}
            />
        )}
    </>
  );
};

export default APICards;
