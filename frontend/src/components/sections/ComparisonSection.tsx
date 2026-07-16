import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ChartBar, 
  Clock, 
  CurrencyDollar, 
  Shield,
  Star,
  CheckCircle,
  X,
  TrendUp,
  Code,
  MagnifyingGlass,
  Sparkle,
  Gear,
  Target,
  ChartPie,
  Warning,
  SpinnerGap,
  Pencil,
  SignIn
} from 'phosphor-react';
import { apiFetchWithAuth, apiFetch } from '@/helpers/Helper';
import { useAuth } from '../../AuthContext';

gsap.registerPlugin(ScrollTrigger);

interface Api {
  id: string;
  name: string;
  category: string;
  description: string;
  homepage_url?: string;
  docs_url?: string;
  avg_ease_of_use?: number;
  avg_docs_quality?: number;
  avg_latency?: number;
  avg_cost_efficiency?: number;
  rating_count?: number;
}

interface Category {
  category: string;
  api_count: number;
}

interface ComparisonResult {
  query: string;
  generated_sql?: string;
  apis: Api[];
  comparison: string;
  total_apis_found: number;
  filters_applied?: {
    categories: string[];
    min_ease_of_use: number;
    min_docs_quality: number;
    limit: number;
  }
}

const ComparisonSection = () => {
  const { isLoggedIn, user } = useAuth();
  const [viewMode, setViewMode] = useState<'input' | 'results'>('input');
  const [comparisonMode, setComparisonMode] = useState<'basic' | 'advanced'>('advanced');
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  // Comparison State
  const [basicQuery, setBasicQuery] = useState('');
  const [advancedQuery, setAdvancedQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minEaseOfUse, setMinEaseOfUse] = useState(0);
  const [minDocsQuality, setMinDocsQuality] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const metrics = [
    { key: 'avg_ease_of_use', label: 'Ease of Use', icon: TrendUp, color: 'text-green-400', unit: '/5', max: 5 },
    { key: 'avg_latency', label: 'Performance', icon: Clock, color: 'text-blue-400', unit: '/5', max: 5 },
    { key: 'avg_docs_quality', label: 'Documentation', icon: Code, color: 'text-purple-400', unit: '/5', max: 5 },
    { key: 'avg_cost_efficiency', label: 'Cost Efficiency', icon: CurrencyDollar, color: 'text-yellow-400', unit: '/5', max: 5 },
    { key: 'rating_count', label: 'User Reviews', icon: Star, color: 'text-orange-400', unit: ' reviews', max: 100 }
  ];

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Animation effects
  useEffect(() => {
    const charts = chartsRef.current?.children;
    if (!charts) return;

    gsap.fromTo(
      charts,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, [viewMode, comparisonResult]);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await apiFetch('/ai/get-categories');
      setAvailableCategories(data.categories || []);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError(`Failed to load categories: ${err.message}`);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const runBasicComparison = async () => {
    if (!basicQuery.trim()) return;
    if (!isLoggedIn) {
      setError('Please log in to use the API comparison features.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setComparisonResult(null);
    
    try {
      console.log('Starting basic comparison with query:', basicQuery);
      console.log('User logged in:', isLoggedIn);
      console.log('Token available:', !!localStorage.getItem('access_token'));
      
      const data = await apiFetchWithAuth('/ai/compare-apis', {
        method: 'POST',
        body: JSON.stringify({ query: basicQuery })
      });
      
      console.log('Comparison result:', data);
      setComparisonResult(data);
      setViewMode('results');
    } catch (err: any) {
      console.error('Basic comparison error:', err);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(`Comparison failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const runAdvancedComparison = async () => {
    if (!advancedQuery.trim()) return;
    if (!isLoggedIn) {
      setError('Please log in to use the API comparison features.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setComparisonResult(null);
    
    try {
      console.log('Starting advanced comparison with query:', advancedQuery);
      console.log('User logged in:', isLoggedIn);
      console.log('Token available:', !!localStorage.getItem('access_token'));
      
      const payload = {
        query: advancedQuery,
        categories: selectedCategories,
        min_ease_of_use: parseFloat(minEaseOfUse.toString()),
        min_docs_quality: parseFloat(minDocsQuality.toString()),
        limit: parseInt(limit.toString())
      };
      
      console.log('Advanced comparison payload:', payload);
      
      const data = await apiFetchWithAuth('/ai/compare-apis-advanced', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      console.log('Advanced comparison result:', data);
      setComparisonResult(data);
      setViewMode('results');
    } catch (err: any) {
      console.error('Advanced comparison error:', err);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(`Advanced comparison failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatComparisonText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n(\d+\.\s)/g, '</p><p>$1')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  const getScoreColor = (score: number | undefined, max: number = 5) => {
    if (!score) return 'text-gray-400';
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBarWidth = (score: number | undefined, max: number = 5) => {
    if (!score) return '0%';
    return `${(score / max) * 100}%`;
  };

  const toggleCategorySelection = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const resetForm = () => {
    setBasicQuery('');
    setAdvancedQuery('');
    setSelectedCategories([]);
    setMinEaseOfUse(0);
    setMinDocsQuality(0);
    setLimit(10);
    setComparisonResult(null);
    setError(null);
    setViewMode('input');
  };

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="py-24 px-6 min-h-screen"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            AI-Powered API Comparison
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get intelligent API recommendations and comparisons based on your specific needs using AI analysis
          </p>
        </div>

        {viewMode === 'input' ? (
          /* Input Section */
          <div className="space-y-8">


            {comparisonMode === 'basic' ? (
              /* Basic Comparison */
              <div className="glass-card">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="text-primary" size={24} />
                  <h3 className="text-xl font-semibold">Quick API Comparison</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Describe your task and get AI-powered API recommendations with detailed comparisons.
                </p>
                
                <div className="space-y-4">
                  <textarea
                    value={basicQuery}
                    onChange={(e) => setBasicQuery(e.target.value)}
                    placeholder="Describe your task... e.g., 'I need to integrate payment processing for my e-commerce website'"
                    className="w-full p-4 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all resize-none"
                    rows={4}
                    disabled={!isLoggedIn}
                  />
                  
                  {!isLoggedIn && (
                    <div className="glass-card border-yellow-500/50 bg-yellow-500/10">
                      <div className="flex items-center space-x-3 text-yellow-400">
                        <SignIn size={20} />
                        <p className="text-sm">Please log in to use AI-powered API comparison features.</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={runBasicComparison}
                    disabled={!basicQuery.trim() || loading || !isLoggedIn}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      loading || !isLoggedIn
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-primary hover:scale-[1.01] glow-primary'
                    } text-primary-foreground`}
                  >
                    {loading ? (
                      <>
                        <SpinnerGap size={20} className="animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkle size={20} />
                        <span>{isLoggedIn ? 'Compare APIs' : 'Login Required'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Advanced Comparison */
              <div className="glass-card">
                <div className="flex items-center space-x-3 mb-6">
                  <Gear className="text-secondary" size={24} />
                  <h3 className="text-xl font-semibold">Advanced API Comparison</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Fine-tune your search with specific criteria and advanced filters.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Query and Categories */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Describe Your Requirements
                      </label>
                      <textarea
                        value={advancedQuery}
                        onChange={(e) => setAdvancedQuery(e.target.value)}
                        placeholder="Describe your requirements in detail..."
                        className="w-full p-4 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all resize-none"
                        rows={4}
                        disabled={!isLoggedIn}
                      />
                    </div>

                    {!isLoggedIn && (
                      <div className="glass-card border-yellow-500/50 bg-yellow-500/10">
                        <div className="flex items-center space-x-3 text-yellow-400">
                          <SignIn size={20} />
                          <p className="text-sm">Please log in to use advanced comparison features with custom filters.</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Categories (optional)
                      </label>
                      <div className="max-h-48 overflow-y-auto border border-border rounded-xl p-4 bg-input">
                        {categoriesLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <SpinnerGap size={20} className="animate-spin text-primary" />
                            <span className="ml-2 text-sm">Loading categories...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {availableCategories.map((category) => (
                              <label key={category.category} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(category.category)}
                                  onChange={() => toggleCategorySelection(category.category)}
                                  className="rounded border-border focus:ring-primary"
                                  disabled={!isLoggedIn}
                                />
                                <span className="text-sm">
                                  {category.category} ({category.api_count})
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Filters */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Minimum Ease of Use: {minEaseOfUse}/5
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minEaseOfUse}
                        onChange={(e) => setMinEaseOfUse(parseFloat(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Minimum Documentation Quality: {minDocsQuality}/5
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minDocsQuality}
                        onChange={(e) => setMinDocsQuality(parseFloat(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Maximum Results
                      </label>
                      <select
                        value={limit}
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                        className="w-full p-3 bg-input rounded-xl border border-border focus:border-primary outline-none"
                      >
                        <option value="5">5 APIs</option>
                        <option value="10">10 APIs</option>
                        <option value="15">15 APIs</option>
                        <option value="20">20 APIs</option>
                      </select>
                    </div>

                    <button
                      onClick={runAdvancedComparison}
                      disabled={!advancedQuery.trim() || loading || !isLoggedIn}
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                        loading || !isLoggedIn
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-secondary hover:scale-[1.01] glow-secondary'
                      } text-primary-foreground`}
                    >
                      {loading ? (
                        <>
                          <SpinnerGap size={20} className="animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <ChartPie size={20} />
                          <span>{isLoggedIn ? 'Advanced Compare' : 'Login Required'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Overview */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <ChartBar className="text-accent" size={24} />
                  <h3 className="text-xl font-semibold">Available API Categories</h3>
                </div>
                <button
                  onClick={loadCategories}
                  disabled={categoriesLoading}
                  className="btn-glass text-sm flex items-center space-x-2"
                >
                  {categoriesLoading ? (
                    <SpinnerGap size={16} className="animate-spin" />
                  ) : (
                    <MagnifyingGlass size={16} />
                  )}
                  <span>Refresh</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableCategories.map((category) => (
                  <div key={category.category} className="glass p-3 rounded-xl text-center">
                    <div className="font-medium text-sm">{category.category}</div>
                    <div className="text-xs text-muted-foreground">{category.api_count} APIs</div>
                  </div>
                ))}
                {availableCategories.length === 0 && !categoriesLoading && (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    No categories available. Click "Refresh" to load.
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="glass-card border-red-500/50 bg-red-500/10">
                <div className="flex items-center space-x-3 text-red-400">
                  <Warning size={24} />
                  <div>
                    <h3 className="font-semibold">Error</h3>
                    <p className="text-sm">{error}</p>
                    {error.includes('Authentication failed') && (
                      <div className="mt-2 text-xs">
                        <p>Debug Info:</p>
                        <ul className="list-disc list-inside ml-2">
                          <li>Logged in: {isLoggedIn ? 'Yes' : 'No'}</li>
                          <li>Token available: {localStorage.getItem('access_token') ? 'Yes' : 'No'}</li>
                          <li>User: {user ? user.username || 'Unknown' : 'None'}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results Section */
          <div ref={chartsRef} className="space-y-8">
            {/* Back Button and Query Info */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={resetForm}
                className="btn-glass flex items-center space-x-2"
              >
                <Pencil size={18} />
                <span>New Comparison</span>
              </button>
              
              {comparisonResult && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Found {comparisonResult.total_apis_found} APIs
                  </p>
                  {comparisonResult.filters_applied && (
                    <p className="text-xs text-muted-foreground">
                      Filters applied
                    </p>
                  )}
                  {user && (
                    <p className="text-xs text-muted-foreground">
                      Analysis by {user.username}
                    </p>
                  )}
                </div>
              )}
            </div>

            {comparisonResult && (
              <>
                {/* Query Display */}
                <div className="glass-card bg-primary/5 border-primary/20">
                  <h3 className="font-semibold text-lg mb-2">Your Query</h3>
                  <p className="text-muted-foreground italic">"{comparisonResult.query}"</p>
                </div>

                {/* AI Analysis */}
                {comparisonResult.comparison && (
                  <div className="glass-card bg-blue-500/5 border-blue-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <Sparkle className="text-blue-400" size={24} />
                      <h3 className="text-xl font-semibold">AI Analysis</h3>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ 
                        __html: formatComparisonText(comparisonResult.comparison) 
                      }}
                    />
                  </div>
                )}

                {/* API Results */}
                {comparisonResult.apis.length > 0 && (
                  <>
                    {/* Visual Metrics Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {metrics.map((metric) => {
                        const Icon = metric.icon;
                        return (
                          <div key={metric.key} className="glass-card">
                            <div className="flex items-center space-x-3 mb-6">
                              <Icon className={metric.color} size={24} />
                              <h3 className="text-lg font-semibold">{metric.label}</h3>
                            </div>

                            <div className="space-y-4">
                              {comparisonResult.apis.map((api, index) => {
                                const value = api[metric.key as keyof Api] as number;
                                const displayValue = metric.key === 'rating_count' 
                                  ? String(value ?? 0)
                                  : Number(value ?? 0).toFixed(1);                                
                                return (
                                  <div key={api.id}>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                                          #{index + 1}
                                        </span>
                                        <span className="font-medium text-sm">{api.name}</span>
                                      </div>
                                      <span className={`font-semibold text-sm ${getScoreColor(value, metric.max)}`}>
                                        {displayValue}{metric.unit}
                                      </span>
                                    </div>
                                    <div className="w-full bg-muted/30 rounded-full h-2">
                                      <div
                                        className="h-full rounded-full transition-all duration-1000 bg-gradient-primary"
                                        style={{ width: getScoreBarWidth(value, metric.max) }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed API Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {comparisonResult.apis.map((api, index) => (
                        <div key={api.id} className="glass-card border-2 border-border hover:border-primary/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                                <span className="text-primary-foreground font-bold">
                                  #{index + 1}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-lg">{api.name}</h4>
                                <p className="text-sm text-muted-foreground">{api.category}</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {api.description || 'No description available'}
                          </p>

                          {/* Ratings Display */}
                          {(api.rating_count && api.rating_count > 0) ? (
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {api.avg_ease_of_use && (
                                <div className="flex items-center space-x-1">
                                  <TrendUp size={14} className="text-green-400" />
                                  <span>Ease: {api.avg_ease_of_use != null ? Number(api.avg_ease_of_use).toFixed(1) : 'N/A'}/5</span>
                                </div>
                              )}
                              {api.avg_docs_quality && (
                                <div className="flex items-center space-x-1">
                                  <Code size={14} className="text-purple-400" />
                                  <span>Docs: {api.avg_docs_quality != null ? Number(api.avg_docs_quality).toFixed(1) : 'N/A'}/5</span>
                                </div>
                              )}
                              {api.avg_cost_efficiency && (
                                <div className="flex items-center space-x-1">
                                  <CurrencyDollar size={14} className="text-yellow-400" />
                                  <span>Cost: {api.avg_cost_efficiency != null ? Number(api.avg_cost_efficiency).toFixed(1) : 'N/A'}/5</span>
                                </div>
                              )}
                              {api.avg_latency && (
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} className="text-blue-400" />
                                  <span>Latency: {api.avg_latency != null ? Number(api.avg_latency).toFixed(1) : 'N/A'}/5</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">No user ratings available</p>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-4 flex space-x-2">
                            {api.homepage_url && (
                              <a
                                href={api.homepage_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-glass text-xs px-3 py-1.5"
                              >
                                Visit
                              </a>
                            )}
                            {api.docs_url && (
                              <a
                                href={api.docs_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-glass text-xs px-3 py-1.5"
                              >
                                Docs
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Generated SQL Debug (Collapsible) */}
                    {comparisonResult.generated_sql && (
                      <details className="glass-card">
                        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground transition-colors">
                          Show Generated SQL Query (Debug)
                        </summary>
                        <pre className="mt-4 bg-card/50 p-4 rounded-xl text-xs overflow-auto font-mono text-muted-foreground">
                          <code>{comparisonResult.generated_sql}</code>
                        </pre>
                      </details>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ComparisonSection;