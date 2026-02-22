import { useNavigate } from 'react-router-dom'
import Navigation from './Navigation.jsx'

export default function Sidebar({ activePage }) {
  const navigate = useNavigate()

  return (
    <aside style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0a0d13' }}>
      {/* Logo */}
      <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '50%', opacity: 0.2, filter: 'blur(6px)' }} />
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M12 36C12 30.4772 16.4772 26 22 26H26C31.5228 26 36 21.5228 36 16V12" stroke="url(#g1)" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="12" cy="36" r="3" fill="#6366f1"/>
              <circle cx="36" cy="12" r="3" fill="#06b6d4"/>
              <defs>
                <linearGradient id="g1" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '18px', letterSpacing: '-0.5px' }}>FLOWLY</span>
        </div>
      </div>

      {/* Navigation */}
      <Navigation activePage={activePage} />

      {/* User Section */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>SC</div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', margin: 0 }}>Sarah Connor</p>
            <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>Ops Lead</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
