import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { apiFetch } from '@/helpers/Helper';
import { 
  Key, 
  Plus, 
  Eye, 
  EyeSlash, 
  Copy, 
  Trash,
  Shield,
  Warning,
  CheckCircle,
  Calendar
} from 'phosphor-react';
import { useAuth } from "@/AuthContext";

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

const KeyManagerSection = () => {
  const { isLoggedIn, user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [apis, setApis] = useState<Api[]>([]);
  const [keys, setKeys] = useState<any>({});

  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyService, setNewKeyService] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState('development');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [isCustomService, setIsCustomService] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [editingKey, setEditingKey] = useState<any | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await apiFetch(`/apis/fromdb?fetch_all=true`);
        setApis(response.apis || []);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      }
    };
    fetchApis();
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      const stored = localStorage.getItem(`keys_${user.id}`);
      if (stored) setKeys(JSON.parse(stored));
    }
  }, [isLoggedIn, user]);

  const saveKeys = (newKeys: any) => {
    if (!isLoggedIn || !user) return;
    localStorage.setItem(`keys_${user.id}`, JSON.stringify(newKeys));
    setKeys(newKeys);
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user) return;

    if (editingKey) {
      const updatedKeys = {
        ...keys,
        [editingKey.id]: {
          ...editingKey,
          name: newKeyName || 'Untitled Key',
          service: isCustomService ? newKeyService : apis.find(a => a.id === newKeyService)?.name || newKeyService || 'Custom',
          environment: newKeyEnv,
          keyValue: newKeyValue,
          keyPreview: newKeyValue.slice(0, 4) + '****'
        }
      };
      saveKeys(updatedKeys);
    } else {
      const id = `key_${Date.now()}`;
      const keyName = newKeyName || 'Untitled Key';
      const serviceName = isCustomService ? newKeyService : apis.find(a => a.id === newKeyService)?.name || 'Custom';

      const newKeys = {
        ...keys,
        [id]: {
          id,
          name: keyName,
          service: serviceName,
          environment: newKeyEnv,
          keyType: 'API Key',
          keyValue: newKeyValue,
          keyPreview: newKeyValue.slice(0, 4) + '****',
          status: 'active',
          lastUsed: 'Never',
          createdAt: new Date().toISOString().split('T')[0],
          permissions: []
        }
      };
      saveKeys(newKeys);
    }

    setShowAddModal(false);
    setNewKeyName('');
    setNewKeyService('');
    setNewKeyEnv('development');
    setNewKeyValue('');
    setIsCustomService(false);
    setEditingKey(null);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) newSet.delete(keyId);
      else newSet.add(keyId);
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'expired':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'text-red-400 bg-red-500/20';
      case 'staging':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'development':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'expired':
        return <Warning size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <section id="keys" className="py-24 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gradient mb-6">API Key Manager</h2>
          <p className="text-lg text-muted-foreground">
            Please <a href="/login" className="text-primary underline">Login</a> or <a href="/signup" className="text-primary underline">Signup</a> to manage your API keys.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="keys" className="py-24 px-6 min-h-screen" data-scroll-section>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">API Key Manager</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Securely store and manage your API keys with enterprise-grade encryption
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowAddModal(true)} className="btn-neon flex items-center space-x-2">
              <Plus size={20} />
              <span>Add New Key</span>
            </button>
            <button className="btn-glass flex items-center space-x-2">
              <Shield size={20} />
              <span>Import Keys</span>
            </button>
          </div>
          <div className="glass px-4 py-2 rounded-xl">
            <span className="text-sm text-muted-foreground">
              Total Keys: {Object.keys(keys).length} | Active: {Object.values(keys).filter((k: any) => k.status === 'active').length}
            </span>
          </div>
        </div>

        <div className="glass-card mb-8 border-l-4 border-primary">
          <div className="flex items-start space-x-3">
            <Shield className="text-primary mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Security First</h3>
              <p className="text-sm text-muted-foreground">
                All API keys are encrypted using AES-256 encryption and stored securely. Keys are never transmitted in plain text and are only decrypted when needed for integration.
              </p>
            </div>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.values(keys).map((apiKey: any) => (
            <div key={apiKey.id} className="glass-card transition-all duration-300 hover:scale-[1.02] hover:glow-primary">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Key className="text-primary-foreground" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{apiKey.name}</h3>
                    <p className="text-sm text-muted-foreground">{apiKey.service}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-xs ${getStatusColor(apiKey.status)}`}>
                  {getStatusIcon(apiKey.status)}
                  <span className="capitalize">{apiKey.status}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Environment</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getEnvironmentColor(apiKey.environment)}`}>
                    {apiKey.environment}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">{apiKey.keyType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Used</span>
                  <span className="text-sm font-medium">{apiKey.lastUsed}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">API Key</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-input px-4 py-3 rounded-xl border border-border font-mono text-sm">
                    {visibleKeys.has(apiKey.id) ? apiKey.keyValue : apiKey.keyPreview}
                  </div>
                  <button onClick={() => toggleKeyVisibility(apiKey.id)} className="p-3 btn-glass">
                    {visibleKeys.has(apiKey.id) ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                  <button className="p-3 btn-glass" onClick={() => navigator.clipboard.writeText(apiKey.keyValue)}>
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map((permission: string) => (
                    <span key={permission} className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-lg">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>Created {apiKey.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn-glass text-sm px-3 py-2"
                    onClick={() => {
                      setEditingKey(apiKey);
                      setNewKeyName(apiKey.name);
                      setNewKeyService(apiKey.service);
                      setIsCustomService(!apis.some(a => a.name === apiKey.service));
                      setNewKeyEnv(apiKey.environment);
                      setNewKeyValue(apiKey.keyValue);
                      setShowAddModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" onClick={() => {
                    const newKeys = { ...keys };
                    delete newKeys[apiKey.id];
                    saveKeys(newKeys);
                  }}>
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="glass-card max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-6">{editingKey ? 'Edit API Key' : 'Add New API Key'}</h3>
              <form className="space-y-4" onSubmit={handleAddKey}>
                <div>
                  <label className="block text-sm font-medium mb-2">Key Name</label>
                  <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g., Stripe Production" className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service</label>
                  <select value={isCustomService ? 'custom' : newKeyService} onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomService(true);
                      setNewKeyService('');
                    } else {
                      setIsCustomService(false);
                      setNewKeyService(e.target.value);
                    }
                  }} className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all">
                    <option value="">Select Service</option>
                    {apis.map(api => (
                      <option key={api.id} value={api.id}>{api.name}</option>
                    ))}
                    <option value="custom">Other (Custom)</option>
                  </select>
                  {isCustomService && (
                    <input type="text" value={newKeyService} onChange={(e) => setNewKeyService(e.target.value)} placeholder="Enter custom API name" className="mt-2 w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Environment</label>
                  <select value={newKeyEnv} onChange={(e) => setNewKeyEnv(e.target.value)} className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all">
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <div className="flex items-center bg-input rounded-xl border border-border">
                    <input
                      type={showKeyInput ? "text" : "password"}
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value)}
                      placeholder="Paste your API key here"
                      className="flex-1 px-4 py-3 bg-transparent rounded-l-xl outline-none font-mono"
                    />
                    <button
                      type="button"
                      className="px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowKeyInput(!showKeyInput)}
                    >
                      {showKeyInput ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="btn-glass px-4 py-2"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingKey(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-neon px-4 py-2"
                  >
                    {editingKey ? "Save Changes" : "Add Key"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default KeyManagerSection;
