import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workflows as workflowsApi } from '../api/index.js'
import Sidebar from '../components/Sidebar.jsx'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Shield, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Target,
  Rocket,
  Gauge,
  PieChart,
  LineChart,
  Timer,
  Database,
  Cloud,
  GitBranch,
  Settings
} from 'lucide-react'

export default function Analytics() {
  const navigate = useNavigate()
  const [workflows, setWorkflows] = useState([])
  const [metrics, setMetrics] = useState({
    totalWorkflows: 0,
    totalExecutions: 0,
    uptime: '99.99%',
    avgLatency: '24ms',
    successRate: '98.5%',
    errorRate: '0.01%',
    throughput: '1.2k/s',
    memoryUsage: '68%'
  })
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    workflowsApi.getAll()
      .then(res => {
        const wfs = res.data || []
        setWorkflows(wfs)
        const totalExecutions = wfs.reduce((sum, w) => sum + (w.executions || 0), 0)
        setMetrics(prev => ({
          ...prev,
          totalWorkflows: wfs.length,
          totalExecutions
        }))
      })
      .catch(() => {
        // Error silencioso al cargar analytics
      })
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const MetricCard = ({ title, value, change, changeType, icon, color, iconBg }) => (
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
            <icon size={24} style={{ color }} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {changeType === 'positive' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .metric-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .chart-container {
          background: linear-gradient(135deg, rgba(15, 17, 23, 0.9), rgba(30, 41, 59, 0.8));
        }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Analytics" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <BarChart3 size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg">
              <Activity size={16} className="text-emerald-400" />
              <span className="text-sm font-mono text-emerald-400">{metrics.avgLatency}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-white/10 rounded-lg">
              <CheckCircle2 size={16} className="text-blue-400" />
              <span className="text-sm font-mono text-blue-400">{metrics.uptime}</span>
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
                      <Gauge size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-2xl">
                    Monitor your workflows and system performance with real-time analytics. 
                    Track executions, latency, and system health metrics.
                  </p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-cyan-400" />
                      <span className="text-sm text-slate-300">{metrics.throughput} Throughput</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-emerald-400" />
                      <span className="text-sm text-slate-300">{metrics.successRate} Success Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server size={16} className="text-blue-400" />
                      <span className="text-sm text-slate-300">{metrics.memoryUsage} Memory</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center">
                    <LineChart size={48} className="text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PERIOD SELECTOR */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {['1h', '24h', '7d', '30d'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedPeriod === period
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {period === '1h' && '1 Hour'}
                  {period === '24h' && '24 Hours'}
                  {period === '7d' && '7 Days'}
                  {period === '30d' && '30 Days'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-400 hover:border-white/20 transition-colors flex items-center gap-2">
                <Calendar size={16} />
                Custom Range
              </button>
              <button className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-400 hover:border-white/20 transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Workflows"
              value={metrics.totalWorkflows}
              change="+12%"
              changeType="positive"
              icon={GitBranch}
              color="#6366f1"
              iconBg="rgba(99,102,241,0.1)"
            />
            <MetricCard
              title="Total Executions"
              value={metrics.totalExecutions.toLocaleString()}
              change="+8%"
              changeType="positive"
              icon={Activity}
              color="#22c55e"
              iconBg="rgba(34,197,94,0.1)"
            />
            <MetricCard
              title="System Uptime"
              value={metrics.uptime}
              change="Stable"
              changeType="positive"
              icon={Server}
              color="#06b6d4"
              iconBg="rgba(6,182,212,0.1)"
            />
            <MetricCard
              title="Avg Latency"
              value={metrics.avgLatency}
              change="-5ms"
              changeType="positive"
              icon={Timer}
              color="#a855f7"
              iconBg="rgba(168,85,247,0.1)"
            />
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Execution Trends */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-cyan-400" />
                  Execution Trends
                </h3>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <LineChart size={32} className="text-cyan-400" />
                  </div>
                  <p className="text-slate-400 font-medium">Coming Soon</p>
                  <p className="text-slate-500 text-sm mt-1">Advanced execution analytics</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Gauge size={20} className="text-emerald-400" />
                  Performance Metrics
                </h3>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <PieChart size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-slate-400 font-medium">Coming Soon</p>
                  <p className="text-slate-500 text-sm mt-1">Detailed performance breakdown</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVITY TABLE */}
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock size={20} className="text-purple-400" />
                Recent Activity
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/10 transition-colors text-sm">
                  <Filter size={14} className="inline mr-1" />
                  Filter
                </button>
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/10 transition-colors text-sm">
                  <Eye size={14} className="inline mr-1" />
                  View All
                </button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center mx-auto mb-4">
                  <Database size={32} className="text-purple-400" />
                </div>
                <p className="text-slate-400 font-medium">Coming Soon</p>
                <p className="text-slate-500 text-sm mt-1">Detailed activity logs and event tracking</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
