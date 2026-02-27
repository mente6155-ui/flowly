import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Activity, 
  Zap, 
  BarChart3,
  Plus,
  Grid3X3,
  HardDrive,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Server,
  Cpu,
  Wifi,
  Shield,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  RefreshCw,
  Settings,
  GitBranch,
  Layers,
  Sparkles,
  Rocket,
  Target,
  Eye,
  Download,
  Calendar,
  Filter,
  Search,
  Bell,
  LogOut,
  HelpCircle,
  ChevronRight,
  Play,
  Pause,
  Edit3,
  Trash2
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import * as workflowsApi from '../api'
import { workflows } from '../api'

const LOGS = [
  { time: '10:42:01', type: 'INFO', color: '#6366f1', msg: "Agent 'Support-01' started session successfully." },
  { time: '10:41:58', type: 'OK', color: '#22c55e', msg: 'Workflow #WF-892 completed ingestion batch (204MB).' },
  { time: '10:41:55', type: 'WARN', color: '#ef4444', msg: 'Latency spike detected in us-east-1 (>400ms). Rerouting...', highlight: true },
  { time: '10:40:12', type: 'INFO', color: '#6366f1', msg: 'System heartbeat received. All systems operational.' },
  { time: '10:39:45', type: 'DEBUG', color: '#a855f7', msg: 'Garbage collection initiated for node-04.' },
  { time: '10:38:22', type: 'INFO', color: '#06b6d4', msg: "New agent deployed: 'Research-Bot-Beta' (v1.0.4)." },
]

const WF_ICONS = { 'WF-892': '☁️', 'WF-104': '🤖', 'WF-331': '🗄️', 'WF-552': '📊', 'WF-110': '📢' }
const WF_COLORS = { 'WF-892': '#6366f1', 'WF-104': '#a855f7', 'WF-331': '#f59e0b', 'WF-552': '#06b6d4', 'WF-110': '#ef4444' }

const mapStatus = (status) => {
  if (status === 'active') return 'running'
  if (status === 'inactive') return 'paused'
  return status || 'paused'
}

