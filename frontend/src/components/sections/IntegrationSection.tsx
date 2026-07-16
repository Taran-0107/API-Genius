import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {apiFetch,apiFetchWithAuth} from '@/helpers/Helper'; // Adjust the import path as necessary
import { 
  Code, 
  Copy, 
  Download, 
  Play, 
  Key,
  CheckCircle,
  Pencil,
  Warning,
  SpinnerGap,
  Globe
} from 'phosphor-react';
import { Sparkle,Search } from 'lucide-react';


gsap.registerPlugin(ScrollTrigger);

interface Api {
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


interface IntegrationSectionProps {
  onSectionChange: (section: string) => void;

}

const IntegrationSection = ({ onSectionChange}: IntegrationSectionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedAPI, setSelectedAPI] = useState('stripe');
  const [code,setcode] = useState('Code will be generated here');
  const [generating, setGenerating] = useState(false);
  const [ApiQueryValue, setApiQueryValue] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyManager, setShowKeyManager] = useState(false);
  const [apis, setApis] = useState<Api[]>([]);
  const [PromptValue,setPromptValue]=useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);


  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟡' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'php', name: 'PHP', icon: '🐘' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'csharp', name: 'C#', icon: '🔷' },
    { id: 'ruby', name: 'Ruby', icon: '💎' }
  ];


  useEffect(() => {
    if (codeRef.current) {
      gsap.fromTo(
        codeRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, [selectedLanguage, selectedAPI]);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await apiFetch(`/apis/fromdb?fetch_all=true`);
        setApis(response.apis || []);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      } finally {
        setGenerating(false);
      } 

    };

    fetchApis();

  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    // Show toast notification
  };

  const getAPIStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'deprecated':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAPIStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'deprecated':
        return <Warning size={16} />;
      default:
        return null;
    }
  };

  const handleGenerateClick = async () => {
    setGenerating(true);
    setcode('Generating code...');
    // Simulate a network request. In a real app, this would be an API call.
    const gencode=await apiFetchWithAuth(`/ai/generate-code`, {
      method: 'POST',
      body: JSON.stringify({

        api_id: selectedAPI,
        language: selectedLanguage,
        description:PromptValue
      
      })

    });
    setcode(gencode.code || 'Code generation failed');
    setGenerating(false);
  };

  // Convert the search query to lowercase for a case-insensitive search
  const filteredApis = apis.filter(api =>
    api.name.toLowerCase().includes(ApiQueryValue.toLowerCase()) ||
    api.description.toLowerCase().includes(ApiQueryValue.toLowerCase())
  );

  return (
    <section
      ref={sectionRef}
      id="integration"
      className="py-24 px-6 min-h-screen"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            Code Integration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate production-ready code in your preferred language with secure API key injection
          </p>
        </div>

        {/* Full-width Prompt Card - Outside of the grid */}
        <div className="glass-card mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Pencil size={20} />
            <span>Prompt</span>
          </h3>
          <div className="space-y-3">
            <textarea
              placeholder="Enter your Prompt..."
              className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all resize-none"
              value={PromptValue}
              onChange={(e) => setPromptValue(e.target.value)}
            />
          </div>
          <button
            onClick={handleGenerateClick}
            className={`
              btn-glass text-sm flex items-center justify-center space-x-2 mt-4 w-full py-3 transition-all
              ${generating ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-primary hover:scale-[1.01]'}
            `}
            disabled={generating}
          >
            {generating ? (
              <>
                <SpinnerGap size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkle size={16} />
                <span>Generate Code</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* API Selection */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Code className="text-primary" size={20} />
                <span>Select API</span>
              </h3>
              <div className="relative flex items-center w-full my-3">
                <Search className="absolute left-3 text-muted-foreground" size={20} />
                <input
                  placeholder="Search APIs..."
                  className="w-full pl-10 pr-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all"
                  value={ApiQueryValue}
                  onChange={(e) => setApiQueryValue(e.target.value)}
                />
              </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {/* Filtering Logic */}
                  {filteredApis.length > 0 ? (
                    filteredApis.map((api) => (
                      <button
                        key={api.id}
                        onClick={() => setSelectedAPI(api.id)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-xl transition-all
                          ${selectedAPI === api.id
                            ? 'bg-gradient-primary text-primary-foreground glow-primary'
                            : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                          }
                        `}
                      >
                        <span className="font-medium">{api.name}</span>
                        <div className={`flex items-center space-x-1`}>
                          {/* API status icon and text would go here */}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No APIs found.
                    </div>
                  )}
                </div>
            </div>
            {/* Language Selection */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Globe className="text-secondary" size={20} />
                <span>Language</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`
                      flex items-center space-x-2 p-3 rounded-xl transition-all
                      ${selectedLanguage === lang.id
                        ? 'bg-gradient-secondary text-secondary-foreground glow-secondary'
                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    <span>{lang.icon}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>


          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="glass-card h-full">
              {/* Code Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {apis.find(api => api.id === selectedAPI)?.name} - {languages.find(lang => lang.id === selectedLanguage)?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="btn-glass text-sm flex items-center space-x-2"
                  >
                    <Copy size={16} />
                    <span>Copy</span>
                  </button>
                  <button className="btn-glass text-sm flex items-center space-x-2">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                  <button className="btn-neon text-sm flex items-center space-x-2">
                    <Play size={16} />
                    <span>Test</span>
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div ref={codeRef} className="relative">
                <pre className="bg-card/50 rounded-xl p-6 overflow-x-auto text-sm font-mono">
                  <code className="text-foreground whitespace-pre-wrap">
                    {code}
                  </code>
                </pre>
              </div>

              {/* Integration Help */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Next Steps:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="btn-glass text-sm text-left p-3">
                    <div className="font-medium mb-1">1. Install Dependencies</div>
                    <div className="text-xs text-muted-foreground">npm install stripe</div>
                  </button>
                  <button className="btn-glass text-sm text-left p-3">
                    <div className="font-medium mb-1">2. Configure Environment</div>
                    <div className="text-xs text-muted-foreground">Add API keys to .env</div>
                  </button>
                  <button className="btn-glass text-sm text-left p-3">
                    <div className="font-medium mb-1">3. Test Integration</div>
                    <div className="text-xs text-muted-foreground">Run in sandbox mode</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;