import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as workflowsApi from '../api'
import { workflows } from '../api'
import Sidebar from '../components/Sidebar.jsx'

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

// Mapear status del backend al visual
const mapStatus = (status) => {
  if (status === 'active') return 'running'
  if (status === 'inactive') return 'paused'
  return status || 'paused'
}

// Funcion para verificar si el workflow esta activo
const isWorkflowActive = (wf, toggles) => {
  // Usar directamente el estado del workflow
  return wf.status === 'active'
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
    running: { label: 'Ejecutando', color: '#22c55e' },
    paused:  { label: 'Pausado',  color: '#94a3b8' },
    warning: { label: 'Advertencia', color: '#f59e0b' },
    failed:  { label: 'Error',  color: '#ef4444' },
  }
  const s = config[status] || config.paused
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>{s.label}</span>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [workflowsData, setWorkflowsData] = useState([])
  const [toggles, setToggles] = useState({})
  
  // Metricas dinamicas
  const [latency, setLatency] = useState(24)
  const [uptime, setUptime] = useState(99.99)

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

  // Activity Feed dinamico
const [activityLogs, setActivityLogs] = useState(LOGS)

// Simular nuevos eventos de actividad
useEffect(() => {
  const interval = setInterval(() => {
    const eventTypes = [
      { type: 'INFO', color: '#6366f1', messages: [
        "System heartbeat received. All systems operational.",
        "Cache cleared successfully. Memory usage optimized.",
        "Database connection pool refreshed.",
        "API rate limit reset. Ready for new requests.",
        "Security scan completed. No threats detected."
      ]},
      { type: 'OK', color: '#22c55e', messages: [
        "Workflow completed successfully.",
        "Data backup completed. All files secured.",
        "Health check passed. All services healthy.",
        "Task queue processed. No pending items.",
        "Authentication service updated. Security enhanced."
      ]},
      { type: 'WARN', color: '#f59e0b', messages: [
        "High CPU usage detected. Scaling initiated.",
        "Memory usage approaching threshold.",
        "Disk space running low. Cleanup recommended.",
        "API response time increased. Monitoring closely.",
        "Connection pool near capacity. Consider scaling."
      ]},
      { type: 'DEBUG', color: '#a855f7', messages: [
        "Garbage collection initiated for node.",
        "Cache invalidation processed.",
        "Session timeout check completed.",
        "Background task scheduler running.",
        "Metrics collection in progress."
      ]}
    ]
    
    // Elegir un tipo de evento aleatorio
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const message = eventType.messages[Math.floor(Math.random() * eventType.messages.length)]
    
    // Generar IDs de workflows aleatorios para los mensajes
    const workflowIds = ['WF-892', 'WF-104', 'WF-331', 'WF-552', 'WF-110']
    const randomWorkflowId = workflowIds[Math.floor(Math.random() * workflowIds.length)]
    
    // Reemplazar placeholders si existen
    const finalMessage = message
      .replace('#WF-892', `#${randomWorkflowId}`)
      .replace('node-04', `node-${Math.floor(Math.random() * 10) + 1}`)
      .replace('us-east-1', ['us-east-1', 'us-west-2', 'eu-west-1'][Math.floor(Math.random() * 3)])
    
    const newLog = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: eventType.type,
      color: eventType.color,
      msg: finalMessage,
      highlight: eventType.type === 'WARN'
    }
    
    // Agregar nuevo log al principio
    setActivityLogs(prev => [newLog, ...prev.slice(0, 9)]) // Mantener solo los últimos 10
    
  }, 5000) // Nuevo evento cada 5 segundos
  
  return () => clearInterval(interval)
}, [])

// Simular actualización de métricas
useEffect(() => {
  const interval = setInterval(() => {
    // Latencia: varia entre 15-35ms
    setLatency(Math.floor(Math.random() * 20) + 15)
    
    // Tiempo Activo: varia entre 99.95-99.99%
    setUptime((99.95 + Math.random() * 0.04).toFixed(2))
  }, 3000) // Actualizar cada 3 segundos
  
  return () => clearInterval(interval)
}, [])

