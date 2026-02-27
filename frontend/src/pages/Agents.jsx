import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { 
  Bot, 
  Database, 
  MessageSquare, 
  BarChart3, 
  Puzzle, 
  Rocket, 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  Cpu, 
  Zap, 
  Globe, 
  Shield, 
  Cloud, 
  Code2, 
  Settings, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  ArrowRight,
  Play,
  Pause,
  MoreVertical,
  Eye,
  Download
} from 'lucide-react'

const AGENT_CATEGORIES = [
  {
    name: 'Data Processing',
    icon: Database,
    color: '#6366f1',
    description: 'Transform and process your data intelligently',
    agents: [
      { 
        name: 'Data Cleaner', 
        description: 'Automated data cleaning and validation with advanced algorithms', 
        status: 'available',
        rating: 4.8,
        uses: 2847,
        processingTime: '2.3ms'
      },
      { 
        name: 'ETL Pipeline', 
        description: 'Extract, transform, load operations with real-time monitoring', 
        status: 'available',
        rating: 4.9,
        uses: 1923,
        processingTime: '1.8ms'
      },
      { 
        name: 'Data Validator', 
        description: 'Schema validation and quality checks with custom rules', 
        status: 'coming-soon',
        rating: 4.7,
        uses: 0,
        processingTime: '0.5ms'
      }
    ]
  },
  {
    name: 'Communication',
    icon: MessageSquare,
    color: '#22c55e',
    description: 'Smart communication and messaging solutions',
    agents: [
      { 
        name: 'Email Assistant', 
        description: 'Smart email processing and AI-powered reply suggestions', 
        status: 'available',
        rating: 4.6,
        uses: 3421,
        processingTime: '1.2ms'
      },
      { 
        name: 'Chat Bot', 
        description: 'Customer service automation with natural language processing', 
        status: 'available',
        rating: 4.7,
        uses: 2156,
        processingTime: '0.8ms'
      },
      { 
        name: 'SMS Notifier', 
        description: 'SMS alerts and notifications with template support', 
        status: 'coming-soon',
        rating: 4.5,
        uses: 0,
        processingTime: '0.3ms'
      }
    ]
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    color: '#06b6d4',
    description: 'Advanced analytics and insights generation',
    agents: [
      { 
        name: 'Report Generator', 
        description: 'Automated report creation with customizable templates', 
        status: 'available',
        rating: 4.8,
        uses: 1567,
        processingTime: '3.1ms'
      },
      { 
        name: 'Trend Analyzer', 
        description: 'Pattern detection and predictive trend analysis', 
        status: 'coming-soon',
        rating: 4.9,
        uses: 0,
        processingTime: '2.7ms'
      },
      { 
        name: 'Forecast Engine', 
        description: 'Predictive analytics with machine learning models', 
        status: 'coming-soon',
        rating: 4.6,
        uses: 0,
        processingTime: '5.2ms'
      }
    ]
  },
  {
    name: 'Integration',
    icon: Puzzle,
    color: '#a855f7',
    description: 'Connect and integrate with external services',
    agents: [
      { 
        name: 'API Connector', 
        description: 'Third-party API integration with authentication support', 
        status: 'available',
        rating: 4.7,
        uses: 892,
        processingTime: '1.5ms'
      },
      { 
        name: 'Webhook Handler', 
        description: 'Webhook processing and intelligent routing system', 
        status: 'available',
        rating: 4.8,
        uses: 1234,
        processingTime: '0.9ms'
      },
      { 
        name: 'Database Sync', 
        description: 'Multi-database synchronization with conflict resolution', 
        status: 'coming-soon',
        rating: 4.5,
        uses: 0,
        processingTime: '2.1ms'
      }
    ]
  }
]

