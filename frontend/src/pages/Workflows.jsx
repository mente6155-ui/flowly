import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workflows as workflowsApi } from '../api/index.js'
import Sidebar from '../components/Sidebar.jsx'

const WF_ICONS = { 'WF-892': '☁️', 'WF-104': '🤖', 'WF-331': '🗄️', 'WF-552': '📊', 'WF-110': '📢' }
const WF_COLORS = { 'WF-892': '#6366f1', 'WF-104': '#a855f7', 'WF-331': '#f59e0b', 'WF-552': '#06b6d4', 'WF-110': '#ef4444' }

const mapStatus = (status) => {
  if (status === 'active') return 'running'
  if (status === 'inactive') return 'paused'
  return status || 'paused'
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{
        position: 'relative', width: '36px', height: '20px',
        borderRadius: '999px', border: 'none', cursor: 'pointer', padding: 0,
        background: checked ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.1)',
        boxShadow: checked ? '0 0 10px rgba(99,102,241,0.4)' : 'none', transition: 'all 0.2s'
      }}>
      <span style={{
        position: 'absolute', top: '2px', left: checked ? '18px' : '2px',
        width: '16px', height: '16px', borderRadius: '50%', background: 'white',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
      }} />
    </button>
  )
}

function StatusBadge({ status }) {
  const config = {
    running: { label: 'Running', color: '#22c55e' },
    paused:  { label: 'Paused',  color: '#94a3b8' },
    warning: { label: 'Warning', color: '#f59e0b' },
    failed:  { label: 'Failed',  color: '#ef4444' },
  }
  const s = config[status] || config.paused
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>{s.label}</span>
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
        .wf-card { transition: all 0.2s ease; }
        .wf-card:hover { border-color: rgba(99,102,241,0.4) !important; transform: translateY(-2px); }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Workflows" />

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0f1117', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
              <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
              Back to Dashboard
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span className="material-icons" style={{ color: '#6366f1', fontSize: '22px' }}>account_tree</span>
              Workflows
            </h1>
          </div>
          <button onClick={() => navigate('/editor/new')}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 0 15px rgba(99,102,241,0.3)' }}>
            + New Workflow
          </button>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* Popular Templates Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-icons" style={{ color: '#f59e0b', fontSize: '24px' }}>stars</span>
              TEMPLATES POPULARES
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Template 1: Data Processing */}
              <div onClick={() => navigate('/editor/new')}
                style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a1d27, #1e293b)', border: '1px solid rgba(245,158,11,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    📊
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>Data Processing</p>
                    <p style={{ fontSize: '11px', color: '#f59e0b', margin: '2px 0 0' }}>Popular</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', lineHeight: '1.4' }}>
                  Transform, clean, and analyze data with automated workflows
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '4px' }}>ETL</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '4px' }}>Analytics</span>
                </div>
              </div>

              {/* Template 2: AI Assistant */}
              <div onClick={() => navigate('/editor/new')}
                style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a1d27, #1e293b)', border: '1px solid rgba(168,85,247,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    🤖
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>AI Assistant</p>
                    <p style={{ fontSize: '11px', color: '#a855f7', margin: '2px 0 0' }}>Trending</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', lineHeight: '1.4' }}>
                  Intelligent automation with AI-powered decision making
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(168,85,247,0.1)', color: '#a855f7', borderRadius: '4px' }}>AI</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(168,85,247,0.1)', color: '#a855f7', borderRadius: '4px' }}>ML</span>
                </div>
              </div>

              {/* Template 3: Cloud Integration */}
              <div onClick={() => navigate('/editor/new')}
                style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a1d27, #1e293b)', border: '1px solid rgba(99,102,241,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    ☁️
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>Cloud Integration</p>
                    <p style={{ fontSize: '11px', color: '#6366f1', margin: '2px 0 0' }}>Essential</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', lineHeight: '1.4' }}>
                  Connect and sync with cloud services and APIs
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: '4px' }}>API</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: '4px' }}>Cloud</span>
                </div>
              </div>

              {/* Template 4: Database Automation */}
              <div onClick={() => navigate('/editor/new')}
                style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a1d27, #1e293b)', border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    🗄️
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>Database Automation</p>
                    <p style={{ fontSize: '11px', color: '#06b6d4', margin: '2px 0 0' }}>Advanced</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', lineHeight: '1.4' }}>
                  Automate database operations and data management
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', borderRadius: '4px' }}>SQL</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', borderRadius: '4px' }}>Database</span>
                </div>
              </div>

              {/* Template 5: Notification System */}
              <div onClick={() => navigate('/editor/new')}
                style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a1d27, #1e293b)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    📢
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>Notification System</p>
                    <p style={{ fontSize: '11px', color: '#ef4444', margin: '2px 0 0' }}>New</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', lineHeight: '1.4' }}>
                  Send notifications and alerts across multiple channels
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '4px' }}>Email</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '4px' }}>SMS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Your Workflows Section */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-icons" style={{ color: '#6366f1', fontSize: '24px' }}>account_tree</span>
              YOUR WORKFLOWS
            </h2>

          {workflows.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚀</div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>No workflows yet</h2>
              <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px' }}>Create your first workflow to get started</p>
              <button onClick={() => navigate('/editor/new')}
                style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
                Create First Workflow
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {workflows.map(wf => (
                <div key={wf.id} className="wf-card"
                  style={{ padding: '20px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
                  onClick={() => navigate(`/editor/${wf.id}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${WF_COLORS[wf.id] || '#6366f1'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        {WF_ICONS[wf.id] || '⚡'}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>{wf.name}</p>
                        <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#475569', margin: '2px 0 0' }}>#{wf.id}</p>
                      </div>
                    </div>
                    <Toggle checked={toggles[wf.id] || false} onChange={(e) => { e.stopPropagation(); toggleWorkflow(wf.id); }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <StatusBadge status={mapStatus(wf.status)} />
                    <span style={{ fontSize: '11px', color: '#475569' }}>
                      {wf.lastRun ? new Date(wf.lastRun).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                  <div style={{ marginTop: '10px', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px' }}>
                    <div style={{ height: '100%', width: `${Math.min((wf.executions || 0) / 5, 100)}%`, background: WF_COLORS[wf.id] || '#6366f1', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}

              {/* New Workflow Card */}
              <div onClick={() => navigate('/editor/new')}
                style={{ padding: '20px', borderRadius: '12px', background: '#1a1d27', border: '1px dashed rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '140px', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <span className="material-icons" style={{ color: '#6366f1' }}>add</span>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 4px' }}>Create New Workflow</p>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Orchestrate a new agent process</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  )
}
