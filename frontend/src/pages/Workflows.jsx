import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workflows as workflowsApi } from '../api/index.js'
import Sidebar from '../components/Sidebar.jsx'
import { 
  GitBranch, 
  Plus, 
  ArrowLeft, 
  Star, 
  Zap, 
  Database, 
  Cloud, 
  Bell, 
  Bot, 
  BarChart3, 
  Settings, 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  ChevronRight,
  MoreVertical
} from 'lucide-react'

const WF_ICONS = { 
  'WF-892': Cloud, 
  'WF-104': Bot, 
  'WF-331': Database, 
  'WF-552': BarChart3, 
  'WF-110': Bell 
}

const WF_COLORS = { 
  'WF-892': '#6366f1', 
  'WF-104': '#a855f7', 
  'WF-331': '#f59e0b', 
  'WF-552': '#06b6d4', 
  'WF-110': '#ef4444' 
}

const TEMPLATE_CARDS = [
  {
    id: 'data-processing',
    name: 'Data Processing',
    description: 'Transform, clean, and analyze data with automated workflows',
    icon: BarChart3,
    color: '#f59e0b',
    badge: 'Popular',
    tags: ['ETL', 'Analytics'],
    gradient: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'border-amber-500/30',
    iconBg: 'bg-amber-500/10'
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: 'Intelligent automation with AI-powered decision making',
    icon: Bot,
    color: '#a855f7',
    badge: 'Trending',
    tags: ['AI', 'ML'],
    gradient: 'from-purple-500/20 to-pink-500/10',
    borderColor: 'border-purple-500/30',
    iconBg: 'bg-purple-500/10'
  },
  {
    id: 'cloud-integration',
    name: 'Cloud Integration',
    description: 'Connect and sync with cloud services and APIs',
    icon: Cloud,
    color: '#6366f1',
    badge: 'Essential',
    tags: ['API', 'Cloud'],
    gradient: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    iconBg: 'bg-blue-500/10'
  },
  {
    id: 'database-automation',
    name: 'Database Automation',
    description: 'Automate database operations and data management',
    icon: Database,
    color: '#06b6d4',
    badge: 'Advanced',
    tags: ['SQL', 'Database'],
    gradient: 'from-cyan-500/20 to-teal-500/10',
    borderColor: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/10'
  },
  {
    id: 'notification-system',
    name: 'Notification System',
    description: 'Send notifications and alerts across multiple channels',
    icon: Bell,
    color: '#ef4444',
    badge: 'New',
    tags: ['Email', 'SMS'],
    gradient: 'from-red-500/20 to-rose-500/10',
    borderColor: 'border-red-500/30',
    iconBg: 'bg-red-500/10'
  }
]

const mapStatus = (status) => {
  if (status === 'active') return 'running'
  if (status === 'inactive') return 'paused'
  return status || 'paused'
}