const isWorkflowActive = (wf, toggles) => {
  return wf.status === 'active'
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
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
    running: { label: 'Running', color: '#22c55e', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    paused:  { label: 'Paused',  color: '#94a3b8', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
    warning: { label: 'Warning', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    failed:  { label: 'Failed',  color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  }
  const s = config[status] || config.paused
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${s.bg} ${s.border} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.text.replace('text-', 'bg-')}`} />
      <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
    </div>
  )
}

function MetricCard({ title, value, change, changeType, icon: Icon, color, iconBg }) {
  return (
    <div className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:-translate-y-1">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}15 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: iconBg }}
          >
            <Icon size={24} style={{ color }} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            changeType === 'positive' ? 'text-emerald-400' : changeType === 'negative' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {changeType === 'positive' && <ArrowUp size={12} />}
            {changeType === 'negative' && <ArrowDown size={12} />}
            {change}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

function WorkflowCard({ workflow, isActive, onToggle, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${WF_COLORS[workflow.id] || '#6366f1'}15 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${WF_COLORS[workflow.id] || '#6366f1'}20` }}
            >
              <span className="text-lg">{WF_ICONS[workflow.id] || '⚡'}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{workflow.name}</h3>
              <p className="text-slate-500 text-xs font-mono">#{workflow.id}</p>
            </div>
          </div>
          <Toggle checked={isActive} onChange={onToggle} />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <StatusBadge status={mapStatus(workflow.status)} />
          <span className="text-xs text-slate-500">
            {workflow.lastRun ? new Date(workflow.lastRun).toLocaleTimeString() : 'Never'}
          </span>
        </div>

        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min((workflow.executions || 0) / 5, 100)}%`,
              background: `linear-gradient(90deg, ${WF_COLORS[workflow.id] || '#6366f1'}, ${WF_COLORS[workflow.id] || '#6366f1'}80)`
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [workflowsData, setWorkflowsData] = useState([])
  const [toggles, setToggles] = useState({})
  const [latency, setLatency] = useState(24)
  const [uptime, setUptime] = useState(99.99)
  const [activityLogs, setActivityLogs] = useState(LOGS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    workflows.getAll()
      .then(res => {
        setWorkflowsData(res.data || [])
        const t = {}
        ;(res.data || []).forEach(w => { 
          t[w.id] = w.status === 'active' 
        })
        setToggles(t)
      })
      .catch(err => {
        console.error('Error cargando workflows:', err.message)
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const eventTypes = [
        { type: 'INFO', color: '#6366f1', messages: [
          "System heartbeat received. All systems operational.",
          "Cache cleared successfully. Memory usage optimized.",
          "Database connection pool refreshed.",
          "New deployment detected. Version 2.1.0 active."
        ]},
        { type: 'OK', color: '#22c55e', messages: [
          "Workflow #WF-892 completed batch processing.",
          "Backup completed successfully. 2.4GB saved.",
          "API rate limits reset. Ready for new requests.",
          "SSL certificate renewed. Valid for 90 days."
        ]},
        { type: 'WARN', color: '#ef4444', messages: [
          "High memory usage detected on node-03 (87%).",
          "Database connection timeout. Retrying...",
          "API rate limit approaching. 85% used.",
          "Disk space low on primary server (12% free)."
        ]},
        { type: 'DEBUG', color: '#a855f7', messages: [
          "Garbage collection completed in 23ms.",
          "Cache hit ratio: 94.2% (excellent).",
          "Connection pool stats: 45/100 active.",
          "Query optimization: 3 indexes added."
        ]}
      ]
      
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)]
      
      setActivityLogs(prev => [
        {
          time: new Date().toLocaleTimeString(),
          type: randomType.type,
          color: randomType.color,
          msg: randomMessage,
          highlight: randomType.type === 'WARN'
        },
        ...prev.slice(0, 5)
      ])
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const toggleWorkflow = (id) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setLatency(prev => prev + Math.floor(Math.random() * 10) - 5)
      setUptime(prev => Math.min(99.99, prev + Math.random() * 0.01))
      setIsLoading(false)
    }, 1000)
  }

  const activeCount = workflowsData.filter(wf => isWorkflowActive(wf, toggles)).length
  const totalExecutions = workflowsData.reduce((sum, w) => sum + (w.executions || 0), 0)
  const tokensSaved = totalExecutions * 100
  const throughput = activeCount * 50

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .metric-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .workflow-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Dashboard" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg">
              <Activity size={16} className="text-emerald-400" />
              <span className="text-sm font-mono text-emerald-400">{latency}ms</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg">
              <CheckCircle2 size={16} className="text-blue-400" />
              <span className="text-sm font-mono text-blue-400">{uptime.toFixed(2)}%</span>
            </div>
            <button
              onClick={refreshData}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
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
                      <Rocket size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome to Flowly</h2>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-2xl">
                    Monitor your workflows, track performance metrics, and manage your automation ecosystem from one central dashboard.
                  </p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-blue-400" />
                      <span className="text-sm text-slate-300">{activeCount} Active Workflows</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-emerald-400" />
                      <span className="text-sm text-slate-300">{throughput}/sec Throughput</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-cyan-400" />
                      <span className="text-sm text-slate-300">{uptime.toFixed(2)}% Uptime</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center">
                    <Target size={48} className="text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Workflows"
              value={activeCount}
              change="+12%"
              changeType="positive"
              icon={GitBranch}
              color="#6366f1"
              iconBg="rgba(99,102,241,0.1)"
            />
            <MetricCard
              title="Total Executions"
              value={totalExecutions.toLocaleString()}
              change="+8%"
              changeType="positive"
              icon={Activity}
              color="#22c55e"
              iconBg="rgba(34,197,94,0.1)"
            />
            <MetricCard
              title="Tokens Saved"
              value={tokensSaved.toLocaleString()}
              change="+24%"
              changeType="positive"
              icon={Zap}
              color="#a855f7"
              iconBg="rgba(168,85,247,0.1)"
            />
            <MetricCard
              title="Throughput"
              value={`${throughput}/s`}
              change="-2%"
              changeType="negative"
              icon={BarChart3}
              color="#06b6d4"
              iconBg="rgba(6,182,212,0.1)"
            />
          </div>

          {/* WORKFLOWS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Workflows */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <GitBranch size={20} className="text-blue-400" />
                  Active Workflows
                </h3>
                <button 
                  onClick={() => navigate('/workflows')}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {workflowsData.slice(0, 3).map(wf => (
                  <WorkflowCard
                    key={wf.id}
                    workflow={wf}
                    isActive={toggles[wf.id] || false}
                    onToggle={() => toggleWorkflow(wf.id)}
                    onClick={() => navigate(`/editor/${wf.id}`)}
                  />
                ))}
              </div>

              {workflowsData.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                    <GitBranch size={32} className="text-blue-400" />
                  </div>
                  <p className="text-slate-400 font-medium">No workflows yet</p>
                  <p className="text-slate-500 text-sm mt-1">Create your first workflow to get started</p>
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock size={20} className="text-purple-400" />
                  Activity Feed
                </h3>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activityLogs.map((log, i) => (
                    <div 
                      key={i} 
                      className={`flex gap-3 p-3 rounded-lg transition-all ${
                        log.highlight 
                          ? 'bg-red-500/10 border border-red-500/30' 
                          : 'bg-white/5'
                      }`}
                    >
                      <span className="text-xs text-slate-500 font-mono min-w-[60px]">{log.time}</span>
                      <span 
                        className="text-xs font-semibold min-w-[50px]"
                        style={{ color: log.color }}
                      >
                        {log.type}
                      </span>
                      <span className="text-sm text-slate-300 flex-1">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
