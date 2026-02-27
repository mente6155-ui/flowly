import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { 
  Cloud, 
  CloudUpload, 
  HardDrive, 
  Activity, 
  Puzzle, 
  Code2, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  X, 
  Plus,
  CreditCard,
  Zap,
  Shield,
  Database,
  Globe,
  Wifi,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Key,
  Link,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit3,
  MoreVertical,
  Search,
  Filter,
  Rocket,
  Sparkles,
  Layers,
  Cpu,
  Server,
  GitBranch,
  BarChart3,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'

const INTEGRATIONS = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect your workflows to Slack channels for real-time notifications',
    icon: MessageSquare,
    color: '#4A154B',
    category: 'Communication',
    status: 'connected',
    usage: '2,847 messages',
    lastSync: '2 minutes ago'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Integrate with GitHub repositories for CI/CD automation',
    icon: Code2,
    color: '#24292E',
    category: 'Development',
    status: 'connected',
    usage: '1,234 commits',
    lastSync: '5 minutes ago'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    description: 'Connect to AWS services for cloud infrastructure management',
    icon: Cloud,
    color: '#FF9900',
    category: 'Cloud',
    status: 'connected',
    usage: '847 operations',
    lastSync: '1 minute ago'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Sync files and documents with Google Drive storage',
    icon: CloudUpload,
    color: '#4285F4',
    category: 'Storage',
    status: 'disconnected',
    usage: 'Not connected',
    lastSync: 'Never'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage financial workflows',
    icon: CreditCard,
    color: '#635BFF',
    category: 'Payment',
    status: 'connected',
    usage: '$12,456 processed',
    lastSync: '3 minutes ago'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing automation and campaign management',
    icon: Mail,
    color: '#FFE01B',
    category: 'Marketing',
    status: 'disconnected',
    usage: 'Not connected',
    lastSync: 'Never'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send notifications and manage community workflows',
    icon: MessageSquare,
    color: '#5865F2',
    category: 'Communication',
    status: 'connected',
    usage: '567 messages',
    lastSync: '4 minutes ago'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Connect to Notion databases and workspace management',
    icon: Database,
    color: '#000000',
    category: 'Productivity',
    status: 'disconnected',
    usage: 'Not connected',
    lastSync: 'Never'
  }
]

const CATEGORIES = [
  { name: 'All', count: INTEGRATIONS.length, icon: Layers },
  { name: 'Communication', count: 2, icon: MessageSquare },
  { name: 'Development', count: 1, icon: Code2 },
  { name: 'Cloud', count: 1, icon: Cloud },
  { name: 'Storage', count: 1, icon: HardDrive },
  { name: 'Payment', count: 1, icon: CreditCard },
  { name: 'Marketing', count: 1, icon: Mail },
  { name: 'Productivity', count: 1, icon: Database }
]

function StatusBadge({ status }) {
  const config = {
    connected: { 
      label: 'Connected', 
      color: '#22c55e', 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: CheckCircle2
    },
    disconnected: { 
      label: 'Disconnected', 
      color: '#ef4444', 
      bg: 'bg-red-500/10', 
      text: 'text-red-400',
      border: 'border-red-500/30',
      icon: X
    },
    pending: { 
      label: 'Pending', 
      color: '#f59e0b', 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: Clock
    }
  }
  const s = config[status] || config.disconnected
  const Icon = s.icon
  
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${s.bg} ${s.border} border`}>
      <Icon size={12} className={s.text} />
      <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
    </div>
  )
}

function IntegrationCard({ integration, onConnect, onDisconnect, onManage }) {
  const Icon = integration.icon
  
  return (
    <div className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:-translate-y-1">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${integration.color}15 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${integration.color}20` }}
            >
              <Icon size={24} style={{ color: integration.color }} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{integration.name}</h3>
              <p className="text-slate-400 text-sm">{integration.category}</p>
            </div>
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {integration.description}
        </p>

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={integration.status} />
          <div className="text-right">
            <p className="text-xs text-slate-400">{integration.usage}</p>
            <p className="text-xs text-slate-500">{integration.lastSync}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {integration.status === 'connected' ? (
            <>
              <button 
                onClick={onManage}
                className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Settings size={14} />
                Manage
              </button>
              <button 
                onClick={onDisconnect}
                className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <X size={14} />
                Disconnect
              </button>
            </>
          ) : (
            <button 
              onClick={onConnect}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Link size={14} />
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Integrations() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIntegration, setSelectedIntegration] = useState(null)

  const filteredIntegrations = INTEGRATIONS.filter(integration => {
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleConnect = (integration) => {
    console.log(`Connecting to ${integration.name}`)
    // Handle connection logic
  }

  const handleDisconnect = (integration) => {
    console.log(`Disconnecting from ${integration.name}`)
    // Handle disconnection logic
  }

  const handleManage = (integration) => {
    console.log(`Managing ${integration.name}`)
    // Handle management logic
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .integration-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-pill {
          transition: all 0.2s ease;
        }
        .category-pill:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Integrations" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Puzzle size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Integrations</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all w-64"
              />
            </div>
            <button className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-400 hover:border-white/20 transition-colors flex items-center gap-2">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* HERO SECTION */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Connect Your Tools</h2>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-2xl">
                    Seamlessly integrate your favorite tools and services to automate workflows. 
                    Connect to dozens of popular platforms with just a few clicks.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Link size={16} className="text-indigo-400" />
                      <span className="text-sm text-slate-300">{INTEGRATIONS.filter(i => i.status === 'connected').length} Connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-purple-400" />
                      <span className="text-sm text-slate-300">{INTEGRATIONS.length} Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-emerald-400" />
                      <span className="text-sm text-slate-300">Secure & Reliable</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center">
                    <Puzzle size={48} className="text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORIES FILTER */}
          <div className="flex gap-3 mb-8">
            {CATEGORIES.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`category-pill flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    selectedCategory === category.name
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                      : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{category.name}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                    selectedCategory === category.name ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/10 text-slate-400'
                  }`}>
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* INTEGRATIONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIntegrations.map(integration => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={() => handleConnect(integration)}
                onDisconnect={() => handleDisconnect(integration)}
                onManage={() => handleManage(integration)}
              />
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredIntegrations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-center mb-6">
                <Search size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No integrations found</h3>
              <p className="text-slate-400">Try adjusting your search or browse different categories</p>
            </div>
          )}

          {/* ADD NEW INTEGRATION */}
          <div className="mt-8 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Plus size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Need a specific integration?</h3>
                  <p className="text-slate-400">Request a new integration or build your own custom connector</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2">
                  <ExternalLink size={16} />
                  Request Integration
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center gap-2">
                  <Code2 size={16} />
                  Build Custom
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
