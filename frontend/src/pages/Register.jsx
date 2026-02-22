import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../api/index.js'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirm) {
      setError('Por favor completá todos los campos.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await auth.register(name, email, password)
      localStorage.setItem('flowly_token', response.token)
      localStorage.setItem('flowly_user', JSON.stringify(response.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        .ping { animation: ping 1.5s infinite; }
        .input-field:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; }
        .register-btn:hover { box-shadow: 0 0 30px rgba(99,102,241,0.5) !important; transform: translateY(-1px); }
        .register-btn { transition: all 0.2s !important; }
        .social-btn:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.15) !important; }
        .social-btn { transition: all 0.2s !important; }
      `}</style>

      {/* Glows de fondo */}
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: '400px', height: '400px', background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '350px', height: '350px', background: 'rgba(6,182,212,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '420px', padding: '40px', borderRadius: '20px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <span style={{ color: 'white', fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px' }}>FLOWLY</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>Crear cuenta gratis</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, textAlign: 'center' }}>Empezá a orquestar inteligencia hoy</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
              className="input-field"
              style={{ width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              className="input-field"
              style={{ width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="input-field"
              style={{ width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Confirmar contraseña</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repetí tu contraseña"
              className="input-field"
              style={{ width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
            />
          </div>

          {/* Botón */}
          <button type="submit" disabled={loading} className="register-btn"
            style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: 'white', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, boxShadow: '0 0 20px rgba(99,102,241,0.35)', marginTop: '4px' }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>O continuá con</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="social-btn"
            style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="social-btn"
            style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Login link */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '24px', marginBottom: 0 }}>
          ¿Ya tenés cuenta?{' '}
          <span onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.color = '#06b6d4'}
            onMouseLeave={e => e.target.style.color = '#6366f1'}>
            Iniciar sesión
          </span>
        </p>
      </div>

      {/* Badge abajo */}
      <div style={{ position: 'absolute', bottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
          <span className="ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e', opacity: 0.75 }} />
          <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
        </span>
        <span style={{ fontSize: '12px', color: '#475569' }}>Gratis para siempre · Sin tarjeta de crédito</span>
      </div>
    </div>
  )
}
