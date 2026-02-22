import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workflows as workflowsApi } from '../api/index.js'
import Sidebar from '../components/Sidebar.jsx'

export default function Analytics() {
  const navigate = useNavigate()
  const [workflows, setWorkflows] = useState([])
  const [metrics, setMetrics] = useState({
    totalWorkflows: 0,
    totalExecutions: 0,
    uptime: '99.99%',
    avgLatency: '24ms'
  })

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

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
        .metric-card { transition: all 0.2s ease; }
        .metric-card:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.3) !important; }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Analytics" />

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0f1117', flexShrink: 0 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span className="material-icons" style={{ color: '#6366f1', fontSize: '22px' }}>bar_chart</span>
            Analytics
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ color: '#475569' }}>Latency</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontFamily: 'monospace', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />{metrics.avgLatency}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ color: '#475569' }}>Uptime</span>
              <span style={{ color: '#6366f1', fontFamily: 'monospace', fontWeight: 600 }}>{metrics.uptime}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* Metrics Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div className="metric-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons" style={{ color: '#6366f1', fontSize: '20px' }}>account_tree</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', margin: 0 }}>Total Workflows</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: '0' }}>{metrics.totalWorkflows}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#22c55e' }}>
                <span className="material-icons" style={{ fontSize: '14px' }}>trending_up</span>
                +12% from last month
              </div>
            </div>

            <div className="metric-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons" style={{ color: '#22c55e', fontSize: '20px' }}>play_arrow</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', margin: 0 }}>Total Executions</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: '0' }}>{metrics.totalExecutions}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#22c55e' }}>
                <span className="material-icons" style={{ fontSize: '14px' }}>trending_up</span>
                +8% from last week
              </div>
            </div>

            <div className="metric-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons" style={{ color: '#06b6d4', fontSize: '20px' }}>speed</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', margin: 0 }}>System Uptime</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: '0' }}>{metrics.uptime}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#22c55e' }}>
                <span className="material-icons" style={{ fontSize: '14px' }}>check_circle</span>
                Excellent performance
              </div>
            </div>

            <div className="metric-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons" style={{ color: '#a855f7', fontSize: '20px' }}>schedule</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', margin: 0 }}>Avg Latency</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: '0' }}>{metrics.avgLatency}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#22c55e' }}>
                <span className="material-icons" style={{ fontSize: '14px' }}>trending_down</span>
                -5ms improvement
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 16px' }}>Execution Trends</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-icons" style={{ fontSize: '48px', color: '#475569', marginBottom: '16px', display: 'block' }}>show_chart</span>
                  <p style={{ margin: 0 }}>Coming soon</p>
                  <p style={{ fontSize: '12px', margin: '8px 0 0' }}>Advanced charts and analytics will be available</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 16px' }}>Performance Metrics</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-icons" style={{ fontSize: '48px', color: '#475569', marginBottom: '16px', display: 'block' }}>analytics</span>
                  <p style={{ margin: 0 }}>Coming soon</p>
                  <p style={{ fontSize: '12px', margin: '8px 0 0' }}>Detailed performance analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Table */}
          <div style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 16px' }}>Recent Activity</h3>
            <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '40px' }}>
              <span className="material-icons" style={{ fontSize: '48px', color: '#475569', marginBottom: '16px', display: 'block' }}>history</span>
              <p style={{ margin: 0 }}>Coming soon</p>
              <p style={{ fontSize: '12px', margin: '8px 0 0' }}>Detailed activity logs and event tracking</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