// Agregar eventos de actividad cuando se realizan acciones
const addActivityLog = (type, message, highlight = false) => {
  const newLog = {
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type: type,
    color: type === 'INFO' ? '#6366f1' : type === 'OK' ? '#22c55e' : type === 'WARN' ? '#f59e0b' : type === 'DEBUG' ? '#a855f7' : '#ef4444',
    msg: message,
    highlight: highlight
  }
  setActivityLogs(prev => [newLog, ...prev.slice(0, 9)]) // Mantener solo los últimos 10
}

  const toggleWorkflow = async (id) => {
    const workflow = workflowsData.find(w => w.id === id)
    if (!workflow) {
      alert('Workflow no encontrado')
      return
    }
    
    const currentStatus = workflow.status
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    // Agregar log de actividad
    addActivityLog('INFO', `Workflow #${id} status changed to ${newStatus}`)
    
    try {
      // Actualizar en el backend
      const response = await workflows.update(id, { status: newStatus })
      
      // Actualizar estado local
      setWorkflowsData(prev => prev.map(w => 
        w.id === id ? { ...w, status: newStatus } : w
      ))
      
      // Actualizar toggles para mantener sincronización
      setToggles(prev => ({ ...prev, [id]: newStatus === 'active' }))
      
      // Agregar log de éxito
      addActivityLog('OK', `Workflow #${id} successfully updated to ${newStatus}`)
      
    } catch (err) {
      console.error('❌ Error updating workflow:', err)
      
      // Agregar log de error
      addActivityLog('WARN', `Failed to update workflow #${id}: ${err.message}`, true)
      
      // Mensajes específicos según el error
      if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        alert('Sin conexion a internet. Verifica tu conexion.')
      } else if (err.response?.status === 404) {
        alert('Workflow no encontrado. Recarga la pagina.')
      } else if (err.response?.status === 500) {
        alert('Error del servidor. Intenta de nuevo.')
      } else {
        alert('No se pudo cambiar el estado. Intenta de nuevo.')
      }
    }
  }

  const deleteWorkflow = async (id, e) => {
    e.stopPropagation() // Evitar que se abra el editor
    
    const confirmDelete = window.confirm(`¿Estas seguro de que quieres eliminar este workflow? Esta accion no se puede deshacer.`)
    
    if (!confirmDelete) return
    
    // Agregar log de actividad
    addActivityLog('INFO', `Attempting to delete workflow #${id}`)
    
    try {
      await workflows.delete(id)
      setWorkflowsData(prev => prev.filter(wf => wf.id !== id))
      setToggles(prev => {
        const newToggles = { ...prev }
        delete newToggles[id]
        return newToggles
      })
      
      // Agregar log de éxito
      addActivityLog('OK', `Workflow #${id} successfully deleted`)
    } catch (err) {
      console.error('Error eliminando workflow:', err)
      
      // Agregar log de error
      addActivityLog('WARN', `Failed to delete workflow #${id}: ${err.message}`, true)
      
      alert('Error al eliminar el workflow. Intenta nuevamente.')
    }
  }

  const activeCount = workflowsData.filter(w => w.status === 'active').length
  const totalExecutions = workflowsData.reduce((sum, w) => sum + (w.executions || 0), 0)
  const tokensSaved = totalExecutions * 100
  const throughput = activeCount * 50

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
        .wf-card { transition: all 0.2s ease; }
        .wf-card:hover { border-color: rgba(99,102,241,0.4) !important; transform: translateY(-2px); }
        .wf-card:hover .delete-btn { opacity: 1 !important; transform: scale(1) !important; }
        .wf-card:hover .edit-btn { opacity: 1 !important; transform: scale(1) !important; }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Dashboard" />

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>

        {/* Header */}
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0f1117', flexShrink: 0 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span className="material-icons" style={{ color: '#6366f1', fontSize: '22px' }}>grid_view</span>
            Command Center
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ color: '#475569' }}>Latencia</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontFamily: 'monospace', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />{latency}ms
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ color: '#475569' }}>Tiempo Activo</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7', fontFamily: 'monospace', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />{uptime}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ color: '#475569' }}>Requests</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#06b6d4', fontFamily: 'monospace', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }} />1.2k/s
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ color: '#475569' }}>Error Rate</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontFamily: 'monospace', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />0.01%
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', paddingBottom: '220px' }}>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Tokens Guardados', value: tokensSaved > 0 ? `${(tokensSaved/1000).toFixed(1)}K` : '0', unit: 'tokens totales', trend: totalExecutions > 0 ? `+${totalExecutions} ejecuciones` : '0 ejecuciones', progress: Math.min(tokensSaved / 100, 100), color: '#6366f1' },
              { label: 'Rendimiento', value: throughput.toString(), unit: 'req/s', trend: throughput > 0 ? '+4%' : '0%', progress: Math.min(throughput, 100), color: '#06b6d4' },
              { label: 'Total Workflows', value: workflowsData.length.toString(), unit: 'workflows', trend: workflowsData.length > 0 ? '+8%' : '0%', progress: Math.min(workflowsData.length * 10, 100), color: '#22c55e' },
            ].map(m => (
              <div key={m.label} style={{ padding: '24px', borderRadius: '12px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>{m.label}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>{m.trend}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>{m.value}</span>
                  <span style={{ fontSize: '13px', color: '#475569' }}>{m.unit}</span>
                </div>
                <div style={{ marginTop: '16px', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px' }}>
                  <div style={{ height: '100%', width: `${m.progress}%`, background: m.color, borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Workflows */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>Workflows Activos</h2>
          </div>

          {workflowsData.length === 0 ? (
  // Estado vacio
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
              {/* Logo principal */}
              <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '50%', opacity: 0.2, filter: 'blur(16px)' }} />
                <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
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
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Bienvenido a Flowly</h2>
              <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px' }}>Crea tu primer workflow para comenzar</p>
              <button onClick={() => navigate('/editor/new')}
                style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
                Crear Primer Workflow
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {workflowsData.map(wf => (
                <div key={wf.id} className="wf-card"
                  onClick={() => {
                    // Solo permitir entrar al editor si el workflow esta inactivo
                    if (!isWorkflowActive(wf, toggles)) {
                      navigate(`/editor/${wf.id}`)
                    } else {
                      alert('No puedes editar un workflow mientras esta activo. Pausa el workflow primero.')
                    }
                  }}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '12px', 
                    background: '#1a1d27', 
                    border: '1px solid rgba(255,255,255,0.06)', 
                    cursor: !isWorkflowActive(wf, toggles) ? 'pointer' : 'not-allowed',
                    position: 'relative',
                    opacity: isWorkflowActive(wf, toggles) ? 0.7 : 1
                  }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Evitar que se abra el editor
                          deleteWorkflow(wf.id, e)
                        }}
                        className="delete-btn"
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '16px', transition: 'all 0.2s',
                          opacity: 0, transform: 'scale(0.8)'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.2)'
                          e.currentTarget.style.opacity = '1'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                          e.currentTarget.style.opacity = '0'
                          e.currentTarget.style.transform = 'scale(0.8)'
                        }}
                        title="Eliminar workflow"
                      >
                        ×
                      </button>
                      
                      {/* Boton de Editar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Evitar que se abra el editor
                          // Solo permitir editar si esta inactivo
                          if (!isWorkflowActive(wf, toggles)) {
                            navigate(`/editor/${wf.id}`)
                          } else {
                            alert('No puedes editar un workflow mientras esta activo. Pausa el workflow primero.')
                          }
                        }}
                        className="edit-btn"
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                          color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '14px', transition: 'all 0.2s',
                          opacity: 0, transform: 'scale(0.8)'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(99,102,241,0.2)'
                          e.currentTarget.style.opacity = '1'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                          e.currentTarget.style.opacity = '0'
                          e.currentTarget.style.transform = 'scale(0.8)'
                        }}
                        title="Editar workflow"
                      >
                        ✏️
                      </button>
                      
                      {/* Toggle siempre funcional para pausar */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <Toggle checked={wf.status === 'active'} onChange={() => toggleWorkflow(wf.id)} />
                      </div>
                    </div>
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
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: '#0a0d13', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Activity Feed</h3>
          <div style={{ height: 'calc(100% - 28px)', overflowY: 'auto', fontSize: '12px', fontFamily: 'monospace' }}>
            {activityLogs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', opacity: log.highlight ? 1 : 0.7, background: log.highlight ? 'rgba(239,68,68,0.1)' : 'transparent', padding: '4px 8px', borderRadius: '4px' }}>
                <span style={{ color: '#475569', minWidth: '60px' }}>{log.time}</span>
                <span style={{ color: log.color, fontWeight: 600, minWidth: '50px' }}>{log.type}</span>
                <span style={{ color: '#cbd5e1', flex: 1 }}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
