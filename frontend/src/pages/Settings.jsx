import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

export default function Settings() {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Connor',
    email: 'sarah.connor@flowly.com',
    role: 'Ops Lead',
    company: 'Flowly Inc.',
    timezone: 'UTC-03:00'
  })
  
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API', key: 'sk-prod-••••••••••••••••••••••••••••••••', created: '2024-01-15', lastUsed: '2024-02-14' },
    { id: '2', name: 'Development API', key: 'sk-dev-••••••••••••••••••••••••••••••••', created: '2024-01-20', lastUsed: '2024-02-10' }
  ])

  const handleLogout = () => {
    localStorage.removeItem('flowly_token')
    navigate('/login')
  }

  const handleProfileUpdate = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `sk-${Math.random().toString(36).substring(2, 15)}••••••••••••••••••••••••••••••••`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    }
    setApiKeys(prev => [...prev, newKey])
  }

  const handleDeleteApiKey = (id) => {
    setApiKeys(prev => prev.filter(key => key.id !== id))
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
        .settings-card { transition: all 0.2s ease; }
        .settings-card:hover { border-color: rgba(99,102,241,0.3) !important; }
        .btn-primary { transition: all 0.2s ease; }
        .btn-primary:hover { transform: translateY(-1px); }
        .btn-danger { transition: all 0.2s ease; }
        .btn-danger:hover { background: #dc2626 !important; }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Settings" />

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0f1117', flexShrink: 0 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span className="material-icons" style={{ color: '#6366f1', fontSize: '22px' }}>settings</span>
            Settings
          </h1>
          <button 
            onClick={handleLogout}
            className="btn-danger"
            style={{ 
              padding: '8px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              background: '#ef4444', 
              color: 'white', 
              fontWeight: 600, 
              fontSize: '13px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
            <span className="material-icons" style={{ fontSize: '18px' }}>logout</span>
            Sign Out
          </button>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* Profile Section */}
          <div className="settings-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons" style={{ color: '#6366f1', fontSize: '20px' }}>person</span>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>User Profile</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Manage your account information</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(255,255,255,0.02)', 
                    color: 'white', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(255,255,255,0.02)', 
                    color: 'white', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Role</label>
                <input
                  type="text"
                  value={userProfile.role}
                  onChange={(e) => handleProfileUpdate('role', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(255,255,255,0.02)', 
                    color: 'white', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Company</label>
                <input
                  type="text"
                  value={userProfile.company}
                  onChange={(e) => handleProfileUpdate('company', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(255,255,255,0.02)', 
                    color: 'white', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Timezone</label>
                <select
                  value={userProfile.timezone}
                  onChange={(e) => handleProfileUpdate('timezone', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(255,255,255,0.02)', 
                    color: 'white', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="UTC-03:00">UTC-03:00</option>
                  <option value="UTC-02:00">UTC-02:00</option>
                  <option value="UTC-01:00">UTC-01:00</option>
                  <option value="UTC+00:00">UTC+00:00</option>
                  <option value="UTC+01:00">UTC+01:00</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button className="btn-primary" style={{ 
                padding: '8px 20px', 
                borderRadius: '8px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)', 
                color: 'white', 
                fontWeight: 600, 
                fontSize: '13px', 
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(99,102,241,0.3)'
              }}>
                Save Changes
              </button>
              <button style={{ 
                padding: '8px 20px', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'transparent', 
                color: '#64748b', 
                fontWeight: 600, 
                fontSize: '13px', 
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="settings-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons" style={{ color: '#22c55e', fontSize: '20px' }}>vpn_key</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>API Keys</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Manage your API access tokens</p>
                </div>
              </div>
              <button 
                onClick={handleCreateApiKey}
                className="btn-primary"
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, #22c55e, #06b6d4)', 
                  color: 'white', 
                  fontWeight: 600, 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <span className="material-icons" style={{ fontSize: '16px' }}>add</span>
                Create Key
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {apiKeys.map(key => (
                <div key={key.id} style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>{key.name}</h4>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 500, 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        background: 'rgba(99,102,241,0.1)', 
                        color: '#6366f1' 
                      }}>
                        {key.lastUsed === 'Never' ? 'Never used' : `Last used: ${key.lastUsed}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                      <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>{key.key}</code>
                      <span>Created: {key.created}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteApiKey(key.id)}
                    className="btn-danger"
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      border: 'none', 
                      background: 'rgba(239,68,68,0.1)', 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                    <span className="material-icons" style={{ fontSize: '14px' }}>delete</span>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-card" style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons" style={{ color: '#ef4444', fontSize: '20px' }}>warning</span>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>Danger Zone</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Irreversible actions</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ 
                padding: '16px', 
                borderRadius: '8px', 
                background: 'rgba(239,68,68,0.05)', 
                border: '1px solid rgba(239,68,68,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 4px' }}>Delete Account</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Permanently delete your account and all data</p>
                </div>
                <button className="btn-danger" style={{ 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid #ef4444', 
                  background: 'transparent', 
                  color: '#ef4444', 
                  fontWeight: 600, 
                  fontSize: '13px', 
                  cursor: 'pointer'
                }}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
