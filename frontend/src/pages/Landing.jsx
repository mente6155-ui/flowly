import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .gradient-text { background: linear-gradient(135deg, #6366f1, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gradient-bg { background: linear-gradient(135deg, #6366f1, #06b6d4); }
        .glow { box-shadow: 0 0 20px rgba(99,102,241,0.4); }
        .glow:hover { box-shadow: 0 0 35px rgba(99,102,241,0.6); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-8px); border-color: rgba(99,102,241,0.5) !important; }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        .ping { animation: ping 1.5s infinite; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(15,17,23,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '50%', opacity: 0.2, filter: 'blur(8px)' }} />
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
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
            <span style={{ color: 'white', fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px' }}>FLOWLY</span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '40px' }}>
            {['Platform', 'Solutions', 'Developers', 'Pricing'].map(link => (
              <a key={link} href="#" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >{link}</a>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/login')}
              style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', padding: '8px 20px' }}>
              Sign In
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="gradient-bg glow"
              style={{ color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', padding: '10px 24px', borderRadius: '8px', border: 'none', transition: 'all 0.2s' }}>
              Launch Your Swarm
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', paddingTop: '180px', paddingBottom: '120px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Glows */}
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '400px', height: '400px', background: 'rgba(99,102,241,0.15)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: '350px', height: '350px', background: 'rgba(6,182,212,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)', marginBottom: '32px' }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
              <span className="ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#6366f1', opacity: 0.75 }} />
              <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            </span>
            <span style={{ color: '#6366f1', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Now in Private Beta</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-2px' }}>
            Orchestrate <span className="gradient-text">Intelligence</span>,<br/>Not Just Data
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.7 }}>
            The next-generation framework for deploying, managing, and scaling autonomous AI agent swarms with surgical precision.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard')}
              className="gradient-bg glow"
              style={{ color: 'white', fontWeight: 700, fontSize: '18px', cursor: 'pointer', padding: '16px 40px', borderRadius: '12px', border: 'none', transition: 'all 0.2s' }}>
              Launch Your Swarm
            </button>
            <button
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, fontSize: '18px', cursor: 'pointer', padding: '16px 40px', borderRadius: '12px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* ── AI-FIRST SWARMS ── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ color: '#6366f1', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Autonomous Capability</p>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: 'white' }}>AI-First Swarms</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '500px', marginTop: '16px', lineHeight: 1.6 }}>
              Unlock collective intelligence with autonomous task execution across multi-agent networks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { icon: '🌐', title: 'Autonomous Coordination', desc: 'Agents communicate and collaborate across high-speed mesh networks without manual triggers or bottlenecks.', progress: 66 },
              { icon: '🧠', title: 'Swarm Intelligence', desc: 'Emergent problem-solving through distributed agent nodes that share memory and state across the cluster.', progress: 50 },
              { icon: '🚀', title: 'Rapid Scaling', desc: 'Deploy thousands of specialized agents in seconds. From localized tasks to enterprise-wide operations.', progress: 80 },
            ].map((card) => (
              <div key={card.title} className="card-hover"
                style={{ padding: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                <div style={{ fontSize: '40px', marginBottom: '24px' }}>{card.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>{card.title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '14px', marginBottom: '24px' }}>{card.desc}</p>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div className="gradient-bg" style={{ height: '100%', width: `${card.progress}%`, borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HUMAN IN THE LOOP ── */}
      <section style={{ padding: '96px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#06b6d4', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Oversight & Safety</p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: 'white', marginBottom: '24px' }}>Human-in-the-Loop</h2>
            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '40px' }}>
              Maintain absolute precision with integrated oversight. Set manual intervention points where critical decisions require human validation before proceeding.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { icon: '👆', title: 'Pause & Approve', desc: 'Integrated approval gates for high-stakes decisions.' },
                { icon: '👁️', title: 'Real-time Oversight', desc: 'Monitor reasoning chains and live logs as agents work.' },
                { icon: '🎛️', title: 'Manual Overrides', desc: 'Step into any workflow to provide direct human guidance.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', fontSize: '20px', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: '#151921', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {['Phase 1: Market Analysis Complete', 'Phase 2: Strategy Drafting Complete'].map(phase => (
                  <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#22c55e', fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#cbd5e1' }}>{phase}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)', animation: 'pulse 2s infinite' }}>
                  <span style={{ fontSize: '16px' }}>⏳</span>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'white' }}>Phase 3: Pending Human Approval...</span>
                </div>
              </div>
              <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.08)', textAlign: 'center' }}>
                <p style={{ color: 'white', fontWeight: 700, marginBottom: '16px' }}>Authorize Executive Action?</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="gradient-bg" style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                  <button style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECS ── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: '48px' }}>Built for High-Performance Swarms</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { icon: '⚡', title: 'Sub-10ms Latency', desc: 'Optimized protocols for instant agent feedback loops.' },
              { icon: '🔒', title: 'SOC2 Type II', desc: 'Enterprise-grade security baked into the architecture.' },
              { icon: '🔧', title: 'SDK Ready', desc: 'Python, Rust, and Go libraries for seamless integration.' },
              { icon: '🗄️', title: 'Vector Native', desc: 'Integrated vector storage for long-term agent memory.' },
            ].map(spec => (
              <div key={spec.title}
                style={{ padding: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{spec.icon}</div>
                <h3 style={{ color: 'white', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{spec.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: 'white', marginBottom: '24px' }}>Ready to evolve your automation?</h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '48px', lineHeight: 1.6 }}>
            Join the waitlist for Flowly Enterprise and start building the future of distributed intelligence.
          </p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard')}
              className="gradient-bg glow"
              style={{ color: 'white', fontWeight: 700, fontSize: '18px', cursor: 'pointer', padding: '20px 48px', borderRadius: '12px', border: 'none', transition: 'all 0.2s' }}>
              Launch Your Swarm
            </button>
            <button
              style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 700, fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Talk to an Expert →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'white', fontWeight: 900, letterSpacing: '-0.5px' }}>FLOWLY</span>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Twitter', 'GitHub', 'Documentation', 'Privacy'].map(link => (
              <a key={link} href="#" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
              >{link}</a>
            ))}
          </div>
          <p style={{ color: '#475569', fontSize: '14px' }}>© 2025 Flowly Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