function StatusBadge({ status }) {
  const config = {
    available: { 
      label: 'Available', 
      color: '#22c55e', 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: CheckCircle2
    },
    'coming-soon': { 
      label: 'Coming Soon', 
      color: '#f59e0b', 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: Clock
    },
    beta: { 
      label: 'Beta', 
      color: '#06b6d4', 
      bg: 'bg-cyan-500/10', 
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      icon: AlertCircle
    }
  }
  const s = config[status] || config['coming-soon']
  const Icon = s.icon
  
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${s.bg} ${s.border} border`}>
      <Icon size={12} className={s.text} />
      <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
    </div>
  )
}

function AgentCard({ agent, categoryColor, onUse }) {
  return (
    <div className="group relative bg-gradient-to-br from-slate-900/30 to-slate-800/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:-translate-y-1">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${categoryColor}10 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm mb-1">{agent.name}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{agent.description}</p>
          </div>
          <StatusBadge status={agent.status} />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(agent.rating) ? "fill-amber-400 text-amber-400" : "text-slate-600"} />
            ))}
            <span className="text-xs text-slate-400 ml-1">{agent.rating}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Activity size={10} />
              {agent.processingTime}
            </div>
            {agent.uses > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp size={10} />
                {agent.uses}
              </div>
            )}
          </div>
        </div>

        {/* Action */}
        {agent.status === 'available' ? (
          <button 
            onClick={onUse}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-xs hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Play size={12} />
            Use Agent
          </button>
        ) : (
          <button 
            disabled
            className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 font-medium text-xs cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Clock size={12} />
            Coming Soon
          </button>
        )}
      </div>
    </div>
  )
}

export default function Agents() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredCategories = AGENT_CATEGORIES.filter(category => {
    if (selectedCategory !== 'all' && category.name !== selectedCategory) return false
    if (searchTerm) {
      return category.agents.some(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return true
  })

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .agent-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Agents" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Agents Marketplace</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all w-64"
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
          {/* HERO BANNER */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Intelligent AI Agents</h2>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-2xl">
                    Discover and deploy powerful AI agents to automate your workflows. 
                    From data processing to customer support, find the perfect agent for your needs.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-emerald-400" />
                      <span className="text-sm text-slate-300">{AGENT_CATEGORIES.reduce((acc, cat) => acc + cat.agents.length, 0)} Agents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-teal-400" />
                      <span className="text-sm text-slate-300">{AGENT_CATEGORIES.reduce((acc, cat) => acc + cat.agents.filter(a => a.status === 'available').length, 0)} Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Rocket size={16} className="text-purple-400" />
                      <span className="text-sm text-slate-300">{AGENT_CATEGORIES.reduce((acc, cat) => acc + cat.agents.filter(a => a.status === 'coming-soon').length, 0)} Coming Soon</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
                    <Bot size={48} className="text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORIES FILTER */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <Globe size={16} />
              <span className="font-medium">All Categories</span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                selectedCategory === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'
              }`}>
                {AGENT_CATEGORIES.length}
              </span>
            </button>
            {AGENT_CATEGORIES.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                    selectedCategory === category.name
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{category.name}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                    selectedCategory === category.name ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'
                  }`}>
                    {category.agents.length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* AGENTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCategories.map(category => {
              const Icon = category.icon
              return (
                <div key={category.name} className="category-card group">
                  <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
                    {/* Category Header */}
                    <div className="p-6 border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: `${category.color}20` }}
                          >
                            <Icon size={24} style={{ color: category.color }} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                            <p className="text-slate-400 text-sm">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{category.agents.length}</div>
                          <div className="text-xs text-slate-400">agents</div>
                        </div>
                      </div>
                    </div>

                    {/* Agents List */}
                    <div className="p-6 space-y-3">
                      {category.agents.map(agent => (
                        <AgentCard
                          key={agent.name}
                          agent={agent}
                          categoryColor={category.color}
                          onUse={() => {
                            // Handle agent usage
                            console.log(`Using agent: ${agent.name}`)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CUSTOM AGENT SECTION */}
          <div className="mt-12 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Wrench size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Build Custom Agents</h3>
                  <p className="text-slate-400">Create your own specialized agents tailored to your specific needs</p>
                </div>
              </div>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 flex items-center gap-2">
                <Plus size={18} />
                Create Custom Agent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
