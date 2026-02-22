import { useNavigate } from 'react-router-dom'

export default function Navigation({ activePage }) {
  const navigate = useNavigate()

  const navigationItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'account_tree', label: 'Workflows', route: '/workflows' },
    { icon: 'smart_toy', label: 'Agents', route: '/agents' },
    { icon: 'bar_chart', label: 'Analytics', route: '/analytics' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ]

  return (
    <nav style={{ flex: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {navigationItems.map(item => (
        <button key={item.label} className="nav-btn" onClick={() => navigate(item.route)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 500, textAlign: 'left', transition: 'all 0.2s',
            border: activePage === item.label ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
            background: activePage === item.label ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: activePage === item.label ? '#6366f1' : '#64748b',
          }}>
          <span className="material-icons" style={{ fontSize: '20px' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
