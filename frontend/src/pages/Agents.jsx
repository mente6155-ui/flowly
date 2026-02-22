import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

const AGENT_CATEGORIES = [
  {
    name: 'Data Processing',
    icon: 'storage',
    color: '#6366f1',
    agents: [
      { name: 'Data Cleaner', description: 'Automated data cleaning and validation', status: 'available' },
      { name: 'ETL Pipeline', description: 'Extract, transform, load operations', status: 'available' },
      { name: 'Data Validator', description: 'Schema validation and quality checks', status: 'coming-soon' }
    ]
  },
  {
    name: 'Communication',
    icon: 'chat',
    color: '#22c55e',
    agents: [
      { name: 'Email Assistant', description: 'Smart email processing and replies', status: 'available' },
      { name: 'Chat Bot', description: 'Customer service automation', status: 'available' },
      { name: 'SMS Notifier', description: 'SMS alerts and notifications', status: 'coming-soon' }
    ]
  },
  {
    name: 'Analytics',
    icon: 'insights',
    color: '#06b6d4',
    agents: [
      { name: 'Report Generator', description: 'Automated report creation', status: 'available' },
      { name: 'Trend Analyzer', description: 'Pattern detection and analysis', status: 'coming-soon' },
      { name: 'Forecast Engine', description: 'Predictive analytics', status: 'coming-soon' }
    ]
  },
  {
    name: 'Integration',
    icon: 'hub',
    color: '#a855f7',
    agents: [
      { name: 'API Connector', description: 'Third-party API integration', status: 'available' },
      { name: 'Webhook Handler', description: 'Webhook processing and routing', status: 'available' },
      { name: 'Database Sync', description: 'Multi-database synchronization', status: 'coming-soon' }
    ]
  }
]

function StatusBadge({ status }) {
  const config = {
    available: { label: 'Available', color: '#22c55e' },
    'coming-soon': { label: 'Coming Soon', color: '#f59e0b' },
    beta: { label: 'Beta', color: '#06b6d4' }
  }
  const s = config[status] || config['coming-soon']
  return (
    <span style={{ 
      fontSize: '11px', 
      fontWeight: 600, 
      padding: '3px 8px', 
      borderRadius: '4px', 
      background: `${s.color}15`, 
      color: s.color,
      border: `1px solid ${s.color}30`
    }}>
      {s.label}
    </span>
  )
}

export default function Agents() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
        .agent-card { transition: all 0.2s ease; }
        .agent-card:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.3) !important; }
        .category-card { transition: all 0.2s ease; }
        .category-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Agents" />

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0f1117', flexShrink: 0 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span className="material-icons" style={{ color: '#6366f1', fontSize: '22px' }}>smart_toy</span>
            Agents
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
              <span className="material-icons" style={{ fontSize: '18px', marginRight: '8px', verticalAlign: 'middle' }}>filter_list</span>
              Filter
            </button>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
              <span className="material-icons" style={{ fontSize: '18px', marginRight: '8px', verticalAlign: 'middle' }}>search</span>
              Search
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* Coming Soon Banner */}
          <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-icons" style={{ color: '#6366f1', fontSize: '24px' }}>rocket_launch</span>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: '0 0 4px' }}>Coming soon - Agent marketplace</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Discover and deploy pre-built agents for your workflows. Full marketplace launching next month.</p>
            </div>
          </div>

          {/* Agent Categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {AGENT_CATEGORIES.map(category => (
              <div key={category.name} className="category-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${category.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-icons" style={{ color: category.color, fontSize: '20px' }}>{category.icon}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>{category.name}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>{category.agents.length} agents</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {category.agents.map(agent => (
                    <div key={agent.name} className="agent-card" style={{ 
                      padding: '16px', 
                      borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.04)',
                      cursor: agent.status === 'available' ? 'pointer' : 'default',
                      opacity: agent.status === 'coming-soon' ? 0.7 : 1
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>{agent.name}</h4>
                        <StatusBadge status={agent.status} />
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>{agent.description}</p>
                      {agent.status === 'available' && (
                        <button style={{ 
                          marginTop: '12px', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          border: '1px solid rgba(99,102,241,0.3)', 
                          background: 'rgba(99,102,241,0.1)', 
                          color: '#6366f1', 
                          fontSize: '12px', 
                          fontWeight: 500, 
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}>
                          Use Agent
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Agent Section */}
          <div style={{ marginTop: '40px', padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons" style={{ color: '#f59e0b', fontSize: '20px' }}>build</span>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>Build Custom Agents</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Create your own specialized agents</p>
              </div>
            </div>
            <button style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)', 
              color: 'white', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(245,158,11,0.3)'
            }}>
              <span className="material-icons" style={{ fontSize: '18px', marginRight: '8px', verticalAlign: 'middle' }}>add</span>
              Create Custom Agent
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