function Toggle({ checked, onChange }) {
  return (
    <button 
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full border-0 cursor-pointer p-0 transition-all duration-300 ${
        checked 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' 
          : 'bg-white/10'
      }`}
    >
      <span 
        className={`absolute top-0.5 transition-all duration-300 w-5 h-5 rounded-full bg-white shadow-md ${
          checked ? 'left-6' : 'left-0.5'
        }`} 
      />
    </button>
  )
}

function StatusBadge({ status }) {
  const config = {
    running: { label: 'Running', color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
    paused:  { label: 'Paused',  color: 'text-slate-400', bg: 'bg-slate-400/10', dot: 'bg-slate-400' },
    warning: { label: 'Warning', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
    failed:  { label: 'Failed',  color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
  }
  const s = config[status] || config.paused
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
    </div>
  )
}

function WorkflowCard({ workflow, isActive, onToggle, onClick }) {
  const Icon = WF_ICONS[workflow.id] || Zap
  const color = WF_COLORS[workflow.id] || '#6366f1'
  
  return (
    <div 
      onClick={onClick}
      className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, rgba(15, 17, 23, 0.9), rgba(30, 41, 59, 0.8))`,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}15 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}20` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{workflow.name}</h3>
              <p className="text-slate-500 text-xs font-mono">#{workflow.id}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <MoreVertical size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <StatusBadge status={mapStatus(workflow.status)} />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={12} />
            <span>{workflow.lastRun ? new Date(workflow.lastRun).toLocaleTimeString() : 'Never'}</span>
          </div>
        </div>

        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min((workflow.executions || 0) / 5, 100)}%`,
              background: `linear-gradient(90deg, ${color}, ${color}80)`
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Workflows() {
  const navigate = useNavigate()
  const [workflows, setWorkflows] = useState([])
  const [toggles, setToggles] = useState({})

  useEffect(() => {
    workflowsApi.getAll()
      .then(res => {
        const wfs = res.data || []
        setWorkflows(wfs)
        const t = {}
        wfs.forEach(w => { t[w.id] = w.status === 'active' })
        setToggles(t)
      })
      .catch(() => {
        // Error silencioso al cargar workflows
      })
  }, [])

  const toggleWorkflow = (id) => setToggles(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .glass-morphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .neon-glow {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }
        .template-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .template-card:hover {
          transform: translateY(-4px) scale(1.02);
        }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Workflows" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <GitBranch size={18} className="text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">Workflows</h1>
            </div>
          </div>
          <button 
            onClick={() => navigate('/editor/new')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={16} />
            New Workflow
          </button>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* TEMPLATES SECTION */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Popular Templates</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {TEMPLATE_CARDS.map((template) => {
                const Icon = template.icon
                return (
                  <div
                    key={template.id}
                    onClick={() => navigate('/editor/new')}
                    className={`template-card group relative bg-gradient-to-br ${template.gradient} border ${template.borderColor} rounded-2xl p-5 cursor-pointer hover:shadow-2xl`}
                    style={{
                      background: `linear-gradient(135deg, rgba(15, 17, 23, 0.95), rgba(30, 41, 59, 0.9))`,
                    }}
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${template.color}20 0%, transparent 70%)`
                      }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${template.iconBg} flex items-center justify-center`}>
                          <Icon size={20} style={{ color: template.color }} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm">{template.name}</h3>
                          <p className="text-xs" style={{ color: template.color }}>{template.badge}</p>
                        </div>
                      </div>
                      
                      <p className="text-slate-400 text-xs leading-relaxed mb-3">
                        {template.description}
                      </p>
                      
                      <div className="flex gap-1.5">
                        {template.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs px-2 py-1 rounded-lg font-medium"
                            style={{
                              background: `${template.color}15`,
                              color: template.color
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* YOUR WORKFLOWS SECTION */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Layers size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Your Workflows</h2>
            </div>

            {workflows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <GitBranch size={40} className="text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 blur-xl" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">No workflows yet</h2>
                <p className="text-slate-400 text-lg mb-8">Create your first workflow to get started</p>
                <button 
                  onClick={() => navigate('/editor/new')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 flex items-center gap-3"
                >
                  <Plus size={20} />
                  Create First Workflow
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {workflows.map(wf => (
                  <WorkflowCard
                    key={wf.id}
                    workflow={wf}
                    isActive={toggles[wf.id] || false}
                    onToggle={() => toggleWorkflow(wf.id)}
                    onClick={() => navigate(`/editor/${wf.id}`)}
                  />
                ))}

                {/* NEW WORKFLOW CARD */}
                <div
                  onClick={() => navigate('/editor/new')}
                  className="group relative bg-gradient-to-br from-slate-900/30 to-slate-800/20 border-2 border-dashed border-slate-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-cyan-500/5 flex flex-col items-center justify-center min-h-[200px]"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Plus size={24} className="text-blue-400" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">Create New Workflow</p>
                  <p className="text-slate-500 text-xs text-center">Orchestrate a new agent process</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
