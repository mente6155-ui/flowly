import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
  SelectionMode,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { workflows as workflowsApi } from '../api/index.js'

const INDIGO = '#6366f1'
const CYAN = '#06b6d4'
const PURPLE = '#a855f7'
const GRID_SIZE = 20 // Tamaño de la cuadrícula para snap

// Sistema de temas
const THEMES = {
  dark: {
    background: '#0f1117',
    sidebar: '#0a0d13',
    card: '#1a1d27',
    border: 'rgba(255,255,255,0.06)',
    text: '#cbd5e1',
    textSecondary: '#64748b',
    textMuted: '#475569',
    input: '#0f1117',
    hover: 'rgba(255,255,255,0.05)',
    accent: INDIGO
  },
  light: {
    background: '#ffffff',
    sidebar: '#f8fafc',
    card: '#ffffff',
    border: 'rgba(0,0,0,0.06)',
    text: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    input: '#f1f5f9',
    hover: 'rgba(0,0,0,0.05)',
    accent: INDIGO
  }
}

// Templates predefinidos de workflows
const WORKFLOW_TEMPLATES = [
  {
    id: 'email-automation',
    name: 'Automatización de Email',
    description: 'Enviar email automáticamente cuando se recibe un webhook',
    icon: '📧',
    category: 'Marketing',
    nodes: [
      {
        id: 'trigger_1',
        position: { x: 100, y: 100 },
        data: { title: 'Webhook', kind: 'trigger', icon: '⚡' }
      },
      {
        id: 'action_1',
        position: { x: 300, y: 100 },
        data: { title: 'Enviar Email', kind: 'action', icon: '📤' }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger_1', target: 'action_1' }
    ]
  },
  {
    id: 'data-sync',
    name: 'Sincronización de Datos',
    description: 'Sincronizar datos entre Google Sheets y HubSpot',
    icon: '🔄',
    category: 'Integración',
    nodes: [
      {
        id: 'trigger_1',
        position: { x: 100, y: 100 },
        data: { title: 'Schedule', kind: 'trigger', icon: '🕐' }
      },
      {
        id: 'action_1',
        position: { x: 300, y: 50 },
        data: { title: 'Google Sheets', kind: 'action', icon: '📊' }
      },
      {
        id: 'action_2',
        position: { x: 300, y: 150 },
        data: { title: 'HubSpot Lead', kind: 'trigger', icon: '🎯' }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger_1', target: 'action_1' },
      { id: 'e2', source: 'trigger_1', target: 'action_2' }
    ]
  },
  {
    id: 'ai-analysis',
    name: 'Análisis con IA',
    description: 'Analizar datos con GPT-4 y guardar resultados',
    icon: '🤖',
    category: 'IA',
    nodes: [
      {
        id: 'trigger_1',
        position: { x: 100, y: 100 },
        data: { title: 'Email Recibido', kind: 'trigger', icon: '📧' }
      },
      {
        id: 'action_1',
        position: { x: 300, y: 100 },
        data: { title: 'GPT-4 Analysis', kind: 'action', icon: '🤖' }
      },
      {
        id: 'action_2',
        position: { x: 500, y: 100 },
        data: { title: 'Google Sheets', kind: 'action', icon: '📊' }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger_1', target: 'action_1' },
      { id: 'e2', source: 'action_1', target: 'action_2' }
    ]
  }
]

// Función para alinear a la cuadrícula
const snapToGrid = (position) => ({
  x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
})

const NODE_LIBRARY = [
  {
    group: 'TRIGGERS',
    items: [
      { title: 'Webhook', desc: 'Recibe datos via HTTP', icon: '⚡', kind: 'trigger' },
      { title: 'Schedule', desc: 'Cron automático', icon: '🕐', kind: 'trigger' },
      { title: 'HubSpot Lead', desc: 'Nuevo contacto', icon: '🎯', kind: 'trigger' },
      { title: 'Email Recibido', desc: 'Bandeja de entrada', icon: '📧', kind: 'trigger' },
    ],
  },
  {
    group: 'ACTIONS',
    items: [
      { title: 'Enviar Email', desc: 'Gmail / SMTP', icon: '📤', kind: 'action' },
      { title: 'Slack Message', desc: 'Notificación', icon: '💬', kind: 'action' },
      { title: 'HTTP Request', desc: 'Llamada API', icon: '🌐', kind: 'action' },
      { title: 'Google Sheets', desc: 'Leer / escribir', icon: '📊', kind: 'action' },
      { title: 'GPT-4 Analysis', desc: 'IA generativa', icon: '🤖', kind: 'action' },
    ],
  },
  {
    group: 'LOGIC',
    items: [
      { title: 'Condición IF', desc: 'Bifurcación lógica', icon: '🔀', kind: 'logic' },
      { title: 'Delay', desc: 'Esperar X tiempo', icon: '⏳', kind: 'logic' },
      { title: 'Aprobación Manual', desc: 'Human-in-the-loop', icon: '✋', kind: 'logic' },
    ],
  },
]

const INITIAL_LOGS = [
  { time: '14:20:01', type: 'Trigger', color: INDIGO, msg: 'Webhook recibido via Endpoint-04' },
  { time: '14:20:01', type: 'INFO', color: '#94a3b8', msg: 'Validando HMAC signatures... OK' },
  { time: '14:20:02', type: 'Action', color: CYAN, msg: 'Ejecutando nodo Send Email' },
  { time: '14:20:02', type: 'DATA', color: PURPLE, msg: 'Mapping user data {id: "921"}' },
  { time: '14:20:03', type: 'DB', color: '#22c55e', msg: 'DB Update: shard-us-east-1' },
]

const makeId = () => `n_${Math.random().toString(16).slice(2, 9)}`

const getNodeStyle = (kind) => {
  const map = {
    trigger: { border: `1px solid ${INDIGO}55`, accent: INDIGO, badge: 'Trigger', badgeColor: '#c7d2fe' },
    action:  { border: `1px solid ${CYAN}55`,   accent: CYAN,   badge: 'Action',  badgeColor: '#a5f3fc' },
    logic:   { border: `1px solid ${PURPLE}55`, accent: PURPLE, badge: 'Logic',   badgeColor: '#e9d5ff' },
  }
  return map[kind] || map.action
}

// ── NodeContent ───────────────────────────────────────
function NodeContent({ title, kind, icon, onDelete }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const s = getNodeStyle(kind)
  
  const getTooltipContent = () => {
    const descriptions = {
      trigger: 'Este nodo inicia el workflow cuando ocurre un evento específico.',
      action: 'Este nodo ejecuta una acción específica dentro del workflow.',
      logic: 'Este nodo controla el flujo y la lógica de decisión.'
    }
    
    return (
      <div style={{ padding: '8px', maxWidth: '200px' }}>
        <div style={{ fontWeight: 600, marginBottom: '4px', color: '#f1f5f9' }}>
          {title}
        </div>
        <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.3 }}>
          {descriptions[kind] || 'Nodo de workflow'}
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: '#64748b' }}>
          <strong>Atajos:</strong><br/>
          • Click para seleccionar<br/>
          • Arrastrar para mover<br/>
          • Ctrl+Click para selección múltiple<br/>
          • Delete para eliminar
        </div>
      </div>
    )
  }
  
  return (
    <div
      style={{
        position: 'relative',
        padding: '8px 12px',
        background: 'transparent',
        borderRadius: '8px',
        cursor: 'pointer'
      }}
      onMouseEnter={() => {
        setIsHovered(true)
        setShowTooltip(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setTimeout(() => setShowTooltip(false), 100)
      }}
    >
      {/* Botón flotante de eliminar */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid #1a1d27',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(239,68,68,0.4)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#dc2626'
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ef4444'
            e.currentTarget.style.transform = 'scale(1)'
          }}
          title="Eliminar nodo"
        >
          ×
        </button>
      )}
      
      {/* Tooltip flotante */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            background: '#1a1d27',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1001,
            minWidth: '200px',
            fontSize: '11px'
          }}
        >
          {getTooltipContent()}
          {/* Flecha del tooltip */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1a1d27',
              marginTop: '-1px'
            }}
          />
        </div>
      )}
      
      {/* Contenido del nodo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#f1f5f9' }}>
          {title}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: `${s.accent}20`, border: `1px solid ${s.accent}40`, color: s.badgeColor, flexShrink: 0 }}>
          {s.badge}
        </span>
      </div>
      <div style={{ marginTop: '10px', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px' }}>
        <div style={{ height: '100%', width: '65%', background: s.accent, borderRadius: '999px' }} />
      </div>
    </div>
  )
}

// ── FlowCanvas ─────────────────────────────────────────
function FlowCanvas({ setLogs, nodesRef, edgesRef, nodes, setNodes, edges, setEdges }) {
  const wrapperRef = useRef(null)
  const { screenToFlowPosition, getNodes } = useReactFlow()

  // ── Hooks primero ──
  const [internalNodes, setInternalNodes, onNodesChange] = useNodesState([])
  const [internalEdges, setInternalEdges, onEdgesChange] = useEdgesState([])

  // ── useEffect para inicializar con datos cargados ──
  useEffect(() => {
    // FORZAR LIMPIEZA SI NO HAY DATOS EXTERNOS
    if (!nodes || nodes.length === 0) {
      setInternalNodes([])
      setInternalEdges([])
      return
    }
    
    // Cargar datos externos solo si son diferentes
    if (JSON.stringify(internalNodes) !== JSON.stringify(nodes)) {
      setInternalNodes(nodes)
    }
    
    if (JSON.stringify(internalEdges) !== JSON.stringify(edges)) {
      setInternalEdges(edges)
    }
  }, [nodes, edges])

  // ── useEffect para sincronizar estado ──
  useEffect(() => {
    // Actualizar refs
    nodesRef.current = internalNodes
    edgesRef.current = internalEdges
    
    // Auto-guardar en localStorage cuando cambian los nodos
    if (internalNodes.length > 0) {
      const cleanNodes = internalNodes.map(node => ({
        id: node.id,
        position: node.position,
        data: {
          title: node.data?.title || 'Node',
          kind: node.data?.kind || 'action',
          icon: node.data?.icon || '⚡'
        },
        style: node.style
      }))
      
      // Obtener el ID del workflow actual
      const pathParts = window.location.pathname.split('/')
      const workflowId = pathParts[pathParts.length - 1]
      
      // Solo auto-guardar si tenemos un ID válido y no es 'new'
      if (workflowId && workflowId !== 'new' && workflowId !== 'editor') {
        // Obtener el nombre del workflow del estado del componente
        const workflowName = name || 'Workflow'
        
        const dataToSave = {
          name: workflowName,
          nodes: cleanNodes,
          edges: internalEdges
        }
        
        // Guardar con validación de localStorage
        try {
          localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(dataToSave))
        } catch (storageError) {
          console.warn('⚠️ Error guardando en localStorage (posible quota excedida):', storageError.message)
          setLogs(prev => [{
            time: new Date().toLocaleTimeString('en', { hour12: false }),
            type: 'WARN', color: '#f59e0b',
            msg: 'No se pudo auto-guardar localmente (espacio insuficiente)'
          }, ...prev])
        }
      }
    }
  }, [internalNodes, internalEdges])

  // ── Funciones después de los hooks ──
  const removeNode = useCallback((nodeId) => {
    // Usar la función de onNodesChange de ReactFlow para eliminar
    setInternalNodes((nds) => {
      const newNodes = nds.filter((n) => n.id !== nodeId)
      return newNodes
    })
  }, [])

  const createNode = useCallback((title, kind, icon, position, nodeId) => {
    const s = getNodeStyle(kind)
    return {
      id: nodeId,
      position,
      data: {
        title,
        kind,
        icon,
        label: (
          <NodeContent
            title={title}
            kind={kind}
            icon={icon}
            onDelete={() => {
              removeNode(nodeId)
            }}
          />
        ),
      },
      style: {
        borderRadius: '12px', padding: '2px',
        border: s.border, background: '#1a1d27',
        color: '#f1f5f9', boxShadow: `0 0 20px ${s.accent}15`,
      },
    }
  }, [removeNode])

  const onConnect = useCallback(
    (params) => setInternalEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: INDIGO, strokeWidth: 2 },
    }, eds)),
    [setInternalEdges]
  )

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/flowly')
    if (!raw) return
    let payload
    try { payload = JSON.parse(raw) } catch { return }
    const bounds = wrapperRef.current?.getBoundingClientRect()
    if (!bounds) return
    const position = screenToFlowPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
    const nodeId = makeId()
    const newNode = createNode(payload.title, payload.kind, payload.icon, snapToGrid(position), nodeId)
    setInternalNodes((nds) => [...nds, newNode])
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('es', { hour12: false }),
      type: 'ADD', color: getNodeStyle(payload.kind).accent,
      msg: `Nodo añadido: ${payload.title}`,
    }, ...prev])
  }, [screenToFlowPosition, setInternalNodes, createNode, setLogs])

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={internalNodes}
        edges={internalEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        deleteKeyCode="Delete"
        selectionMode={SelectionMode.Partial} // Permitir selección múltiple
        multiSelectionKeyCode="Control" // Ctrl+click para selección múltiple
        panOnDrag={true}
        selectionOnDrag={true}
        snapToGrid={true} // Activar snap a cuadrícula
        snapGrid={[GRID_SIZE, GRID_SIZE]} // Tamaño de la cuadrícula
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitView
        zoomOnScroll={true} // Activar zoom con rueda del mouse
        zoomOnDoubleClick={true} // Zoom con doble clic
        panOnScroll={false} // No hacer pan con scroll, solo zoom
        minZoom={0.1} // Zoom mínimo
        maxZoom={4} // Zoom máximo
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="rgba(255,255,255,0.04)" 
          gap={GRID_SIZE} 
          size={1}
          variant="dots" // Mostrar puntos de la cuadrícula
        />
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-left"
          style={{ 
            background: '#1a1d27', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '8px' 
          }}
        />
        <MiniMap 
          nodeColor={() => INDIGO} 
          maskColor="rgba(15,17,23,0.6)" 
          pannable 
          zoomable 
          position="bottom-right"
          style={{ 
            background: '#1a1d27', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '8px' 
          }}
        />
      </ReactFlow>
    </div>
  )
}

// ── Componente Principal ───────────────────────────────
export default function WorkflowEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState(`Workflow ${id ?? 'nuevo'}`)
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const [copilotMsg, setCopilotMsg] = useState('')
  const [copilotLoading, setCopilotLoading] = useState(false)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const nodesRef = useRef([])
  const edgesRef = useRef([])
  const [chat, setChat] = useState([
    { from: 'ai', text: 'Hola 👋 Soy tu AI Copilot. Describí el flujo que querés crear y lo genero automáticamente.' }
  ])

  // Sistema de deshacer/rehacer
  const [history, setHistory] = useState({ nodes: [], edges: [] })
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [copiedNodes, setCopiedNodes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('components') // 'components' o 'templates'
  const [activeRightTab, setActiveRightTab] = useState('logs') // 'logs', 'copilot' o 'variables'
  const [theme, setTheme] = useState('dark') // 'dark' o 'light'
  
  // Obtener colores del tema actual
  const currentTheme = THEMES[theme]
  
  // Sistema de variables globales (declarado antes de su uso)
  const [globalVariables, setGlobalVariables] = useState([
    { id: 'user_email', name: 'user_email', value: 'ejemplo@email.com', type: 'string', description: 'Email del usuario' },
    { id: 'api_key', name: 'api_key', value: 'sk-1234567890', type: 'string', description: 'Clave API externa' },
    { id: 'workflow_count', name: 'workflow_count', value: 0, type: 'number', description: 'Contador de ejecuciones' }
  ])
  const [showVariablesPanel, setShowVariablesPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(true) // Controlar visibilidad del panel derecho
  
  // Sistema de exportación/importación
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('json')
  const [importFile, setImportFile] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Sistema de backup en la nube
  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(true)
  const [lastBackup, setLastBackup] = useState(null)
  const [backupStatus, setBackupStatus] = useState('idle') // 'idle', 'saving', 'success', 'error'
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [backupHistory, setBackupHistory] = useState([])

  // Sistema de Share Links para colaboración
  const [shareLink, setShareLink] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareSettings, setShareSettings] = useState({
    allowEdit: false,
    allowComments: true,
    expiresAt: null,
    password: '',
    viewCount: 0,
    maxViews: null
  })
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)
  const [sharedWorkflows, setSharedWorkflows] = useState([])

  // Sistema de Templates Gallery
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [templateSearch, setTemplateSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false)

  // Templates predefinidos
  const WORKFLOW_TEMPLATES = [
    {
      id: 'webhook-email',
      name: 'Webhook to Email',
      description: 'Recibe webhook y envía email de notificación',
      category: 'automation',
      difficulty: 'beginner',
      tags: ['webhook', 'email', 'notification'],
      icon: 'email',
      color: '#22c55e',
      nodes: [
        {
          id: 'webhook_trigger',
          type: 'default',
          position: { x: 100, y: 100 },
          data: { 
            title: 'Webhook Trigger', 
            kind: 'trigger',
            description: 'Recibe datos desde webhook externo'
          }
        },
        {
          id: 'email_action',
          type: 'default',
          position: { x: 300, y: 100 },
          data: { 
            title: 'Send Email', 
            kind: 'action',
            description: 'Envía email de notificación'
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'webhook_trigger', target: 'email_action', type: 'default' }
      ]
    },
    {
      id: 'data-processing',
      name: 'Data Processing Pipeline',
      description: 'Procesa datos, valida y almacena resultados',
      category: 'data',
      difficulty: 'intermediate',
      tags: ['data', 'processing', 'validation'],
      icon: 'storage',
      color: '#6366f1',
      nodes: [
        {
          id: 'data_input',
          type: 'default',
          position: { x: 50, y: 100 },
          data: { 
            title: 'Data Input', 
            kind: 'trigger',
            description: 'Recibe datos de entrada'
          }
        },
        {
          id: 'validate_data',
          type: 'default',
          position: { x: 250, y: 100 },
          data: { 
            title: 'Validate Data', 
            kind: 'logic',
            description: 'Valida formato y estructura'
          }
        },
        {
          id: 'transform_data',
          type: 'default',
          position: { x: 450, y: 100 },
          data: { 
            title: 'Transform Data', 
            kind: 'logic',
            description: 'Transforma y normaliza datos'
          }
        },
        {
          id: 'store_data',
          type: 'default',
          position: { x: 650, y: 100 },
          data: { 
            title: 'Store Results', 
            kind: 'action',
            description: 'Almacena resultados procesados'
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'data_input', target: 'validate_data', type: 'default' },
        { id: 'e2', source: 'validate_data', target: 'transform_data', type: 'default' },
        { id: 'e3', source: 'transform_data', target: 'store_data', type: 'default' }
      ]
    },
    {
      id: 'api-monitoring',
      name: 'API Health Monitor',
      description: 'Monitorea salud de APIs y envía alertas',
      category: 'monitoring',
      difficulty: 'advanced',
      tags: ['api', 'monitoring', 'alerts'],
      icon: 'health_and_safety',
      color: '#ef4444',
      nodes: [
        {
          id: 'schedule_trigger',
          type: 'default',
          position: { x: 50, y: 100 },
          data: { 
            title: 'Schedule Check', 
            kind: 'trigger',
            description: 'Ejecuta cada 5 minutos'
          }
        },
        {
          id: 'check_api',
          type: 'default',
          position: { x: 250, y: 100 },
          data: { 
            title: 'Check API Health', 
            kind: 'logic',
            description: 'Verifica estado de APIs'
          }
        },
        {
          id: 'check_condition',
          type: 'default',
          position: { x: 450, y: 100 },
          data: { 
            title: 'Check Condition', 
            kind: 'logic',
            description: 'Evalúa condiciones de alerta'
          }
        },
        {
          id: 'send_alert',
          type: 'default',
          position: { x: 650, y: 100 },
          data: { 
            title: 'Send Alert', 
            kind: 'action',
            description: 'Envía notificación de alerta'
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'schedule_trigger', target: 'check_api', type: 'default' },
        { id: 'e2', source: 'check_api', target: 'check_condition', type: 'default' },
        { id: 'e3', source: 'check_condition', target: 'send_alert', type: 'default' }
      ]
    },
    {
      id: 'user-onboarding',
      name: 'User Onboarding Flow',
      description: 'Proceso completo de onboarding de nuevos usuarios',
      category: 'business',
      difficulty: 'intermediate',
      tags: ['user', 'onboarding', 'email'],
      icon: 'person_add',
      color: '#8b5cf6',
      nodes: [
        {
          id: 'user_signup',
          type: 'default',
          position: { x: 50, y: 100 },
          data: { 
            title: 'User Signup', 
            kind: 'trigger',
            description: 'Nuevo usuario se registra'
          }
        },
        {
          id: 'send_welcome',
          type: 'default',
          position: { x: 250, y: 100 },
          data: { 
            title: 'Send Welcome Email', 
            kind: 'action',
            description: 'Envía email de bienvenida'
          }
        },
        {
          id: 'create_profile',
          type: 'default',
          position: { x: 450, y: 100 },
          data: { 
            title: 'Create Profile', 
            kind: 'action',
            description: 'Crea perfil de usuario'
          }
        },
        {
          id: 'assign_tutorial',
          type: 'default',
          position: { x: 650, y: 100 },
          data: { 
            title: 'Assign Tutorial', 
            kind: 'action',
            description: 'Asigna tutorial inicial'
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'user_signup', target: 'send_welcome', type: 'default' },
        { id: 'e2', source: 'send_welcome', target: 'create_profile', type: 'default' },
        { id: 'e3', source: 'create_profile', target: 'assign_tutorial', type: 'default' }
      ]
    },
    {
      id: 'ecommerce-order',
      name: 'E-commerce Order Processing',
      description: 'Procesamiento completo de pedidos de e-commerce',
      category: 'ecommerce',
      difficulty: 'advanced',
      tags: ['ecommerce', 'order', 'payment'],
      icon: 'shopping_cart',
      color: '#f59e0b',
      nodes: [
        {
          id: 'order_received',
          type: 'default',
          position: { x: 50, y: 100 },
          data: { 
            title: 'Order Received', 
            kind: 'trigger',
            description: 'Nuevo pedido recibido'
          }
        },
        {
          id: 'validate_payment',
          type: 'default',
          position: { x: 250, y: 100 },
          data: { 
            title: 'Validate Payment', 
            kind: 'logic',
            description: 'Valida método de pago'
          }
        },
        {
          id: 'process_payment',
          type: 'default',
          position: { x: 450, y: 100 },
          data: { 
            title: 'Process Payment', 
            kind: 'action',
            description: 'Procesa pago'
          }
        },
        {
          id: 'update_inventory',
          type: 'default',
          position: { x: 650, y: 100 },
          data: { 
            title: 'Update Inventory', 
            kind: 'action',
            description: 'Actualiza inventario'
          }
        },
        {
          id: 'send_confirmation',
          type: 'default',
          position: { x: 850, y: 100 },
          data: { 
            title: 'Send Confirmation', 
            kind: 'action',
            description: 'Envía confirmación al cliente'
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'order_received', target: 'validate_payment', type: 'default' },
        { id: 'e2', source: 'validate_payment', target: 'process_payment', type: 'default' },
        { id: 'e3', source: 'process_payment', target: 'update_inventory', type: 'default' },
        { id: 'e4', source: 'update_inventory', target: 'send_confirmation', type: 'default' }
      ]
    }
  ]

  // Filtrar templates
  const filteredTemplates = WORKFLOW_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                         template.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(templateSearch.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Cargar template
  const loadTemplate = useCallback(async (template) => {
    setIsLoadingTemplate(true)
    
    try {
      // Limpiar workflow actual
      setNodes([])
      setEdges([])
      
      // Cargar template con IDs únicos
      const nodeMap = new Map()
      const newNodes = template.nodes.map((node, index) => {
        const newNode = {
          ...node,
          id: `${node.id}_${Date.now()}_${index}`,
          position: snapToGrid(node.position)
        }
        nodeMap.set(node.id, newNode.id)
        return newNode
      })
      
      const newEdges = template.edges.map(edge => ({
        ...edge,
        id: `edge_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        source: nodeMap.get(edge.source),
        target: nodeMap.get(edge.target)
      }))
      
      // Aplicar cambios
      setNodes(newNodes)
      setEdges(newEdges)
      setName(`${template.name} - Template`)
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'TEMPLATE', color: '#22c55e',
        msg: `Template "${template.name}" cargado`
      }, ...prev.slice(0, 9)])
      
      setShowTemplatesModal(false)
      
    } catch (error) {
      console.error('Error cargando template:', error)
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error cargando template: ${error.message}`
      }, ...prev.slice(0, 9)])
    } finally {
      setIsLoadingTemplate(false)
    }
  }, [setNodes, setEdges, setName])

  // Categorías disponibles
  const templateCategories = [
    { id: 'all', name: 'Todos', icon: 'apps', count: WORKFLOW_TEMPLATES.length },
    { id: 'automation', name: 'Automatización', icon: 'auto_awesome', count: WORKFLOW_TEMPLATES.filter(t => t.category === 'automation').length },
    { id: 'data', name: 'Datos', icon: 'storage', count: WORKFLOW_TEMPLATES.filter(t => t.category === 'data').length },
    { id: 'monitoring', name: 'Monitoreo', icon: 'monitoring', count: WORKFLOW_TEMPLATES.filter(t => t.category === 'monitoring').length },
    { id: 'business', name: 'Negocio', icon: 'business', count: WORKFLOW_TEMPLATES.filter(t => t.category === 'business').length },
    { id: 'ecommerce', name: 'E-commerce', icon: 'shopping_cart', count: WORKFLOW_TEMPLATES.filter(t => t.category === 'ecommerce').length }
  ]

  // Sistema de Analytics Avanzados
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({
    workflowMetrics: {
      totalNodes: 0,
      totalEdges: 0,
      totalVariables: 0,
      complexity: 'simple',
      estimatedTime: 0,
      lastModified: null
    },
    performanceMetrics: {
      averageExecutionTime: 0,
      successRate: 0,
      errorRate: 0,
      totalExecutions: 0,
      averageNodesPerExecution: 0
    },
    usageMetrics: {
      totalViews: 0,
      uniqueUsers: 0,
      averageSessionTime: 0,
      mostUsedNodes: [],
      peakUsageTimes: []
    },
    systemMetrics: {
      memoryUsage: 0,
      cpuUsage: 0,
      networkRequests: 0,
      errors: 0,
      warnings: 0
    }
  })
  const [analyticsHistory, setAnalyticsHistory] = useState([])
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('7d') // '1d', '7d', '30d', '90d'

  // Calcular métricas del workflow
  const calculateWorkflowMetrics = useCallback(() => {
    const nodes = nodesRef.current
    const edges = edgesRef.current
    
    // Métricas básicas
    const totalNodes = nodes.length
    const totalEdges = edges.length
    const totalVariables = globalVariables.length
    
    // Calcular complejidad
    let complexity = 'simple'
    if (totalNodes > 10 || totalEdges > 15) complexity = 'intermediate'
    if (totalNodes > 25 || totalEdges > 30) complexity = 'complex'
    
    // Estimar tiempo de ejecución (basado en nodos y complejidad)
    const baseTime = 5 // segundos base
    const complexityMultiplier = complexity === 'simple' ? 1 : complexity === 'intermediate' ? 1.5 : 2.5
    const estimatedTime = Math.round(baseTime * totalNodes * complexityMultiplier)
    
    // Última modificación
    const lastModified = new Date().toISOString()
    
    return {
      totalNodes,
      totalEdges,
      totalVariables,
      complexity,
      estimatedTime,
      lastModified
    }
  }, [globalVariables])

  // Calcular métricas de rendimiento
  const calculatePerformanceMetrics = useCallback(() => {
    // Simular métricas de rendimiento (en producción, estas vendrían de datos reales)
    const totalExecutions = Math.floor(Math.random() * 100) + 50
    const successExecutions = Math.floor(totalExecutions * 0.85)
    const errorExecutions = totalExecutions - successExecutions
    
    const avgExecutionTime = (Math.random() * 10 + 2).toFixed(2)
    const successRate = ((successExecutions / totalExecutions) * 100).toFixed(1)
    const errorRate = ((errorExecutions / totalExecutions) * 100).toFixed(1)
    const averageNodesPerExecution = (Math.random() * 5 + 2).toFixed(1)
    
    return {
      averageExecutionTime: parseFloat(avgExecutionTime),
      successRate: parseFloat(successRate),
      errorRate: parseFloat(errorRate),
      totalExecutions,
      averageNodesPerExecution: parseFloat(averageNodesPerExecution)
    }
  }, [])

  // Calcular métricas de uso
  const calculateUsageMetrics = useCallback(() => {
    // Simular métricas de uso
    const totalViews = Math.floor(Math.random() * 1000) + 200
    const uniqueUsers = Math.floor(Math.random() * 50) + 10
    const averageSessionTime = (Math.random() * 15 + 5).toFixed(1)
    
    // Nodos más usados (simulado)
    const nodeTypes = ['trigger', 'action', 'logic']
    const mostUsedNodes = nodeTypes.map(type => ({
      type,
      count: Math.floor(Math.random() * 20) + 5
    })).sort((a, b) => b.count - a.count).slice(0, 5)
    
    // Horas pico de uso (simulado)
    const peakUsageTimes = [
      { time: '09:00', count: 45 },
      { time: '14:00', count: 32 },
      { time: '16:00', count: 28 },
      { time: '18:00', count: 15 }
    ]
    
    return {
      totalViews,
      uniqueUsers,
      averageSessionTime: parseFloat(averageSessionTime),
      mostUsedNodes,
      peakUsageTimes
    }
  }, [])

  // Calcular métricas del sistema
  const calculateSystemMetrics = useCallback(() => {
    // Simular métricas del sistema (en producción, estas vendrían de APIs reales)
    const memoryUsage = (Math.random() * 50 + 20).toFixed(1)
    const cpuUsage = (Math.random() * 30 + 10).toFixed(1)
    const networkRequests = Math.floor(Math.random() * 100 + 50)
    const errors = Math.floor(Math.random() * 10)
    const warnings = Math.floor(Math.random() * 20)
    
    return {
      memoryUsage: parseFloat(memoryUsage),
      cpuUsage: parseFloat(cpuUsage),
      networkRequests,
      errors,
      warnings
    }
  }, [])

  // Actualizar todas las métricas
  const updateAnalytics = useCallback(() => {
    const workflowMetrics = calculateWorkflowMetrics()
    const performanceMetrics = calculatePerformanceMetrics()
    const usageMetrics = calculateUsageMetrics()
    const systemMetrics = calculateSystemMetrics()
    
    const newAnalyticsData = {
      workflowMetrics,
      performanceMetrics,
      usageMetrics,
      systemMetrics
    }
    
    setAnalyticsData(newAnalyticsData)
    
    // Agregar al historial
    const historyEntry = {
      timestamp: new Date().toISOString(),
      ...newAnalyticsData,
      workflowId: id,
      workflowName: name
    }
    
    setAnalyticsHistory(prev => [
      historyEntry,
      ...prev.slice(0, 99) // Mantener últimos 100 registros
    ])
    
    // Guardar en localStorage
    try {
      localStorage.setItem(`analytics_${id}`, JSON.stringify(historyEntry))
    } catch (error) {
      console.error('Error guardando analytics:', error)
    }
  }, [id, name, calculateWorkflowMetrics, calculatePerformanceMetrics, calculateUsageMetrics, calculateSystemMetrics])

  // Auto-actualizar analytics cada 30 segundos
  useEffect(() => {
    if (!id || id === 'new') return
    
    const analyticsInterval = setInterval(() => {
      updateAnalytics()
    }, 30 * 1000) // 30 segundos
    
    return () => clearInterval(analyticsInterval)
  }, [id, name, updateAnalytics])

  // Obtener historial de analytics
  const fetchAnalyticsHistory = useCallback(async () => {
    try {
      // En producción, esto sería una llamada a la API
      const stored = localStorage.getItem(`analytics_${id}`)
      if (stored) {
        const history = JSON.parse(stored)
        setAnalyticsHistory(history)
      }
    } catch (error) {
      console.error('Error obteniendo analytics history:', error)
    }
  }, [id])

  // Generar reporte de analytics
  const generateAnalyticsReport = useCallback(() => {
    const report = {
      workflowId: id,
      workflowName: name,
      generatedAt: new Date().toISOString(),
      timeRange: analyticsTimeRange,
      summary: {
        totalNodes: analyticsData.workflowMetrics.totalNodes,
        totalEdges: analyticsData.workflowMetrics.totalEdges,
        complexity: analyticsData.workflowMetrics.complexity,
        estimatedTime: analyticsData.workflowMetrics.estimatedTime,
        successRate: analyticsData.performanceMetrics.successRate,
        totalExecutions: analyticsData.performanceMetrics.totalExecutions
      },
      metrics: analyticsData,
      recommendations: generateRecommendations(analyticsData)
    }
    
    // Descargar reporte como JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${id}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'ANALYTICS', color: '#8b5cf6',
      msg: 'Reporte de analytics generado'
    }, ...prev.slice(0, 9)])
  }, [id, name, analyticsData, analyticsTimeRange])

  // Generar recomendaciones basadas en métricas
  const generateRecommendations = (data) => {
    const recommendations = []
    
    // Recomendaciones de rendimiento
    if (data.performanceMetrics.successRate < 80) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: 'Mejorar tasa de éxito',
        description: 'La tasa de éxito es baja. Revisa la lógica del workflow y manejo de errores.',
        action: 'Optimizar validaciones y manejo de excepciones.'
      })
    }
    
    if (data.performanceMetrics.averageExecutionTime > 10) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        title: 'Optimizar tiempo de ejecución',
        description: 'El tiempo promedio de ejecución es alto. Considera optimizar nodos complejos.',
        action: 'Revisar algoritmos y eliminar pasos innecesarios.'
      })
    }
    
    // Recomendaciones de complejidad
    if (data.workflowMetrics.complexity === 'complex' && data.workflowMetrics.totalNodes > 30) {
      recommendations.push({
        type: 'structure',
        priority: 'medium',
        title: 'Simplificar workflow',
        description: 'El workflow es muy complejo. Considera dividirlo en workflows más pequeños.',
        action: 'Dividir en sub-workflows más manejables.'
      })
    }
    
    // Recomendaciones de uso
    if (data.usageMetrics.uniqueUsers < 5) {
      recommendations.push({
        type: 'usage',
        priority: 'low',
        title: 'Promover uso del workflow',
        description: 'El workflow tiene pocos usuarios. Considera documentarlo mejor.',
        action: 'Crear documentación y compartir con el equipo.'
      })
    }
    
    return recommendations
  }

  // Sistema de Integraciones Externas
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false)
  const [integrations, setIntegrations] = useState([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Enviar mensajes y notificaciones a canales de Slack',
      icon: 'chat',
      color: '#4A154B',
      category: 'communication',
      status: 'disconnected',
      config: {
        webhookUrl: '',
        channel: '#general',
        username: 'Flowly Bot'
      },
      capabilities: ['send_message', 'send_file', 'create_channel']
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Integración con servidores y canales de Discord',
      icon: 'discord',
      color: '#5865F2',
      category: 'communication',
      status: 'disconnected',
      config: {
        botToken: '',
        serverId: '',
        channelId: '',
        username: 'Flowly'
      },
      capabilities: ['send_message', 'send_embed', 'create_webhook']
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Enviar mensajes y archivos a través de bots de Telegram',
      icon: 'telegram',
      color: '#0088CC',
      category: 'communication',
      status: 'disconnected',
      config: {
        botToken: '',
        chatId: '',
        parseMode: 'HTML'
      },
      capabilities: ['send_message', 'send_photo', 'send_document']
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Enviar emails automatizados a través de Gmail',
      icon: 'email',
      color: '#EA4335',
      category: 'email',
      status: 'disconnected',
      config: {
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        fromEmail: ''
      },
      capabilities: ['send_email', 'send_attachment', 'create_draft']
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Integración con repositorios y acciones de GitHub',
      icon: 'code',
      color: '#24292E',
      category: 'development',
      status: 'disconnected',
      config: {
        accessToken: '',
        owner: '',
        repo: '',
        branch: 'main'
      },
      capabilities: ['create_issue', 'create_pull_request', 'get_repo_info']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Crear y actualizar páginas en bases de datos de Notion',
      icon: 'article',
      color: '#000000',
      category: 'productivity',
      status: 'disconnected',
      config: {
        apiKey: '',
        databaseId: '',
        pageId: ''
      },
      capabilities: ['create_page', 'update_page', 'query_database']
    },
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Conectar con bases de datos de Airtable',
      icon: 'table_chart',
      color: '#18BFFF',
      category: 'database',
      status: 'disconnected',
      config: {
        apiKey: '',
        baseId: '',
        tableId: ''
      },
      capabilities: ['create_record', 'update_record', 'query_records']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Procesar pagos y gestionar suscripciones',
      icon: 'payments',
      color: '#635BFF',
      category: 'payment',
      status: 'disconnected',
      config: {
        secretKey: '',
        publishableKey: '',
        webhookSecret: ''
      },
      capabilities: ['create_payment', 'create_customer', 'get_balance']
    }
  ])
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [integrationLogs, setIntegrationLogs] = useState([])

  // Conectar integración
  const connectIntegration = useCallback(async (integrationId) => {
    setIsConnecting(true)
    const integration = integrations.find(i => i.id === integrationId)
    
    try {
      // Simular conexión API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Actualizar estado
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, status: 'connected', connectedAt: new Date().toISOString() }
          : i
      ))
      
      setIntegrationLogs(prev => [{
        timestamp: new Date().toISOString(),
        integrationId,
        action: 'connected',
        message: `Integración ${integration.name} conectada exitosamente`,
        type: 'success'
      }, ...prev.slice(0, 49)])
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'INTEGRATION', color: '#22c55e',
        msg: `Integración ${integration.name} conectada`
      }, ...prev.slice(0, 9)])
      
    } catch (error) {
      console.error('Error conectando integración:', error)
      setIntegrationLogs(prev => [{
        timestamp: new Date().toISOString(),
        integrationId,
        action: 'error',
        message: `Error conectando ${integration.name}: ${error.message}`,
        type: 'error'
      }, ...prev.slice(0, 49)])
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error conectando ${integration.name}`
      }, ...prev.slice(0, 9)])
    } finally {
      setIsConnecting(false)
    }
  }, [integrations])

  // Desconectar integración
  const disconnectIntegration = useCallback(async (integrationId) => {
    const integration = integrations.find(i => i.id === integrationId)
    
    try {
      // Simular desconexión API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, status: 'disconnected', connectedAt: null }
          : i
      ))
      
      setIntegrationLogs(prev => [{
        timestamp: new Date().toISOString(),
        integrationId,
        action: 'disconnected',
        message: `Integración ${integration.name} desconectada`,
        type: 'warning'
      }, ...prev.slice(0, 49)])
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'INTEGRATION', color: '#f59e0b',
        msg: `Integración ${integration.name} desconectada`
      }, ...prev.slice(0, 9)])
      
    } catch (error) {
      console.error('Error desconectando integración:', error)
    }
  }, [integrations])

  // Probar integración
  const testIntegration = useCallback(async (integrationId) => {
    const integration = integrations.find(i => i.id === integrationId)
    
    try {
      setIntegrationLogs(prev => [{
        timestamp: new Date().toISOString(),
        integrationId,
        action: 'testing',
        message: `Probando conexión con ${integration.name}...`,
        type: 'info'
      }, ...prev.slice(0, 49)])
      
      // Simular prueba
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIntegrationLogs(prev => [{
        timestamp: new Date().toISOString(),
        integrationId,
        action: 'tested',
        message: `Prueba exitosa para ${integration.name}`,
        type: 'success'
      }, ...prev.slice(0, 49)])
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'INTEGRATION', color: '#22c55e',
        msg: `Prueba exitosa: ${integration.name}`
      }, ...prev.slice(0, 9)])
      
    } catch (error) {
      setIntegrationLogs(prev => [{
        timestamp: new Date().toISOString(),
        integrationId,
        action: 'test_failed',
        message: `Error en prueba de ${integration.name}: ${error.message}`,
        type: 'error'
      }, ...prev.slice(0, 49)])
    }
  }, [integrations])

  // Obtener nodos de integración para la biblioteca
  const getIntegrationNodes = useCallback(() => {
    const connectedIntegrations = integrations.filter(i => i.status === 'connected')
    
    return connectedIntegrations.map(integration => ({
      group: integration.name.toUpperCase(),
      items: integration.capabilities.map(capability => ({
        title: `${integration.name} ${capability.replace('_', ' ').toUpperCase()}`,
        desc: `Acción ${capability} para ${integration.name}`,
        kind: 'action',
        icon: integration.icon,
        color: integration.color,
        integrationId: integration.id,
        capability
      }))
    })).filter(group => group.items.length > 0)
  }, [integrations])

  // Sistema de Personalización Visual
  const [showCustomizationModal, setShowCustomizationModal] = useState(false)
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#6366f1',
    secondaryColor: '#06b6d4',
    accentColor: '#8b5cf7',
    backgroundColor: '#0f1117',
    surfaceColor: '#1a1d27',
    textColor: '#cbd5e1',
    borderColor: 'rgba(255,255,255,0.1)',
    successColor: '#22c55e',
    warningColor: '#f59e0b',
    errorColor: '#ef4444'
  })
  const [customLayout, setCustomLayout] = useState({
    panelWidth: 340,
    panelPosition: 'right',
    toolbarHeight: 60,
    footerHeight: 32,
    sidebarWidth: 280,
    nodeSize: 'medium',
    connectionWidth: 2,
    showMiniMap: true,
    showControls: true
  })
  const [customIcons, setCustomIcons] = useState({
    trigger: 'bolt',
    action: 'play_arrow',
    logic: 'code',
    data: 'storage',
    email: 'email',
    api: 'api',
    database: 'database'
  })
  const [workflowSkins, setWorkflowSkins] = useState([
    {
      id: 'default',
      name: 'Default',
      description: 'Tema por defecto del sistema',
      colors: customTheme,
      nodeStyles: {
        trigger: { background: '#6366f1', border: '#4f46e5', color: '#ffffff' },
        action: { background: '#06b6d4', border: '#0891b2', color: '#ffffff' },
        logic: { background: '#8b5cf7', border: '#7c3aed', color: '#ffffff' },
        data: { background: '#f59e0b', border: '#d97706', color: '#ffffff' }
      }
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Tema azul oceánico relajado',
      colors: {
        primaryColor: '#0891b2',
        secondaryColor: '#0ea5e9',
        accentColor: '#06b6d4',
        backgroundColor: '#0c1929',
        surfaceColor: '#1e293b',
        textColor: '#f1f5f9',
        borderColor: 'rgba(255,255,255,0.1)',
        successColor: '#10b981',
        warningColor: '#f59e0b',
        errorColor: '#ef4444'
      },
      nodeStyles: {
        trigger: { background: '#0891b2', border: '#0e7490', color: '#ffffff' },
        action: { background: '#0ea5e9', border: '#0284c7', color: '#ffffff' },
        logic: { background: '#06b6d4', border: '#0891b2', color: '#ffffff' },
        data: { background: '#14b8a6', border: '#059669', color: '#ffffff' }
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Tema verde natural y orgánico',
      colors: {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        accentColor: '#22c55e',
        backgroundColor: '#052e16',
        surfaceColor: '#064e3b',
        textColor: '#ecfdf5',
        borderColor: 'rgba(255,255,255,0.1)',
        successColor: '#34d399',
        warningColor: '#fbbf24',
        errorColor: '#f87171'
      },
      nodeStyles: {
        trigger: { background: '#10b981', border: '#059669', color: '#ffffff' },
        action: { background: '#22c55e', border: '#16a34a', color: '#ffffff' },
        logic: { background: '#34d399', border: '#10b981', color: '#ffffff' },
        data: { background: '#86efac', border: '#22c55e', color: '#ffffff' }
      }
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Tema atardecer cálido y vibrante',
      colors: {
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        accentColor: '#fbbf24',
        backgroundColor: '#451a03',
        surfaceColor: '#78350f',
        textColor: '#fef3c7',
        borderColor: 'rgba(255,255,255,0.1)',
        successColor: '#84cc16',
        warningColor: '#fbbf24',
        errorColor: '#f87171'
      },
      nodeStyles: {
        trigger: { background: '#f59e0b', border: '#d97706', color: '#ffffff' },
        action: { background: '#fbbf24', border: '#d97706', color: '#000000' },
        logic: { background: '#fbbf24', border: '#d97706', color: '#000000' },
        data: { background: '#fef3c7', border: '#fbbf24', color: '#000000' }
      }
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Tema futurista con neón',
      colors: {
        primaryColor: '#ec4899',
        secondaryColor: '#f43f5e',
        accentColor: '#8b5cf6',
        backgroundColor: '#0f0f23',
        surfaceColor: '#1a1a2e',
        textColor: '#e2e8f0',
        borderColor: 'rgba(236, 72, 153,0.2)',
        successColor: '#00ff00',
        warningColor: '#ffff00',
        errorColor: '#ff00ff'
      },
      nodeStyles: {
        trigger: { background: '#ec4899', border: '#a855f7', color: '#ffffff' },
        action: { background: '#f43f5e', border: '#dc2626', color: '#000000' },
        logic: { background: '#8b5cf6', border: '#7c3aed', color: '#ffffff' },
        data: { background: '#06ffa0', border: '#00ff00', color: '#000000' }
      }
    }
  ])
  const [currentSkin, setCurrentSkin] = useState('default')
  const [customNodeSize, setCustomNodeSize] = useState('medium')
  const [customConnectionWidth, setCustomConnectionWidth] = useState(2)
  const [customizationTab, setCustomizationTab] = useState('themes')

  // Guardar configuración personalizada
  const saveCustomization = useCallback(() => {
    const customization = {
      theme: customTheme,
      layout: customLayout,
      icons: customIcons,
      skins: workflowSkins,
      currentSkin,
      nodeSize: customNodeSize,
      connectionWidth: customConnectionWidth
    }
    
    try {
      localStorage.setItem('workflow_customization', JSON.stringify(customization))
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'CUSTOMIZATION', color: '#8b5cf7',
        msg: 'Configuración personalizada guardada'
      }, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Error guardando configuración:', error)
    }
  }, [customTheme, customLayout, customIcons, workflowSkins, currentSkin, customNodeSize, customConnectionWidth])

  // Cargar configuración personalizada
  const loadCustomization = useCallback(() => {
    try {
      const stored = localStorage.getItem('workflow_customization')
      if (stored) {
        const customization = JSON.parse(stored)
        setCustomTheme(customization.theme || customTheme)
        setCustomLayout(customization.layout || customLayout)
        setCustomIcons(customization.icons || customIcons)
        setWorkflowSkins(customization.skins || workflowSkins)
        setCurrentSkin(customization.currentSkin || 'default')
        setCustomNodeSize(customization.nodeSize || 'medium')
        setCustomConnectionWidth(customization.connectionWidth || 2)
      }
    } catch (error) {
      console.error('Error cargando configuración:', error)
    }
  }, [])

  // Aplicar tema personalizado
  const applyCustomTheme = useCallback(() => {
    const selectedSkin = workflowSkins.find(skin => skin.id === currentSkin)
    const themeColors = selectedSkin ? selectedSkin.colors : customTheme
    
    // Aplicar colores al documento
    const root = document.documentElement
    root.style.setProperty('--primary-color', themeColors.primaryColor)
    root.style.setProperty('--secondary-color', themeColors.secondaryColor)
    root.style.setProperty('--accent-color', themeColors.accentColor)
    root.style.setProperty('--background-color', themeColors.backgroundColor)
    root.style.setProperty('--surface-color', themeColors.surfaceColor)
    root.style.setProperty('--text-color', themeColors.textColor)
    root.style.setProperty('--border-color', themeColors.borderColor)
    root.style.setProperty('--success-color', themeColors.successColor)
    root.style.setProperty('--warning-color', themeColors.warningColor)
    root.style.setProperty('--error-color', themeColors.errorColor)
    
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'CUSTOMIZATION', color: '#8b5cf7',
      msg: `Tema ${selectedSkin?.name || 'Custom'} aplicado`
    }, ...prev.slice(0, 9)])
  }, [currentSkin, workflowSkins, customTheme])

  // Cargar configuración al montar
  useEffect(() => {
    loadCustomization()
    applyCustomTheme()
  }, [])

  // Generar link para compartir
  const generateShareLink = useCallback(async () => {
    setIsGeneratingShare(true)
    
    try {
      const shareData = {
        workflowId: id,
        name,
        nodes: nodesRef.current,
        edges: edgesRef.current,
        variables: globalVariables,
        settings: shareSettings,
        createdAt: new Date().toISOString(),
        version: '2.4.1',
        metadata: {
          nodeCount: nodesRef.current.length,
          edgeCount: edgesRef.current.length,
          variableCount: globalVariables.length,
          creator: 'Flowly User',
          description: `Workflow compartido: ${name}`
        }
      }

      const response = await fetch('http://localhost:3001/api/workflows/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareData)
      })

      if (response.ok) {
        const result = await response.json()
        const shareUrl = `${window.location.origin}/shared/${result.shareId}`
        setShareLink(shareUrl)
        
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'SHARE', color: '#06b6d4',
          msg: `Workflow compartido: ${shareUrl}`
        }, ...prev.slice(0, 9)])

        // Agregar a workflows compartidos
        setSharedWorkflows(prev => [
          {
            id: result.shareId,
            name: `${name} - Compartido`,
            url: shareUrl,
            createdAt: new Date().toISOString(),
            settings: shareSettings,
            viewCount: 0
          },
          ...prev.slice(0, 4)
        ])
      } else {
        throw new Error('Error generando link')
      }
    } catch (error) {
      console.error('Error generando share link:', error)
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error compartiendo: ${error.message}`
      }, ...prev.slice(0, 9)])
    } finally {
      setIsGeneratingShare(false)
    }
  }, [id, name, globalVariables, shareSettings])

  // Copiar link al portapapeles
  const copyShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'INFO', color: '#22c55e',
        msg: 'Link copiado al portapapeles'
      }, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Error copiando link:', error)
    }
  }, [shareLink])

  // Obtener workflows compartidos
  const fetchSharedWorkflows = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/workflows/${id}/shared`)
      if (response.ok) {
        const shared = await response.json()
        setSharedWorkflows(shared)
      }
    } catch (error) {
      console.error('Error obteniendo workflows compartidos:', error)
    }
  }, [id])

  // Eliminar share link
  const deleteShareLink = useCallback(async (shareId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/workflows/share/${shareId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setSharedWorkflows(prev => prev.filter(s => s.id !== shareId))
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'DELETE', color: '#ef4444',
          msg: 'Link compartido eliminado'
        }, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error('Error eliminando share link:', error)
    }
  }, [])

  // Backup automático en la nube cada 5 minutos
  useEffect(() => {
    if (!cloudBackupEnabled || !id || id === 'new') return

    const backupInterval = setInterval(async () => {
      if (nodesRef.current.length > 0) {
        await performCloudBackup()
      }
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(backupInterval)
  }, [cloudBackupEnabled, id])

  // Realizar backup en la nube
  const performCloudBackup = useCallback(async () => {
    setBackupStatus('saving')
    
    try {
      const backupData = {
        workflowId: id,
        name,
        nodes: nodesRef.current,
        edges: edgesRef.current,
        variables: globalVariables,
        timestamp: new Date().toISOString(),
        version: '2.4.1',
        metadata: {
          nodeCount: nodesRef.current.length,
          edgeCount: edgesRef.current.length,
          variableCount: globalVariables.length,
          browser: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`
        }
      }

      // Simular API de backup (en producción sería un endpoint real)
      const response = await fetch('http://localhost:3001/api/workflows/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData)
      })

      if (response.ok) {
        const result = await response.json()
        setLastBackup(new Date())
        setBackupStatus('success')
        
        // Agregar al historial de backups
        setBackupHistory(prev => [
          {
            id: result.backupId || Date.now().toString(),
            timestamp: new Date().toISOString(),
            name: `${name} - Auto Backup`,
            nodeCount: nodesRef.current.length,
            size: JSON.stringify(backupData).length
          },
          ...prev.slice(0, 9) // Mantener solo los últimos 10
        ])

        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'BACKUP', color: '#22c55e',
          msg: 'Backup automático guardado en la nube'
        }, ...prev.slice(0, 9)])
      } else {
        throw new Error('Error en el servidor')
      }
    } catch (error) {
      setBackupStatus('error')
      console.error('Error en backup:', error)
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error en backup: ${error.message}`
      }, ...prev.slice(0, 9)])
    }
  }, [id, name, globalVariables])

  // Restaurar desde la nube
  const restoreFromCloud = useCallback(async (backupId) => {
    try {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'INFO', color: '#6366f1',
        msg: 'Restaurando desde la nube...'
      }, ...prev.slice(0, 9)])

      const response = await fetch(`http://localhost:3001/api/workflows/backup/${backupId}`)
      
      if (!response.ok) {
        throw new Error('Backup no encontrado')
      }

      const backupData = await response.json()
      
      // Validar y restaurar datos
      if (backupData.nodes && backupData.edges) {
        setNodes(backupData.nodes)
        setEdges(backupData.edges)
        setGlobalVariables(backupData.variables || [])
        setName(backupData.name || `Workflow ${id}`)
        
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'RESTORE', color: '#22c55e',
          msg: `Workflow restaurado: ${backupData.nodes.length} nodos`
        }, ...prev.slice(0, 9)])

        setShowBackupModal(false)
      }
    } catch (error) {
      console.error('Error restaurando:', error)
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error restaurando: ${error.message}`
      }, ...prev.slice(0, 9)])
    }
  }, [id, setNodes, setEdges, setGlobalVariables, setName])

  // Obtener historial de backups
  const fetchBackupHistory = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/workflows/${id}/backups`)
      if (response.ok) {
        const history = await response.json()
        setBackupHistory(history)
      }
    } catch (error) {
      console.error('Error obteniendo historial:', error)
    }
  }, [id])

  // Eliminar backup
  const deleteBackup = useCallback(async (backupId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/workflows/backup/${backupId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setBackupHistory(prev => prev.filter(b => b.id !== backupId))
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'DELETE', color: '#ef4444',
          msg: 'Backup eliminado'
        }, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error('Error eliminando backup:', error)
    }
  }, [])

  // Exportar workflow a diferentes formatos
  const exportWorkflow = useCallback(async (format) => {
    setIsExporting(true)
    
    try {
      const workflowData = {
        name,
        nodes: nodesRef.current,
        edges: edgesRef.current,
        variables: globalVariables,
        metadata: {
          version: '2.4.1',
          exported: new Date().toISOString(),
          nodeCount: nodesRef.current.length,
          edgeCount: edgesRef.current.length
        }
      }

      let content, filename, mimeType

      switch (format) {
        case 'json':
          content = JSON.stringify(workflowData, null, 2)
          filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.json`
          mimeType = 'application/json'
          break
          
        case 'yaml':
          // Convertir a YAML simple
          content = `name: ${workflowData.name}\n` +
                   `version: ${workflowData.metadata.version}\n` +
                   `exported: ${workflowData.metadata.exported}\n` +
                   `nodes:\n` +
                   workflowData.nodes.map(node => 
                     `  - id: ${node.id}\n    type: ${node.data?.kind || 'action'}\n    position: {x: ${node.position.x}, y: ${node.position.y}}\n    data: ${JSON.stringify(node.data)}`
                   ).join('\n') +
                   `\nedges:\n` +
                   workflowData.edges.map(edge => 
                     `  - from: ${edge.source}\n    to: ${edge.target}\n    type: ${edge.data?.type || 'default'}`
                   ).join('\n')
          filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.yaml`
          mimeType = 'text/yaml'
          break
          
        case 'image':
          // Exportar como imagen usando html2canvas o similar
          content = await exportAsImage()
          filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.png`
          mimeType = 'image/png'
          break
          
        default:
          throw new Error('Formato no soportado')
      }

      // Descargar archivo
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'EXPORT', color: '#22c55e',
        msg: `Workflow exportado como ${format.toUpperCase()}`
      }, ...prev.slice(0, 9)])

    } catch (error) {
      console.error('Error exportando workflow:', error)
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error exportando: ${error.message}`
      }, ...prev.slice(0, 9)])
    } finally {
      setIsExporting(false)
      setShowExportModal(false)
    }
  }, [name, globalVariables])

  // Exportar como imagen
  const exportAsImage = async () => {
    // Implementación básica - en producción usaríamos html2canvas
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 1200
      canvas.height = 800
      
      // Background
      ctx.fillStyle = '#0f1117'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Title
      ctx.fillStyle = '#cbd5e1'
      ctx.font = 'bold 24px Inter'
      ctx.fillText(name, 50, 50)
      
      // Nodes y edges (simplificado)
      ctx.fillStyle = '#6366f1'
      nodesRef.current.forEach((node, index) => {
        const x = 100 + (index % 4) * 250
        const y = 150 + Math.floor(index / 4) * 200
        ctx.fillRect(x, y, 180, 80)
        ctx.fillStyle = '#cbd5e1'
        ctx.font = '14px Inter'
        ctx.fillText(node.data?.title || 'Node', x + 10, y + 45)
        ctx.fillStyle = '#6366f1'
      })
      
      canvas.toBlob((blob) => {
        resolve(blob)
      })
    })
  }

  // Importar workflow
  const importWorkflow = useCallback(async (file) => {
    setIsImporting(true)
    
    try {
      const text = await file.text()
      let workflowData

      // Detectar formato y parsear
      if (file.name.endsWith('.json')) {
        workflowData = JSON.parse(text)
      } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        // Parseo YAML simple (en producción usaríamos yaml parser)
        workflowData = parseSimpleYAML(text)
      } else {
        throw new Error('Formato de archivo no soportado')
      }

      // Validar datos importados
      const validation = validateImportedData(workflowData)
      if (!validation.valid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`)
      }

      // Cargar datos importados
      if (workflowData.nodes) setNodes(workflowData.nodes)
      if (workflowData.edges) setEdges(workflowData.edges)
      if (workflowData.variables) setGlobalVariables(workflowData.variables)
      if (workflowData.name) setName(workflowData.name)

      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'IMPORT', color: '#22c55e',
        msg: `Workflow importado: ${workflowData.nodes?.length || 0} nodos`
      }, ...prev.slice(0, 9)])

    } catch (error) {
      console.error('Error importando workflow:', error)
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error importando: ${error.message}`
      }, ...prev.slice(0, 9)])
    } finally {
      setIsImporting(false)
      setShowImportModal(false)
      setImportFile(null)
    }
  }, [setNodes, setEdges, setGlobalVariables, setName])

  // Validar datos importados
  const validateImportedData = (data) => {
    const errors = []
    
    if (!data.nodes || !Array.isArray(data.nodes)) {
      errors.push('Nodes inválidos o faltantes')
    }
    
    if (!data.edges || !Array.isArray(data.edges)) {
      errors.push('Edges inválidos o faltantes')
    }
    
    // Validar estructura de nodos
    data.nodes?.forEach((node, index) => {
      if (!node.id) errors.push(`Nodo ${index}: ID faltante`)
      if (!node.position) errors.push(`Nodo ${index}: Posición faltante`)
      if (!node.data) errors.push(`Nodo ${index}: Data faltante`)
    })
    
    // Validar estructura de edges
    data.edges?.forEach((edge, index) => {
      if (!edge.source) errors.push(`Edge ${index}: Source faltante`)
      if (!edge.target) errors.push(`Edge ${index}: Target faltante`)
    })
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Parseo YAML simple
  const parseSimpleYAML = (text) => {
    const lines = text.split('\n')
    const result = { nodes: [], edges: [] }
    let currentSection = null
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('name:')) {
        result.name = trimmed.split(':')[1].trim()
      } else if (trimmed === 'nodes:') {
        currentSection = 'nodes'
      } else if (trimmed === 'edges:') {
        currentSection = 'edges'
      } else if (trimmed.startsWith('- id:') && currentSection === 'nodes') {
        const node = { id: trimmed.split(':')[1].trim() }
        result.nodes.push(node)
      } else if (trimmed.startsWith('from:') && currentSection === 'edges') {
        const edge = { source: trimmed.split(':')[1].trim() }
        result.edges.push(edge)
      }
    })
    
    return result
  }

  // Optimizar workflow con AI
  const optimizeWorkflow = useCallback(async () => {
    try {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'INFO', color: '#6366f1',
        msg: 'Analizando workflow con AI...'
      }, ...prev.slice(0, 9)])

      const workflowData = {
        name,
        nodes: nodesRef.current,
        edges: edgesRef.current,
        variables: globalVariables
      }

      const response = await fetch('http://localhost:3001/api/copilot/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Optimiza este workflow para mejor rendimiento y mantenibilidad: ${JSON.stringify(workflowData)}` 
        })
      })

      const data = await response.json()
      
      if (data.success && data.suggestions) {
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'AI', color: '#06b6d4',
          msg: `AI sugiere: ${data.suggestions.slice(0, 100)}...`
        }, ...prev.slice(0, 9)])
      }

    } catch (error) {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Error optimizando: ${error.message}`
      }, ...prev.slice(0, 9)])
    }
  }, [name, globalVariables])

  // Sistema de breakpoints para debugging
  const [breakpoints, setBreakpoints] = useState([])
  const [debugMode, setDebugMode] = useState(false)
  const [currentDebugNode, setCurrentDebugNode] = useState(null)
  const [debugStep, setDebugStep] = useState('stopped') // 'stopped', 'running', 'paused'

  // Filtrar nodos según término de búsqueda
  const filteredNodeLibrary = NODE_LIBRARY.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kind.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  // Guardar estado en historial
  const saveToHistory = useCallback((newNodes, newEdges) => {
    const newHistory = {
      nodes: [...newNodes],
      edges: [...newEdges]
    }
    
    setHistory(prev => {
      const newHistoryList = prev.nodes.length === 0 
        ? [newHistory]
        : [...prev.nodes.slice(0, historyIndex + 1), newHistory]
      
      setHistoryIndex(newHistoryList.length - 1)
      setCanUndo(newHistoryList.length > 1)
      setCanRedo(false)
      
      return { nodes: newHistoryList }
    })
  }, [historyIndex])

  // Deshacer
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const prevState = history.nodes[newIndex]
      
      setNodes(prevState.nodes)
      setEdges(prevState.edges)
      setHistoryIndex(newIndex)
      setCanUndo(newIndex > 0)
      setCanRedo(true)
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'UNDO', color: '#f59e0b',
        msg: 'Deshacer acción'
      }, ...prev.slice(0, 9)])
    }
  }, [historyIndex, history])

  // Copiar nodos seleccionados
  const copyNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected)
    const nodesToCopy = selectedNodes.length > 0 ? selectedNodes : nodesRef.current
    
    if (nodesToCopy.length > 0) {
      setCopiedNodes(nodesToCopy)
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'COPY', color: '#22c55e',
        msg: `${nodesToCopy.length} nodo(s) copiado(s)`
      }, ...prev.slice(0, 9)])
    }
  }, [nodes])

  // Pegar nodos copiados
  const pasteNodes = useCallback(() => {
    if (copiedNodes.length === 0) return

    const offset = 50 // Desplazamiento para que no se superpongan
    const newNodes = copiedNodes.map((node, index) => {
      const newNode = {
        ...node,
        id: makeId(), // Nuevo ID único
        position: {
          x: node.position.x + offset,
          y: node.position.y + offset
        },
        data: {
          ...node.data,
          label: (
            <NodeContent
              title={node.data?.title || 'Node'}
              kind={node.data?.kind || 'action'}
              icon={node.data?.icon || '⚡'}
              onDelete={() => {
                setNodes((nds) => nds.filter((n) => n.id !== node.id))
              }}
            />
          )
        }
      }
      return newNode
    })

    const updatedNodes = [...nodesRef.current, ...newNodes]
    setNodes(updatedNodes)
    saveToHistory(updatedNodes, edgesRef.current)
    
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'PASTE', color: '#22c55e',
      msg: `${newNodes.length} nodo(s) pegado(s)`
    }, ...prev.slice(0, 9)])
  }, [copiedNodes, saveToHistory])

  // Funciones para gestionar variables globales
  const addGlobalVariable = useCallback(() => {
    const newVar = {
      id: `var_${Date.now()}`,
      name: `variable_${globalVariables.length + 1}`,
      value: '',
      type: 'string',
      description: ''
    }
    setGlobalVariables(prev => [...prev, newVar])
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'VARIABLE', color: '#22c55e',
      msg: `Variable "${newVar.name}" creada`
    }, ...prev.slice(0, 9)])
  }, [globalVariables.length])

  const updateGlobalVariable = useCallback((id, field, value) => {
    setGlobalVariables(prev => prev.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'VARIABLE', color: '#06b6d4',
      msg: `Variable actualizada`
    }, ...prev.slice(0, 9)])
  }, [])

  const deleteGlobalVariable = useCallback((id) => {
    const variable = globalVariables.find(v => v.id === id)
    setGlobalVariables(prev => prev.filter(v => v.id !== id))
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'VARIABLE', color: '#ef4444',
      msg: `Variable "${variable.name}" eliminada`
    }, ...prev.slice(0, 9)])
  }, [globalVariables])

  // Funciones para gestionar breakpoints
  const toggleBreakpoint = useCallback((nodeId) => {
    setBreakpoints(prev => {
      if (prev.includes(nodeId)) {
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'DEBUG', color: '#f59e0b',
          msg: `Breakpoint eliminado en nodo ${nodeId}`
        }, ...prev.slice(0, 9)])
        return prev.filter(id => id !== nodeId)
      } else {
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'DEBUG', color: '#f59e0b',
          msg: `Breakpoint agregado en nodo ${nodeId}`
        }, ...prev.slice(0, 9)])
        return [...prev, nodeId]
      }
    })
  }, [])

  const toggleDebugMode = useCallback(() => {
    const newMode = !debugMode
    setDebugMode(newMode)
    setDebugStep('stopped')
    setCurrentDebugNode(null)
    
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'DEBUG', color: '#f59e0b',
      msg: `Debug mode ${newMode ? 'activado' : 'desactivado'}`
    }, ...prev.slice(0, 9)])
  }, [debugMode])

  const startDebug = useCallback(() => {
    if (breakpoints.length === 0) {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'WARN', color: '#f59e0b',
        msg: 'No hay breakpoints definidos'
      }, ...prev.slice(0, 9)])
      return
    }
    
    setDebugStep('running')
    setCurrentDebugNode(breakpoints[0])
    
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'DEBUG', color: '#22c55e',
      msg: `Debug iniciado - ${breakpoints.length} breakpoints`
    }, ...prev.slice(0, 9)])
  }, [breakpoints])

  const nextDebugStep = useCallback(() => {
    const currentIndex = breakpoints.indexOf(currentDebugNode)
    if (currentIndex < breakpoints.length - 1) {
      const nextNode = breakpoints[currentIndex + 1]
      setCurrentDebugNode(nextNode)
      setDebugStep('paused')
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'DEBUG', color: '#06b6d4',
        msg: `Pausado en nodo: ${nextNode}`
      }, ...prev.slice(0, 9)])
    } else {
      setDebugStep('stopped')
      setCurrentDebugNode(null)
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'DEBUG', color: '#22c55e',
        msg: 'Debug completado'
      }, ...prev.slice(0, 9)])
    }
  }, [breakpoints, currentDebugNode])

  const stopDebug = useCallback(() => {
    setDebugStep('stopped')
    setCurrentDebugNode(null)
    
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'DEBUG', color: '#ef4444',
      msg: 'Debug detenido'
    }, ...prev.slice(0, 9)])
  }, [])

  // Cambiar tema
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'THEME', color: '#22c55e',
      msg: `Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`
    }, ...prev.slice(0, 9)])
  }, [theme])

  // Rehacer
  const redo = useCallback(() => {
    if (historyIndex < history.nodes.length - 1) {
      const newIndex = historyIndex + 1
      const nextState = history.nodes[newIndex]
      
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setHistoryIndex(newIndex)
      setCanUndo(true)
      setCanRedo(newIndex < history.nodes.length - 1)
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'REDO', color: '#f59e0b',
        msg: 'Rehacer acción'
      }, ...prev.slice(0, 9)])
    }
  }, [historyIndex, history])

  const handleSave = async () => {
  setSaving(true)
  
  try {
    // Validar datos antes de guardar
    const validation = validateWorkflowData(nodesRef.current, edgesRef.current)
    
    // Mostrar resultados de validación
    if (validation.errors.length > 0) {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Errores de validación: ${validation.errors.join(', ')}`
      }, ...prev.slice(0, 9)])
      return
    }
    
    // Mostrar advertencias si existen
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        setLogs(prev => [{
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          type: 'WARN', color: '#f59e0b',
          msg: `Advertencia: ${warning}`
        }, ...prev.slice(0, 9)])
      })
    }
    
    // Mostrar estadísticas
    if (validation.stats) {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'INFO', color: '#6366f1',
        msg: `Workflow: ${validation.stats.totalNodes} nodos, ${validation.stats.totalEdges} conexiones`
      }, ...prev.slice(0, 9)])
    }
    
    // Siempre usar el ID actual o generar uno nuevo si no existe
    let workflowId = id
    if (!workflowId || workflowId === 'new') {
      // Generar un ID único compatible con el backend
      workflowId = 'WF-' + Math.floor(Math.random() * 900 + 100)
      
      // Crear nuevo workflow
      const result = await workflowsApi.create({ 
        name,
        nodes: nodesRef.current,
        edges: edgesRef.current,
        variables: globalVariables // Guardar variables globales
      })
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'SAVE', color: '#22c55e',
        msg: `Workflow "${name}" creado exitosamente` 
      }, ...prev.slice(0, 9)])
      
      // Actualizar la URL sin perder los datos
      navigate(`/editor/${result.data.id}`, { replace: true })
    } else {
      // Actualizar workflow existente
      await workflowsApi.update(workflowId, {
        name,
        nodes: nodesRef.current,
        edges: edgesRef.current,
        variables: globalVariables // Guardar variables globales
      })
      
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'SAVE', color: '#22c55e',
        msg: `Workflow "${name}" guardado` 
      }, ...prev.slice(0, 9)])
    }
  } catch (err) {
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'ERROR', color: '#ef4444',
      msg: `Error al guardar: ${err.message}` 
    }, ...prev.slice(0, 9)])
  } finally {
    setSaving(false)
  }
}

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S: Guardar
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      // Ctrl+Z: Deshacer
      else if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      // Ctrl+Y: Rehacer (o Ctrl+Shift+Z)
      else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        redo()
      }
      // Ctrl+C: Copiar
      else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault()
        copyNodes()
      }
      // Ctrl+V: Pegar
      else if (e.ctrlKey && e.key === 'v') {
        e.preventDefault()
        pasteNodes()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, undo, redo, copyNodes, pasteNodes])

  // Auto-guardado automático cada 30 segundos
  useEffect(() => {
    if (!id || id === 'new') return

    const autoSaveInterval = setInterval(async () => {
      if (nodesRef.current.length > 0) {
        try {
          const workflowName = name || 'Workflow'
          const dataToSave = {
            name: workflowName,
            nodes: nodesRef.current,
            edges: edgesRef.current
          }
          
          localStorage.setItem(`workflow_${id}`, JSON.stringify(dataToSave))
          
          setLogs(prev => [{
            time: new Date().toLocaleTimeString('en', { hour12: false }),
            type: 'AUTO', color: '#06b6d4',
            msg: 'Auto-guardado completado'
          }, ...prev.slice(0, 9)])
        } catch (error) {
          console.warn('Error en auto-guardado:', error)
        }
      }
    }, 30000) // 30 segundos

    return () => clearInterval(autoSaveInterval)
  }, [id, name])

  // Función para validar datos del workflow
  const validateWorkflowData = (nodes, edges) => {
    const errors = []
    const warnings = []
    
    // Validación básica de estructura
    if (!Array.isArray(nodes)) {
      errors.push('Los nodos deben ser un array')
      return { valid: false, errors, warnings }
    }
    
    if (!Array.isArray(edges)) {
      errors.push('Las conexiones deben ser un array')
      return { valid: false, errors, warnings }
    }
    
    // Validar estructura de nodos
    nodes.forEach((node, index) => {
      if (!node.id) errors.push(`Nodo ${index}: falta ID`)
      if (!node.position) errors.push(`Nodo ${index}: falta posición`)
      if (!node.data) errors.push(`Nodo ${index}: falta data`)
      if (!node.data.title) warnings.push(`Nodo ${index}: sin título`)
      if (!node.data.kind) warnings.push(`Nodo ${index}: sin tipo definido`)
    })
    
    // Validar estructura de edges
    edges.forEach((edge, index) => {
      if (!edge.id) errors.push(`Conexión ${index}: falta ID`)
      if (!edge.source) errors.push(`Conexión ${index}: falta source`)
      if (!edge.target) errors.push(`Conexión ${index}: falta target`)
      
      // Validar que source y target existan
      const sourceExists = nodes.some(n => n.id === edge.source)
      const targetExists = nodes.some(n => n.id === edge.target)
      
      if (!sourceExists) errors.push(`Conexión ${index}: source "${edge.source}" no existe`)
      if (!targetExists) errors.push(`Conexión ${index}: target "${edge.target}" no existe`)
    })
    
    // Validaciones de lógica de workflow
    const triggerNodes = nodes.filter(n => n.data?.kind === 'trigger')
    const actionNodes = nodes.filter(n => n.data?.kind === 'action')
    const logicNodes = nodes.filter(n => n.data?.kind === 'logic')
    
    if (nodes.length > 0 && triggerNodes.length === 0) {
      warnings.push('No hay nodos trigger - el workflow no se iniciará automáticamente')
    }
    
    if (triggerNodes.length > 1) {
      warnings.push('Múltiples nodos trigger - puede haber ejecuciones simultáneas')
    }
    
    // Validar que todos los triggers tengan conexiones salientes
    triggerNodes.forEach(trigger => {
      const hasOutgoingEdges = edges.some(e => e.source === trigger.id)
      if (!hasOutgoingEdges) {
        warnings.push(`Trigger "${trigger.data?.title}" no tiene conexiones salientes`)
      }
    })
    
    // Validar que todos los action nodes tengan conexiones entrantes
    actionNodes.forEach(action => {
      const hasIncomingEdges = edges.some(e => e.target === action.id)
      if (!hasIncomingEdges) {
        warnings.push(`Action "${action.data?.title}" no tiene conexiones entrantes`)
      }
    })
    
    // Validar ciclos (bucles infinitos)
    const visited = new Set()
    const recursionStack = new Set()
    
    const hasCycle = (nodeId) => {
      if (recursionStack.has(nodeId)) return true
      if (visited.has(nodeId)) return false
      
      visited.add(nodeId)
      recursionStack.add(nodeId)
      
      const outgoingEdges = edges.filter(e => e.source === nodeId)
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true
      }
      
      recursionStack.delete(nodeId)
      return false
    }
    
    for (const node of nodes) {
      if (hasCycle(node.id)) {
        errors.push('Se detectó un ciclo en el workflow - puede causar ejecución infinita')
        break
      }
    }
    
    // Validar nodos desconectados
    const connectedNodes = new Set()
    edges.forEach(edge => {
      connectedNodes.add(edge.source)
      connectedNodes.add(edge.target)
    })
    
    const disconnectedNodes = nodes.filter(n => !connectedNodes.has(n.id))
    if (disconnectedNodes.length > 0) {
      warnings.push(`${disconnectedNodes.length} nodo(s) desconectado(s)`)
    }
    
    // Validar variables globales usadas (solo si globalVariables está disponible)
    const usedVariables = new Set()
    nodes.forEach(node => {
      // Simular búsqueda de variables en el contenido del nodo
      const nodeContent = JSON.stringify(node.data || {})
      const variableMatches = nodeContent.match(/\$\{?(\w+)\}?/g)
      if (variableMatches) {
        variableMatches.forEach(match => {
          const varName = match.replace(/\$|\{|\}/g, '')
          usedVariables.add(varName)
        })
      }
    })
    
    // Solo validar variables si están definidas
    if (typeof globalVariables !== 'undefined' && Array.isArray(globalVariables)) {
      const definedVariables = new Set(globalVariables.map(v => v.name))
      const undefinedVariables = Array.from(usedVariables).filter(v => !definedVariables.has(v))
      
      if (undefinedVariables.length > 0) {
        warnings.push(`Variables no definidas: ${undefinedVariables.join(', ')}`)
      }
    }
    
    return { 
      valid: errors.length === 0, 
      errors, 
      warnings,
      stats: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        triggerNodes: triggerNodes.length,
        actionNodes: actionNodes.length,
        logicNodes: logicNodes.length,
        disconnectedNodes: disconnectedNodes.length
      }
    }
  }

  // Función para guardar en localStorage como respaldo
  const saveToLocal = (workflowId, data) => {
    try {
      localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(data))
    } catch (err) {
      // Silenciar errores de localStorage en producción
    }
  }

  // Función para cargar desde localStorage como respaldo
  const loadFromLocal = (workflowId) => {
    try {
      const data = localStorage.getItem(`workflow_${workflowId}`)
      if (data) {
        return JSON.parse(data)
      }
    } catch (err) {
      // Silenciar errores de localStorage en producción
    }
    return null
  }

  // Función para cargar y reconstruir nodos
  const loadAndReconstructNodes = useCallback((data, source) => {
    if (!data || !data.nodes) {
      return false
    }
    
    setName(data.name || 'Workflow')
    
    const loadedNodes = data.nodes.map(node => {
      return {
        id: node.id,
        position: node.position || { x: 0, y: 0 },
        data: {
          title: node.data?.title || 'Node',
          kind: node.data?.kind || 'action',
          icon: node.data?.icon || '⚡',
          label: (
            <NodeContent
              title={node.data?.title || 'Node'}
              kind={node.data?.kind || 'action'}
              icon={node.data?.icon || '⚡'}
              onDelete={() => {
                setNodes((nds) => nds.filter((n) => n.id !== node.id))
              }}
            />
          )
        },
        style: node.style || {
          borderRadius: '12px', padding: '2px',
          border: '1px solid rgba(99,102,241,0.3)', background: '#1a1d27',
          color: '#f1f5f9', boxShadow: '0 0 20px rgba(99,102,241,0.15)',
        }
      }
    })
    
    const loadedEdges = data.edges || []
    
    // Actualizar estado de forma síncrona y simple
    setNodes(loadedNodes)
    setEdges(loadedEdges)
    nodesRef.current = loadedNodes
    edgesRef.current = loadedEdges
    
    return true
  }, [setNodes, setEdges])

  useEffect(() => {
    if (id && id !== 'new') {
      // 1. Primero intentar cargar desde localStorage
      const localData = loadFromLocal(id)
      
      if (localData) {
        loadAndReconstructNodes(localData, 'localStorage')
      } else {
        // 2. Cargar desde la API si no hay datos locales
        workflowsApi.get(id)
          .then(res => {
            if (res.success && res.data) {
              loadAndReconstructNodes(res.data, 'API')
              // Guardar en localStorage como respaldo
              saveToLocal(id, {
                name: res.data.name,
                nodes: res.data.nodes || [],
                edges: res.data.edges || []
              })
            }
          })
          .catch(err => {
            setLogs(prev => [{
              time: new Date().toLocaleTimeString('en', { hour12: false }),
              type: 'ERROR', color: '#ef4444',
              msg: 'Error cargando workflow desde API'
            }, ...prev])
          })
      }
    } else {
      // Limpiar estado para nuevo workflow
      setNodes([])
      setEdges([])
      nodesRef.current = []
      edgesRef.current = []
    }
  }, [id, loadAndReconstructNodes])

  const handleRun = async () => {
    if (!id || id === 'new') {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: 'Save workflow first before running'
      }, ...prev])
      setRunning(false)
      return
    }

    setRunning(true)
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      type: 'START', color: CYAN,
      msg: 'Starting workflow execution...'
    }, ...prev])

    try {
      const response = await fetch(`http://localhost:3001/api/workflows/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.logs) {
        data.logs.forEach(log => {
          setLogs(prev => [{
            time: new Date(log.time).toLocaleTimeString('en', { hour12: false }),
            type: log.type,
            color: log.type === 'ERROR' ? '#ef4444' : 
                   log.type === 'SUCCESS' ? '#22c55e' : CYAN,
            msg: log.message
          }, ...prev])
        })
      }
    } catch (err) {
      setLogs(prev => [{
        time: new Date().toLocaleTimeString('en', { hour12: false }),
        type: 'ERROR', color: '#ef4444',
        msg: `Execution failed: ${err.message}` 
      }, ...prev])
    } finally {
      setRunning(false)
    }
  }

  const handleCopilot = async () => {
    if (!copilotMsg.trim()) return
    const msg = copilotMsg
    setCopilotLoading(true)
    setChat(prev => [...prev, { from: 'user', text: msg }])
    setCopilotMsg('')
    setChat(prev => [...prev, { from: 'ai', text: '...' }])
    
    try {
      const response = await fetch('http://localhost:3001/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setChat(prev => [
        ...prev.slice(0, -1),
        { from: 'ai', text: data.reply }
      ])
    } catch (err) {
      console.error('Copilot error:', err)
      setChat(prev => [
        ...prev.slice(0, -1),
        { from: 'ai', text: `Error: ${err.message}. Verificá la consola para más detalles.` }
      ])
    } finally {
      setCopilotLoading(false)
    }
  }

  const onDragStart = (e, payload) => {
    e.dataTransfer.setData('application/flowly', JSON.stringify(payload))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .node-item:hover { border-color: rgba(99,102,241,0.4) !important; background: rgba(99,102,241,0.05) !important; }
        .react-flow__controls { background: #1a1d27 !important; border: 1px solid rgba(255,255,255,0.06) !important; border-radius: 8px !important; }
        .react-flow__controls-button { background: #1a1d27 !important; border-color: rgba(255,255,255,0.06) !important; color: #94a3b8 !important; }
        .react-flow__minimap { background: #1a1d27 !important; border: 1px solid rgba(255,255,255,0.06) !important; border-radius: 8px !important; }
      `}</style>

      {/* HEADER */}
      <header style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0f1117', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <div style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '50%', opacity: 0.2, filter: 'blur(4px)' }} />
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
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
            <span style={{ color: 'white', fontWeight: 900, fontSize: '15px', letterSpacing: '-0.5px' }}>FLOWLY</span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '15px', fontWeight: 600, outline: 'none', width: '240px', fontFamily: 'inherit' }} />
            <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>Editado hace 2 min · v2.4.1</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={toggleTheme}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '7px 12px', 
              borderRadius: '8px', 
              border: `1px solid ${currentTheme.border}`, 
              background: currentTheme.hover, 
              color: currentTheme.text, 
              fontSize: '13px', 
              fontWeight: 500, 
              cursor: 'pointer' 
            }}
            title={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
            
            {/* Botón de Backup en la Nube */}
            <button 
              onClick={() => setShowBackupModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid rgba(34,197,94,0.3)`, 
                background: 'rgba(34,197,94,0.1)', 
                color: '#22c55e', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Backup en la nube"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>cloud_sync</span>
            </button>
            
            {/* Botón de Personalización Visual */}
            <button 
              onClick={() => setShowCustomizationModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid rgba(139,92,246,0.3)`, 
                background: 'rgba(139,92,246,0.1)', 
                color: '#8b5cf7', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Personalización Visual"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>palette</span>
            </button>
            
            {/* Botón de Integraciones Externas */}
            <button 
              onClick={() => setShowIntegrationsModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid rgba(245,158,11,0.3)`, 
                background: 'rgba(245,158,11,0.1)', 
                color: '#f59e0b', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Integraciones Externas"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>extension</span>
            </button>
            
            {/* Botón de Analytics */}
            <button 
              onClick={() => {
                setShowAnalyticsModal(true)
                updateAnalytics()
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid rgba(139,92,246,0.3)`, 
                background: 'rgba(139,92,246,0.1)', 
                color: '#8b5cf7', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Analytics Dashboard"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>analytics</span>
            </button>
            
            {/* Botón de Templates Gallery */}
            <button 
              onClick={() => setShowTemplatesModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid rgba(168,85,247,0.3)`, 
                background: 'rgba(168,85,247,0.1)', 
                color: '#a855f7', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Templates Gallery"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>dashboard_customize</span>
            </button>
            
            {/* Botón de Share */}
            <button 
              onClick={() => setShowShareModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid rgba(6,182,212,0.3)`, 
                background: 'rgba(6,182,212,0.1)', 
                color: '#06b6d4', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Compartir workflow"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>share</span>
            </button>
            
            {/* Botones de Export/Import */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button 
              onClick={() => setShowExportModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid ${currentTheme.border}`, 
                background: currentTheme.hover, 
                color: currentTheme.text, 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Exportar workflow"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>download</span>
            </button>
            
            <button 
              onClick={() => setShowImportModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid ${currentTheme.border}`, 
                background: currentTheme.hover, 
                color: currentTheme.text, 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Importar workflow"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>upload</span>
            </button>
            
            <button 
              onClick={optimizeWorkflow}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '7px 12px', 
                borderRadius: '8px', 
                border: `1px solid rgba(6,182,212,0.3)`, 
                background: 'rgba(6,182,212,0.1)', 
                color: '#06b6d4', 
                fontSize: '13px', 
                fontWeight: 500, 
                cursor: 'pointer' 
              }}
              title="Optimizar con AI"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>auto_fix_high</span>
            </button>
          </div>
          
          {/* Controles de Debug */}
          {debugMode && (
            <>
              <div style={{ width: '1px', height: '24px', background: currentTheme.border }} />
              <button 
                onClick={debugStep === 'stopped' ? startDebug : stopDebug}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '7px 12px', 
                  borderRadius: '8px', 
                  border: `1px solid ${currentTheme.border}`, 
                  background: debugStep === 'running' ? 'rgba(239,68,68,0.1)' : currentTheme.hover, 
                  color: debugStep === 'running' ? '#ef4444' : currentTheme.text, 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  cursor: 'pointer' 
                }}
                title={debugStep === 'stopped' ? 'Iniciar Debug' : 'Detener Debug'}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>
                  {debugStep === 'stopped' ? 'play_arrow' : 'stop'}
                </span>
                {debugStep === 'stopped' ? 'Debug' : 'Stop'}
              </button>
              
              {debugStep === 'paused' && (
                <button 
                  onClick={nextDebugStep}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '7px 12px', 
                    borderRadius: '8px', 
                    border: `1px solid ${currentTheme.border}`, 
                    background: 'rgba(34,197,94,0.1)', 
                    color: '#22c55e', 
                    fontSize: '13px', 
                    fontWeight: 500, 
                    cursor: 'pointer' 
                  }}
                  title="Siguiente paso"
                >
                  <span className="material-icons" style={{ fontSize: '16px' }}>skip_next</span>
                  Step
                </button>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.3)` }}>
                <span style={{ fontSize: '10px', color: '#6366f1', fontWeight: 600 }}>
                  {breakpoints.length} BP
                </span>
                {currentDebugNode && (
                  <span style={{ fontSize: '10px', color: '#06b6d4' }}>
                    → {currentDebugNode.slice(-4)}
                  </span>
                )}
              </div>
            </>
          )}
          
          <button 
            onClick={toggleDebugMode}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '7px 12px', 
              borderRadius: '8px', 
              border: `1px solid ${currentTheme.border}`, 
              background: debugMode ? 'rgba(99,102,241,0.1)' : currentTheme.hover, 
              color: debugMode ? '#6366f1' : currentTheme.text, 
              fontSize: '13px', 
              fontWeight: 500, 
              cursor: 'pointer' 
            }}
            title={debugMode ? 'Desactivar Debug Mode' : 'Activar Debug Mode'}
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>bug_report</span>
            {debugMode ? 'Debug ON' : 'Debug'}
          </button>
          
          <button 
            onClick={undo} 
            disabled={!canUndo}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', 
              borderRadius: '8px', border: `1px solid ${currentTheme.border}`, 
              background: canUndo ? currentTheme.hover : 'transparent', 
              color: canUndo ? currentTheme.text : currentTheme.textMuted, fontSize: '13px', fontWeight: 500, 
              cursor: canUndo ? 'pointer' : 'not-allowed' 
            }}
            title="Deshacer (Ctrl+Z)"
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>undo</span>
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', 
              borderRadius: '8px', border: `1px solid ${currentTheme.border}`, 
              background: canRedo ? currentTheme.hover : 'transparent', 
              color: canRedo ? currentTheme.text : currentTheme.textMuted, fontSize: '13px', fontWeight: 500, 
              cursor: canRedo ? 'pointer' : 'not-allowed' 
            }}
            title="Rehacer (Ctrl+Y)"
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>redo</span>
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '8px', border: `1px solid ${currentTheme.border}`, background: currentTheme.hover, color: currentTheme.text, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
            title="Guardar (Ctrl+S)"
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>save</span>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={handleRun} disabled={running}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <span className="material-icons" style={{ fontSize: '16px' }}>play_arrow</span>
            {running ? 'Ejecutando...' : 'Run Test'}
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 15px rgba(99,102,241,0.3)' }}>
            <span className="material-icons" style={{ fontSize: '16px' }}>rocket_launch</span>
            Deploy
          </button>
        </div>
      </header>

      {/* BODY */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar izquierdo */}
        <aside style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0a0d13', overflow: 'hidden' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <input 
              placeholder="Buscar componentes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                background: '#0f1117', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '8px', 
                color: '#cbd5e1', 
                fontSize: '13px', 
                outline: 'none', 
                fontFamily: 'inherit', 
                boxSizing: 'border-box' 
              }}
            />
          </div>
          
          {/* Tabs para cambiar entre componentes y templates */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button 
              onClick={() => setActiveTab('components')}
              style={{ 
                flex: 1, 
                padding: '8px', 
                background: activeTab === 'components' ? 'rgba(99,102,241,0.2)' : 'transparent', 
                border: 'none', 
                color: activeTab === 'components' ? '#6366f1' : '#64748b', 
                fontSize: '11px', 
                fontWeight: 600, 
                cursor: 'pointer' 
              }}
            >
              Componentes
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              style={{ 
                flex: 1, 
                padding: '8px', 
                background: activeTab === 'templates' ? 'rgba(99,102,241,0.2)' : 'transparent', 
                border: 'none', 
                color: activeTab === 'templates' ? '#6366f1' : '#64748b', 
                fontSize: '11px', 
                fontWeight: 600, 
                cursor: 'pointer' 
              }}
            >
              Templates
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {activeTab === 'components' ? (
              filteredNodeLibrary.map(section => (
                <div key={section.group} style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#475569', marginBottom: '8px', padding: '0 4px' }}>{section.group}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {section.items.map(item => (
                      <div key={item.title} className="node-item"
                        draggable onDragStart={e => onDragStart(e, item)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#1a1d27', cursor: 'grab', transition: 'all 0.15s' }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', margin: 0 }}>{item.title}</p>
                          <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0' }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <>
                <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#475569', marginBottom: '12px', padding: '0 4px' }}>TEMPLATES POPULARES</p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                  padding: '16px'
                }}>
                  {WORKFLOW_TEMPLATES.filter(t => t.popular).map(template => (
                    <div
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start', 
                        gap: '0px', 
                        padding: '20px', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        background: 'linear-gradient(145deg, #1e293b, #0f172a)', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(145deg, #334155, #1e293b)'
                        e.currentTarget.style.borderColor = `${template.color || '#6366f1'}40`
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                        e.currentTarget.style.boxShadow = `0 20px 40px ${template.color ? template.color + '25' : 'rgba(99,102,241,0.25)'}`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(145deg, #1e293b, #0f172a)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {/* Icono del template con fondo gradiente */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${template.color || '#6366f1'}, ${template.color ? template.color + '80' : '#8b5cf6'})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                        boxShadow: `0 4px 12px ${template.color ? template.color + '20' : 'rgba(99,102,241,0.2)'}`
                      }}>
                      <span style={{ 
                        fontSize: '24px', 
                        color: '#ffffff',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                      }}>{template.icon}</span>
                    </div>
                    
                    {/* Contenido del template */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: 700, 
                        color: '#f8fafc', 
                        margin: '0 0 6px 0',
                        letterSpacing: '-0.02em'
                      }}>{template.name}</h3>
                      
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#94a3b8', 
                        margin: '0 0 10px 0', 
                        lineHeight: 1.4 
                      }}>{template.description}</p>
                      
                      {/* Metadatos del template */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ 
                          fontSize: '10px', 
                          padding: '3px 8px', 
                          background: `${template.color ? template.color + '15' : 'rgba(99,102,241,0.15)'}`, 
                          color: template.color || '#6366f1', 
                          borderRadius: '6px', 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {template.category}
                        </span>
                        
                        <span style={{ 
                          fontSize: '10px', 
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span className="material-icons" style={{ fontSize: '12px' }}>account_tree</span>
                          {template.nodes.length} nodos
                        </span>
                        
                        <span style={{ 
                          fontSize: '10px', 
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span className="material-icons" style={{ fontSize: '12px' }}>trending_up</span>
                          Popular
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
            @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
            
            /* Animaciones suaves */
            .react-flow__node {
              transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            .react-flow__node:hover {
              filter: brightness(1.1) !important;
            }
            
            .react-flow__edge {
              transition: stroke 0.2s ease !important;
            }
            
            .react-flow__edge:hover {
              stroke-width: 3px !important;
              filter: brightness(1.2) !important;
            }
            
            .react-flow__edge-path {
              transition: stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            .react-flow__handle {
              transition: all 0.2s ease !important;
            }
            
            .react-flow__handle:hover {
              r: 8px !important;
              filter: brightness(1.3) !important;
            }
            
            /* Animaciones para el sidebar */
            .node-item {
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            .node-item:hover {
              transform: translateX(4px) !important;
              box-shadow: 0 4px 12px rgba(99,102,241,0.15) !important;
            }
            
            /* Animaciones para botones */
            button {
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            button:hover:not(:disabled) {
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            }
            
            button:active:not(:disabled) {
              transform: translateY(0) !important;
            }
            
            /* Animaciones para inputs */
            input, textarea, select {
              transition: all 0.2s ease !important;
            }
            
            input:focus, textarea:focus, select:focus {
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 12px rgba(99,102,241,0.2) !important;
            }
            
            /* Animaciones para tabs */
            .tab-button {
              position: relative;
              transition: all 0.2s ease !important;
            }
            
            .tab-button::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              width: 0;
              height: 2px;
              background: #6366f1;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              transform: translateX(-50%);
            }
            
            .tab-button.active::after {
              width: 100%;
            }
            
            /* Animaciones para tooltips */
            .tooltip {
              animation: tooltipFadeIn 0.2s ease !important;
            }
            
            @keyframes tooltipFadeIn {
              from {
                opacity: 0;
                transform: translateX(-50%) translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
              }
            }
            
            /* Animaciones para logs */
            .log-entry {
              animation: logSlideIn 0.3s ease !important;
            }
            
            @keyframes logSlideIn {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            /* Animación para loading */
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            /* Animaciones para panel derecho */
            @keyframes slideInRight {
              from {
                opacity: 0;
                transform: translateX(100%);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            /* Animaciones para breakpoints */
            .breakpoint-indicator {
              animation: breakpointPulse 2s infinite !important;
            }
            
            @keyframes breakpointPulse {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.7;
                transform: scale(1.1);
              }
            }
            
            /* Animaciones para debug */
            .debug-highlight {
              animation: debugGlow 1s ease-in-out infinite alternate !important;
            }
            
            @keyframes debugGlow {
              from {
                box-shadow: 0 0 20px rgba(99,102,241,0.4);
              }
              to {
                box-shadow: 0 0 30px rgba(99,102,241,0.8);
              }
            }
            
            .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
            .wf-card { transition: all 0.2s ease; }
            .wf-card:hover { border-color: rgba(99,102,241,0.4) !important; transform: translateY(-2px); }
            .wf-card:hover .delete-btn { opacity: 1 !important; transform: scale(1) !important; }
            .wf-card:hover .edit-btn { opacity: 1 !important; transform: scale(1) !important; }
          `}</style>
          <ReactFlowProvider>
            <FlowCanvas 
              key={id} // Key para forzar re-render cuando cambia el workflow
              setLogs={setLogs}
              nodesRef={nodesRef}
              edgesRef={edgesRef}
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
            />
          </ReactFlowProvider>
        </main>

        {/* Botón flotante para ocultar/mostrar panel derecho */}
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          style={{
            position: 'absolute',
            right: showRightPanel ? '348px' : '12px',
            top: '80px',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(99,102,241,0.85))',
            border: '1px solid rgba(99,102,241,0.3)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99,102,241,0.25), 0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}
          title={showRightPanel ? 'Ocultar panel (Alt+R)' : 'Mostrar panel (Alt+R)'}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05) translateY(-2px)'
            e.target.style.boxShadow = '0 8px 30px rgba(99,102,241,0.35), 0 4px 12px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) translateY(0px)'
            e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.25), 0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <span className="material-icons" style={{ 
            fontSize: '20px',
            transition: 'transform 0.3s ease'
          }}>
            {showRightPanel ? 'chevron_right' : 'menu_open'}
          </span>
        </button>

        {/* Sidebar derecho - Compacto y Moderno */}
        {showRightPanel && (
          <aside style={{ 
            width: '340px', 
            flexShrink: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            background: 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)', 
            overflow: 'hidden',
            animation: 'slideInRight 0.3s ease',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.3)'
          }}>
          
          {/* Header del Panel */}
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(99,102,241,0.1)', 
            borderBottom: '1px solid rgba(99,102,241,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '12px', 
                fontWeight: 700, 
                color: '#cbd5e1', 
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Panel de Control
              </h3>
            </div>
            
            {/* Tabs Compactos */}
            <div style={{ 
              display: 'flex', 
              gap: '4px',
              background: 'rgba(0,0,0,0.2)',
              padding: '2px',
              borderRadius: '8px'
            }}>
              {[
                { id: 'logs', label: '📋 Logs', icon: 'list_alt' },
                { id: 'copilot', label: '🤖 AI', icon: 'smart_toy' },
                { id: 'variables', label: '🔧 Variables', icon: 'data_object' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    background: activeRightTab === tab.id 
                      ? 'linear-gradient(135deg, #6366f1, #06b6d4)' 
                      : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: activeRightTab === tab.id ? 'white' : '#64748b',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '12px' }}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel de Logs - Modernizado */}
          {activeRightTab === 'logs' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px',
                padding: '8px 12px',
                background: 'rgba(99,102,241,0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(99,102,241,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-icons" style={{ fontSize: '14px', color: '#6366f1' }}>history</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1' }}>Activity Log</span>
                </div>
                <button 
                  onClick={() => setLogs(INITIAL_LOGS)} 
                  style={{ 
                    fontSize: '10px', 
                    color: '#64748b', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239,68,68,0.1)'
                    e.target.style.color = '#ef4444'
                    e.target.style.borderColor = 'rgba(239,68,68,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                    e.target.style.color = '#64748b'
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                >
                  Clear
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {logs.map((log, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    padding: '8px 12px', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '6px', 
                    border: log.highlight ? `1px solid ${log.color}` : '1px solid transparent',
                    transition: 'all 0.15s',
                    fontSize: '11px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0, 
                      bottom: 0, 
                      width: '3px', 
                      background: log.color,
                      borderRadius: '3px 0 0 3px'
                    }} />
                    <span style={{ fontSize: '10px', color: '#64748b', minWidth: '45px', fontFamily: "'JetBrains Mono', monospace" }}>{log.time}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: log.color, minWidth: '45px' }}>{log.type}</span>
                    <span style={{ fontSize: '11px', color: '#cbd5e1', flex: 1, lineHeight: 1.4 }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panel de Copilot - Modernizado */}
          {activeRightTab === 'copilot' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ 
                padding: '16px', 
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(99,102,241,0.02)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span className="material-icons" style={{ fontSize: '16px', color: '#06b6d4' }}>smart_toy</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1' }}>AI Assistant</span>
                </div>
                <textarea
                  value={copilotMsg}
                  onChange={e => setCopilotMsg(e.target.value)}
                  placeholder="Describe the workflow you want to create..."
                  style={{ 
                    width: '100%', 
                    height: '70px', 
                    padding: '10px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '8px', 
                    color: '#cbd5e1', 
                    fontSize: '12px', 
                    outline: 'none', 
                    fontFamily: 'inherit', 
                    resize: 'none', 
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(99,102,241,0.3)'
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.background = 'rgba(255,255,255,0.03)'
                  }}
                />
                <button 
                  onClick={handleCopilot} 
                  disabled={!copilotMsg.trim() || copilotLoading}
                  style={{ 
                    width: '100%', 
                    marginTop: '10px', 
                    padding: '10px', 
                    background: copilotLoading 
                      ? 'rgba(107,114,128,0.2)' 
                      : 'linear-gradient(135deg, #6366f1, #06b6d4)', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: 'white', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    opacity: (!copilotMsg.trim() || copilotLoading) ? 0.6 : 1, 
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {copilotLoading && (
                    <span className="material-icons" style={{ fontSize: '14px', animation: 'spin 1s linear infinite' }}>refresh</span>
                  )}
                  {copilotLoading ? 'Generating...' : 'Generate Workflow'}
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {chat.map((msg, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      padding: '10px 12px', 
                      background: msg.from === 'ai' 
                        ? 'rgba(255,255,255,0.02)' 
                        : 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))', 
                      borderRadius: '8px', 
                      alignSelf: msg.from === 'ai' ? 'flex-start' : 'flex-end',
                      maxWidth: '90%',
                      border: msg.from === 'ai' 
                        ? '1px solid rgba(255,255,255,0.05)' 
                        : '1px solid rgba(99,102,241,0.2)'
                    }}>
                      <span style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>{msg.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Panel de Variables Globales - Modernizado */}
          {activeRightTab === 'variables' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px',
                padding: '8px 12px',
                background: 'rgba(99,102,241,0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(99,102,241,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-icons" style={{ fontSize: '14px', color: '#a855f7' }}>data_object</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1' }}>Global Variables</span>
                </div>
                <button 
                  onClick={addGlobalVariable}
                  style={{ 
                    fontSize: '10px', 
                    color: '#a855f7', 
                    background: 'rgba(168,85,247,0.1)', 
                    border: '1px solid rgba(168,85,247,0.3)', 
                    borderRadius: '6px', 
                    padding: '6px 10px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(168,85,247,0.2)'
                    e.target.style.borderColor = 'rgba(168,85,247,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(168,85,247,0.1)'
                    e.target.style.borderColor = 'rgba(168,85,247,0.3)'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '12px' }}>add</span>
                  Add
                </button>
              </div>
              
              {globalVariables.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '32px 16px', 
                  color: '#64748b', 
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255,255,255,0.1)'
                }}>
                  <span className="material-icons" style={{ fontSize: '32px', color: '#475569', marginBottom: '12px', display: 'block' }}>code</span>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>No variables defined</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Create variables to share data between nodes</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {globalVariables.map(variable => (
                    <div key={variable.id} style={{ 
                      padding: '12px', 
                      background: 'rgba(255,255,255,0.02)', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.borderColor = 'rgba(168,85,247,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          value={variable.name}
                          onChange={e => updateGlobalVariable(variable.id, 'name', e.target.value)}
                          style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: '#f1f5f9', 
                            fontSize: '12px', 
                            fontWeight: 600, 
                            outline: 'none', 
                            flex: 1,
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                          placeholder="variable_name"
                        />
                        <button
                          onClick={() => deleteGlobalVariable(variable.id)}
                          style={{ 
                            color: '#64748b', 
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#ef4444'
                            e.target.style.background = 'rgba(239,68,68,0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#64748b'
                            e.target.style.background = 'transparent'
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: '14px' }}>delete_outline</span>
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <select
                          value={variable.type}
                          onChange={e => updateGlobalVariable(variable.id, 'type', e.target.value)}
                          style={{ 
                            flex: 1,
                            padding: '6px 8px', 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.08)', 
                            borderRadius: '6px', 
                            color: '#cbd5e1', 
                            fontSize: '11px',
                            outline: 'none'
                          }}
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="object">Object</option>
                        </select>
                        <input
                          value={variable.value}
                          onChange={e => updateGlobalVariable(variable.id, 'value', e.target.value)}
                          style={{ 
                            flex: 2,
                            padding: '6px 8px', 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.08)', 
                            borderRadius: '6px', 
                            color: '#cbd5e1', 
                            fontSize: '11px',
                            outline: 'none',
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                          placeholder="Value"
                        />
                      </div>
                      
                      {variable.description && (
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#64748b', 
                          fontStyle: 'italic',
                          marginTop: '4px',
                          padding: '4px 8px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: '4px'
                        }}>
                          {variable.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0d13', flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ color: '#475569' }}>System Operational</span>
          </div>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ color: '#475569' }}>Nodes: {nodes.length}</span>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ color: '#475569' }}>Edges: {edges.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#64748b' }}>v2.4.1</span>
          <span style={{ cursor: 'pointer' }}>Debug</span>
        </div>
      </footer>

      {/* Modal de Exportación */}
      {showExportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Exportar Workflow</h3>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>Selecciona el formato de exportación:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { value: 'json', label: 'JSON', desc: 'Formato completo con todos los datos', icon: 'code' },
                  { value: 'yaml', label: 'YAML', desc: 'Formato legible para humanos', icon: 'description' },
                  { value: 'image', label: 'Imagen PNG', desc: 'Captura visual del workflow', icon: 'image' }
                ].map(format => (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: exportFormat === format.value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                      border: exportFormat === format.value ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '20px', color: '#6366f1' }}>
                      {format.icon}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{format.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{format.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => exportWorkflow(exportFormat)}
                disabled={isExporting}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  opacity: isExporting ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isExporting && (
                  <span className="material-icons" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>refresh</span>
                )}
                {isExporting ? 'Exportando...' : 'Exportar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Importación */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Importar Workflow</h3>
              <button
                onClick={() => setShowImportModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
                Selecciona un archivo JSON o YAML:
              </p>
              
              <div
                style={{
                  border: '2px dashed rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '32px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => document.getElementById('import-file-input').click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1'
                  e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                <input
                  id="import-file-input"
                  type="file"
                  accept=".json,.yaml,.yml"
                  style={{ display: 'none' }}
                  onChange={(e) => setImportFile(e.target.files[0])}
                />
                
                <span className="material-icons" style={{ fontSize: '48px', color: '#6366f1', marginBottom: '12px', display: 'block' }}>
                  cloud_upload
                </span>
                
                <div style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '4px' }}>
                  {importFile ? importFile.name : 'Haz clic para seleccionar archivo'}
                </div>
                
                <div style={{ color: '#64748b', fontSize: '12px' }}>
                  Formatos soportados: JSON, YAML
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setImportFile(null)
                }}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => importFile && importWorkflow(importFile)}
                disabled={!importFile || isImporting}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: (!importFile || isImporting) ? 'not-allowed' : 'pointer',
                  opacity: (!importFile || isImporting) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isImporting && (
                  <span className="material-icons" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>refresh</span>
                )}
                {isImporting ? 'Importando...' : 'Importar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Backup/Restore en la Nube */}
      {showBackupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Backup en la Nube</h3>
              <button
                onClick={() => setShowBackupModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Estado del Backup */}
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px', 
              background: 'rgba(34,197,94,0.05)', 
              borderRadius: '8px',
              border: '1px solid rgba(34,197,94,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="material-icons" style={{ 
                  fontSize: '20px', 
                  color: backupStatus === 'success' ? '#22c55e' : backupStatus === 'error' ? '#ef4444' : '#64748b'
                }}>
                  {backupStatus === 'success' ? 'cloud_done' : backupStatus === 'error' ? 'cloud_off' : 'cloud'}
                </span>
                <div>
                  <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>
                    {backupStatus === 'success' ? 'Backup Exitoso' : backupStatus === 'error' ? 'Error de Backup' : 'Backup Activo'}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>
                    {backupStatus === 'success' && lastBackup && `Último: ${new Date(lastBackup).toLocaleTimeString()}`}
                    {backupStatus === 'idle' && 'Auto-backup cada 5 minutos'}
                    {backupStatus === 'saving' && 'Guardando...'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={cloudBackupEnabled}
                    onChange={(e) => setCloudBackupEnabled(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Habilitar backup automático
                </label>
              </div>
            </div>
            
            {/* Historial de Backups */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Historial de Backups</h4>
                <button
                  onClick={fetchBackupHistory}
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '4px',
                    color: '#6366f1',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Actualizar
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {backupHistory.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    color: '#64748b', 
                    fontSize: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255,255,255,0.1)'
                  }}>
                    <span className="material-icons" style={{ fontSize: '32px', color: '#475569', marginBottom: '8px', display: 'block' }}>
                      cloud_off
                    </span>
                    <div style={{ fontSize: '12px' }}>No hay backups disponibles</div>
                  </div>
                ) : (
                  backupHistory.map(backup => (
                    <div key={backup.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    }}
                  >
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 500 }}>{backup.name}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>
                          {new Date(backup.timestamp).toLocaleString()} • {backup.nodeCount} nodos • {Math.round(backup.size / 1024)}KB
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => restoreFromCloud(backup.id)}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: '4px',
                            color: '#22c55e',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          Restaurar
                        </button>
                        <button
                          onClick={() => deleteBackup(backup.id)}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '4px',
                            color: '#ef4444',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => performCloudBackup()}
                disabled={backupStatus === 'saving'}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: backupStatus === 'saving' ? 'not-allowed' : 'pointer',
                  opacity: backupStatus === 'saving' ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {backupStatus === 'saving' && (
                  <span className="material-icons" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>refresh</span>
                )}
                {backupStatus === 'saving' ? 'Guardando...' : 'Backup Manual'}
              </button>
              <button
                onClick={() => {
                  setShowBackupModal(false)
                  setCloudBackupEnabled(!cloudBackupEnabled)
                }}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Share Links para Colaboración */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '550px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Compartir Workflow</h3>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Configuración de Compartido */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Configuración de Compartido</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={shareSettings.allowEdit}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, allowEdit: e.target.checked }))}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Permitir edición
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={shareSettings.allowComments}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, allowComments: e.target.checked }))}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Permitir comentarios
                </label>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                    Expira en (opcional)
                  </label>
                  <select
                    value={shareSettings.expiresAt || ''}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, expiresAt: e.target.value || null }))}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="">Nunca</option>
                    <option value="1h">1 hora</option>
                    <option value="24h">24 horas</option>
                    <option value="7d">7 días</option>
                    <option value="30d">30 días</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                    Límite de vistas (opcional)
                  </label>
                  <input
                    type="number"
                    value={shareSettings.maxViews || ''}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, maxViews: e.target.value ? parseInt(e.target.value) : null }))}
                    placeholder="Sin límite"
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                  Contraseña (opcional)
                </label>
                <input
                  type="password"
                  value={shareSettings.password}
                  onChange={(e) => setShareSettings(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Dejar vacío para acceso público"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    color: '#cbd5e1',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
            
            {/* Link Generado */}
            {shareLink && (
              <div style={{ 
                marginBottom: '20px', 
                padding: '16px', 
                background: 'rgba(6,182,212,0.05)', 
                borderRadius: '8px',
                border: '1px solid rgba(6,182,212,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="material-icons" style={{ fontSize: '20px', color: '#06b6d4' }}>
                    link
                  </span>
                  <div>
                    <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Link de Compartido</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                      Comparte este link con otros usuarios
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace"
                    }}
                  />
                  <button
                    onClick={copyShareLink}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(6,182,212,0.1)',
                      border: '1px solid rgba(6,182,212,0.3)',
                      borderRadius: '6px',
                      color: '#06b6d4',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
            
            {/* Workflows Compartidos */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Links Activos</h4>
                <button
                  onClick={fetchSharedWorkflows}
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(6,182,212,0.1)',
                    border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: '4px',
                    color: '#06b6d4',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Actualizar
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {sharedWorkflows.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    color: '#64748b', 
                    fontSize: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255,255,255,0.1)'
                  }}>
                    <span className="material-icons" style={{ fontSize: '32px', color: '#475569', marginBottom: '8px', display: 'block' }}>
                      share_off
                    </span>
                    <div style={{ fontSize: '12px' }}>No hay links compartidos activos</div>
                  </div>
                ) : (
                  sharedWorkflows.map(shared => (
                    <div key={shared.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    }}
                  >
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 500 }}>{shared.name}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>
                          {new Date(shared.createdAt).toLocaleString()} • {shared.viewCount} vistas
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shared.url)
                            setLogs(prev => [{
                              time: new Date().toLocaleTimeString('en', { hour12: false }),
                              type: 'INFO', color: '#22c55e',
                              msg: 'Link copiado al portapapeles'
                            }, ...prev.slice(0, 9)])
                          }}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(6,182,212,0.1)',
                            border: '1px solid rgba(6,182,212,0.3)',
                            borderRadius: '4px',
                            color: '#06b6d4',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          Copiar
                        </button>
                        <button
                          onClick={() => deleteShareLink(shared.id)}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '4px',
                            color: '#ef4444',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={generateShareLink}
                disabled={isGeneratingShare}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: isGeneratingShare ? 'not-allowed' : 'pointer',
                  opacity: isGeneratingShare ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isGeneratingShare && (
                  <span className="material-icons" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>refresh</span>
                )}
                {isGeneratingShare ? 'Generando...' : 'Generar Link'}
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Templates Gallery */}
      {showTemplatesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '700px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Templates Gallery</h3>
              <button
                onClick={() => setShowTemplatesModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Búsqueda y Filtros */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Buscar templates..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  onClick={() => setTemplateSearch('')}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(168,85,247,0.1)',
                    border: '1px solid rgba(168,85,247,0.3)',
                    borderRadius: '8px',
                    color: '#a855f7',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Limpiar
                </button>
              </div>
              
              {/* Categorías */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {templateCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      padding: '6px 12px',
                      background: selectedCategory === category.id 
                        ? 'rgba(168,85,247,0.2)' 
                        : 'rgba(255,255,255,0.05)',
                      border: selectedCategory === category.id 
                        ? '1px solid rgba(168,85,247,0.4)' 
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '20px',
                      color: selectedCategory === category.id ? '#a855f7' : '#64748b',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '14px' }}>
                      {category.icon}
                    </span>
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
            
            {/* Grid de Templates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => loadTemplate(template)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.borderColor = template.color + '40'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.transform = 'translateY(0px)'
                  }}
                >
                  {/* Header del Template */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: template.color + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-icons" style={{ fontSize: '24px', color: template.color }}>
                        {template.icon}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: '#cbd5e1', fontSize: '16px', fontWeight: 600 }}>
                        {template.name}
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginTop: '4px'
                      }}>
                        <span style={{
                          padding: '2px 8px',
                          background: template.color + '20',
                          borderRadius: '12px',
                          color: template.color,
                          fontSize: '10px',
                          fontWeight: 600
                        }}>
                          {template.difficulty}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          color: '#64748b',
                          fontSize: '10px'
                        }}>
                          {template.nodes.length} nodos
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <p style={{ 
                    margin: '0 0 12px 0', 
                    color: '#94a3b8', 
                    fontSize: '13px', 
                    lineHeight: 1.4 
                  }}>
                    {template.description}
                  </p>
                  
                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '4px 8px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px',
                          color: '#64748b',
                          fontSize: '11px'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Mini Preview */}
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    height: '60px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      height: '100%',
                      gap: '4px'
                    }}>
                      {template.nodes.slice(0, 4).map((node, index) => (
                        <div
                          key={index}
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '2px',
                            background: template.color,
                            opacity: 0.8
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Botón de Carga */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      loadTemplate(template)
                    }}
                    disabled={isLoadingTemplate}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: `linear-gradient(135deg, ${template.color}, ${template.color}dd)`,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: isLoadingTemplate ? 'not-allowed' : 'pointer',
                      opacity: isLoadingTemplate ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoadingTemplate) {
                        e.target.style.transform = 'scale(1.02)'
                        e.target.style.background = `linear-gradient(135deg, ${template.color}dd, ${template.color})`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoadingTemplate) {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.background = `linear-gradient(135deg, ${template.color}, ${template.color}dd)`
                      }
                    }}
                  >
                    {isLoadingTemplate && (
                      <span className="material-icons" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>refresh</span>
                    )}
                    {isLoadingTemplate ? 'Cargando...' : 'Usar Template'}
                  </button>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredTemplates.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                <span className="material-icons" style={{ fontSize: '48px', color: '#475569', marginBottom: '16px', display: 'block' }}>
                  dashboard_customize
                </span>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>No se encontraron templates</div>
                <div style={{ fontSize: '12px' }}>Intenta con otros términos de búsqueda o categorías</div>
              </div>
            )}
            
            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setShowTemplatesModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Analytics Dashboard */}
      {showAnalyticsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Analytics Dashboard</h3>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Time Range Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['1d', '7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setAnalyticsTimeRange(range)}
                  style={{
                    padding: '6px 12px',
                    background: analyticsTimeRange === range 
                      ? 'rgba(139,92,246,0.2)' 
                      : 'rgba(255,255,255,0.05)',
                    border: analyticsTimeRange === range 
                      ? '1px solid rgba(139,92,246,0.4)' 
                      : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    color: analyticsTimeRange === range ? '#8b5cf7' : '#64748b',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {range === '1d' ? 'Último día' : range === '7d' ? 'Últimos 7 días' : range === '30d' ? 'Últimos 30 días' : 'Últimos 90 días'}
                </button>
              ))}
            </div>
            
            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {/* Workflow Metrics */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Métricas del Workflow</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Nodos</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.workflowMetrics.totalNodes}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Conexiones</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.workflowMetrics.totalEdges}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Variables</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.workflowMetrics.totalVariables}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Complejidad</div>
                    <div style={{ 
                      color: analyticsData.workflowMetrics.complexity === 'simple' ? '#22c55e' : 
                             analyticsData.workflowMetrics.complexity === 'intermediate' ? '#f59e0b' : '#ef4444',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {analyticsData.workflowMetrics.complexity === 'simple' ? 'Simple' :
                       analyticsData.workflowMetrics.complexity === 'intermediate' ? 'Intermedio' : 'Complejo'}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>Tiempo estimado</div>
                  <div style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: 600 }}>
                    {analyticsData.workflowMetrics.estimatedTime}s
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Rendimiento</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Ejecuciones</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.performanceMetrics.totalExecutions}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Tiempo promedio</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.performanceMetrics.averageExecutionTime}s
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Tasa de éxito</div>
                    <div style={{ 
                      color: analyticsData.performanceMetrics.successRate > 80 ? '#22c55e' :
                             analyticsData.performanceMetrics.successRate > 60 ? '#f59e0b' : '#ef4444',
                      fontSize: '18px',
                      fontWeight: 600
                    }}>
                      {analyticsData.performanceMetrics.successRate}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Tasa de error</div>
                    <div style={{ 
                      color: analyticsData.performanceMetrics.errorRate < 20 ? '#22c55e' :
                             analyticsData.performanceMetrics.errorRate < 40 ? '#f59e0b' : '#ef4444',
                      fontSize: '18px',
                      fontWeight: 600
                    }}>
                      {analyticsData.performanceMetrics.errorRate}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Usage Metrics */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Uso</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Vistas totales</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.usageMetrics.totalViews}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Usuarios únicos</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.usageMetrics.uniqueUsers}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Tiempo de sesión</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.usageMetrics.averageSessionTime}min
                    </div>
                  </div>
                </div>
                
                {/* Most Used Nodes */}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '8px' }}>Nodos más usados</div>
                  {analyticsData.usageMetrics.mostUsedNodes.map((node, index) => (
                    <div key={node.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'capitalize' }}>{node.type}</span>
                      <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{node.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* System Metrics */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Sistema</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Memoria</div>
                    <div style={{ 
                      color: analyticsData.systemMetrics.memoryUsage < 50 ? '#22c55e' :
                             analyticsData.systemMetrics.memoryUsage < 80 ? '#f59e0b' : '#ef4444',
                      fontSize: '18px',
                      fontWeight: 600
                    }}>
                      {analyticsData.systemMetrics.memoryUsage}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>CPU</div>
                    <div style={{ 
                      color: analyticsData.systemMetrics.cpuUsage < 50 ? '#22c55e' :
                             analyticsData.systemMetrics.cpuUsage < 80 ? '#f59e0b' : '#ef4444',
                      fontSize: '18px',
                      fontWeight: 600
                    }}>
                      {analyticsData.systemMetrics.cpuUsage}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Requests</div>
                    <div style={{ color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>
                      {analyticsData.systemMetrics.networkRequests}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Errores</div>
                    <div style={{ 
                      color: analyticsData.systemMetrics.errors === 0 ? '#22c55e' :
                             analyticsData.systemMetrics.errors < 5 ? '#f59e0b' : '#ef4444',
                      fontSize: '18px',
                      fontWeight: 600
                    }}>
                      {analyticsData.systemMetrics.errors}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Recomendaciones</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {generateRecommendations(analyticsData).length === 0 ? (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(34,197,94,0.05)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '8px',
                    color: '#22c55e',
                    fontSize: '13px',
                    textAlign: 'center'
                  }}>
                    ¡Excelente! Tu workflow está optimizado y funcionando correctamente.
                  </div>
                ) : (
                  generateRecommendations(analyticsData).map((rec, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      background: rec.priority === 'high' ? 'rgba(239,68,68,0.05)' :
                                 rec.priority === 'medium' ? 'rgba(245,158,11,0.05)' : 'rgba(139,92,246,0.05)',
                      border: rec.priority === 'high' ? '1px solid rgba(239,68,68,0.2)' :
                                 rec.priority === 'medium' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(139,92,246,0.2)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ 
                          padding: '2px 6px',
                          background: rec.priority === 'high' ? 'rgba(239,68,68,0.2)' :
                                     rec.priority === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.2)',
                          borderRadius: '4px',
                          color: rec.priority === 'high' ? '#ef4444' :
                                 rec.priority === 'medium' ? '#f59e0b' : '#8b5cf7',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                        <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600 }}>
                          {rec.title}
                        </span>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
                        {rec.description}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>
                        💡 {rec.action}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={updateAnalytics}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  borderRadius: '6px',
                  color: '#8b5cf7',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Actualizar
              </button>
              <button
                onClick={generateAnalyticsReport}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #8b5cf7, #7c3aed)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Generar Reporte
              </button>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Integraciones Externas */}
      {showIntegrationsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '750px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Integraciones Externas</h3>
              <button
                onClick={() => setShowIntegrationsModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Grid de Integraciones */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {integrations.map(integration => (
                <div
                  key={integration.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${integration.status === 'connected' ? integration.color + '40' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onClick={() => setSelectedIntegration(integration)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.borderColor = integration.color + '60'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.borderColor = integration.status === 'connected' ? integration.color + '40' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 8px',
                    background: integration.status === 'connected' ? 'rgba(34,197,94,0.2)' : 'rgba(107,114,128,0.2)',
                    border: `1px solid ${integration.status === 'connected' ? 'rgba(34,197,94,0.4)' : 'rgba(107,114,128,0.4)'}`,
                    borderRadius: '12px',
                    color: integration.status === 'connected' ? '#22c55e' : '#6b7280',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                  </div>
                  
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: integration.color + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-icons" style={{ fontSize: '24px', color: integration.color }}>
                        {integration.icon}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: '#cbd5e1', fontSize: '16px', fontWeight: 600 }}>
                        {integration.name}
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginTop: '4px'
                      }}>
                        <span style={{
                          padding: '2px 8px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          color: '#64748b',
                          fontSize: '10px'
                        }}>
                          {integration.category}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          background: integration.color + '20',
                          borderRadius: '12px',
                          color: integration.color,
                          fontSize: '10px'
                        }}>
                          {integration.capabilities.length} acciones
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <p style={{ 
                    margin: '0 0 12px 0', 
                    color: '#94a3b8', 
                    fontSize: '13px', 
                    lineHeight: 1.4 
                  }}>
                    {integration.description}
                  </p>
                  
                  {/* Capabilities */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px' }}>Capacidades:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {integration.capabilities.map(capability => (
                        <span
                          key={capability}
                          style={{
                            padding: '3px 6px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '4px',
                            color: '#94a3b8',
                            fontSize: '10px'
                          }}
                        >
                          {capability.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Botones de Acción */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {integration.status === 'connected' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            testIntegration(integration.id)
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: '6px',
                            color: '#22c55e',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Probar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            disconnectIntegration(integration.id)
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Desconectar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          connectIntegration(integration.id)
                        }}
                        disabled={isConnecting}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: `linear-gradient(135deg, ${integration.color}, ${integration.color}dd)`,
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '12px',
                          cursor: isConnecting ? 'not-allowed' : 'pointer',
                          opacity: isConnecting ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        {isConnecting && (
                          <span className="material-icons" style={{ fontSize: '14px', animation: 'spin 1s linear infinite' }}>refresh</span>
                        )}
                        {isConnecting ? 'Conectando...' : 'Conectar'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Detalles de Integración Seleccionada */}
            {selectedIntegration && (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>
                    Configuración - {selectedIntegration.name}
                  </h4>
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {Object.entries(selectedIntegration.config).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ color: '#64748b', fontSize: '11px', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type={key.includes('secret') || key.includes('token') || key.includes('key') ? 'password' : 'text'}
                        value={value}
                        onChange={(e) => {
                          setIntegrations(prev => prev.map(i => 
                            i.id === selectedIntegration.id
                              ? { ...i, config: { ...i.config, [key]: e.target.value } }
                              : i
                          ))
                        }}
                        placeholder={`Ingresa ${key}...`}
                        style={{
                          padding: '6px 8px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px',
                          color: '#cbd5e1',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      // Guardar configuración
                      setSelectedIntegration(null)
                      setLogs(prev => [{
                        time: new Date().toLocaleTimeString('en', { hour12: false }),
                        type: 'INTEGRATION', color: '#06b6d4',
                        msg: `Configuración de ${selectedIntegration.name} guardada`
                      }, ...prev.slice(0, 9)])
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'rgba(6,182,212,0.1)',
                      border: '1px solid rgba(6,182,212,0.3)',
                      borderRadius: '6px',
                      color: '#06b6d4',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            )}
            
            {/* Logs de Integración */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Logs de Integración</h4>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '12px',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {integrationLogs.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#64748b', 
                    fontSize: '12px',
                    padding: '20px'
                  }}>
                    No hay logs de integración
                  </div>
                ) : (
                  integrationLogs.map((log, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                      fontSize: '11px',
                      color: log.type === 'success' ? '#22c55e' :
                             log.type === 'error' ? '#ef4444' :
                             log.type === 'warning' ? '#f59e0b' : '#64748b'
                    }}>
                      <span style={{ color: '#475569', fontSize: '10px' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowIntegrationsModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Personalización Visual */}
      {showCustomizationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1a1d27',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '18px', fontWeight: 600 }}>Personalización Visual</h3>
              <button
                onClick={() => setShowCustomizationModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Tabs de Personalización */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <button
                onClick={() => setCustomizationTab('themes')}
                style={{
                  padding: '6px 12px',
                  background: customizationTab === 'themes' ? 'rgba(139,92,246,0.2)' : 'transparent',
                  border: customizationTab === 'themes' ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  color: customizationTab === 'themes' ? '#8b5cf7' : '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🎨 Temas
              </button>
              <button
                onClick={() => setCustomizationTab('layout')}
                style={{
                  padding: '6px 12px',
                  background: customizationTab === 'layout' ? 'rgba(139,92,246,0.2)' : 'transparent',
                  border: customizationTab === 'layout' ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  color: customizationTab === 'layout' ? '#8b5cf7' : '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📐 Layout
              </button>
              <button
                onClick={() => setCustomizationTab('icons')}
                style={{
                  padding: '6px 12px',
                  background: customizationTab === 'icons' ? 'rgba(139,92,246,0.2)' : 'transparent',
                  border: customizationTab === 'icons' ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  color: customizationTab === 'icons' ? '#8b5cf7' : '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🎨 Iconos
              </button>
              <button
                onClick={() => setCustomizationTab('skins')}
                style={{
                  padding: '6px 12px',
                  background: customizationTab === 'skins' ? 'rgba(139,92,246,0.2)' : 'transparent',
                  border: customizationTab === 'skins' ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  color: customizationTab === 'skins' ? '#8b5cf7' : '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🎨 Skins
              </button>
            </div>
            
            {/* Contenido del Tab Activo */}
            {customizationTab === 'themes' && (
              <div>
                <h4 style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Personalizar Colores</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Color Primario
                    </label>
                    <input
                      type="color"
                      value={customTheme.primaryColor}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Color Secundario
                    </label>
                    <input
                      type="color"
                      value={customTheme.secondaryColor}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Color de Acento
                    </label>
                    <input
                      type="color"
                      value={customTheme.accentColor}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Color de Fondo
                    </label>
                    <input
                      type="color"
                      value={customTheme.backgroundColor}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      setCustomTheme({
                        primaryColor: '#6366f1',
                        secondaryColor: '#06b6d4',
                        accentColor: '#8b5cf7',
                        backgroundColor: '#0f1117',
                        surfaceColor: '#1a1d27',
                        textColor: '#cbd5e1',
                        borderColor: 'rgba(255,255,255,0.1)',
                        successColor: '#22c55e',
                        warningColor: '#f59e0b',
                        errorColor: '#ef4444'
                      })
                      applyCustomTheme()
                    }}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '6px',
                      color: '#8b5cf7',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Restablecer Defaults
                  </button>
                  <button
                    onClick={() => {
                      saveCustomization()
                    }}
                    style={{
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #8b5cf7, #7c3aed)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            )}
            
            {customizationTab === 'layout' && (
              <div>
                <h4 style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Configurar Layout</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Ancho del Panel (px)
                    </label>
                    <input
                      type="number"
                      value={customLayout.panelWidth}
                      onChange={(e) => setCustomLayout(prev => ({ ...prev, panelWidth: parseInt(e.target.value) }))}
                      min="200"
                      max="600"
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Posición del Panel
                    </label>
                    <select
                      value={customLayout.panelPosition}
                      onChange={(e) => setCustomLayout(prev => ({ ...prev, panelPosition: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    >
                      <option value="right">Derecha</option>
                      <option value="left">Izquierda</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Alto de Toolbar (px)
                    </label>
                    <input
                      type="number"
                      value={customLayout.toolbarHeight}
                      onChange={(e) => setCustomLayout(prev => ({ ...prev, toolbarHeight: parseInt(e.target.value) }))}
                      min="40"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Alto de Footer (px)
                    </label>
                    <input
                      type="number"
                      value={customLayout.footerHeight}
                      onChange={(e) => setCustomLayout(prev => ({ ...prev, footerHeight: parseInt(e.target.value) }))}
                      min="24"
                      max="60"
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      setCustomLayout({
                        panelWidth: 340,
                        panelPosition: 'right',
                        toolbarHeight: 60,
                        footerHeight: 32,
                        sidebarWidth: 280,
                        nodeSize: 'medium',
                        connectionWidth: 2,
                        showMiniMap: true,
                        showControls: true
                      })
                    }}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '6px',
                      color: '#8b5cf7',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Restable Defaults
                  </button>
                  <button
                    onClick={saveCustomization}
                    style={{
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #8b5cf7, #7c3aed)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            )}
            
            {customizationTab === 'icons' && (
              <div>
                <h4 style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Personalizar Iconos</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Icono Trigger
                    </label>
                    <select
                      value={customIcons.trigger}
                      onChange={(e) => setCustomIcons(prev => ({ ...prev, trigger: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    >
                      <option value="bolt">⚡ Lightning Bolt</option>
                      <option value="play_arrow">▶️ Play Arrow</option>
                      <option value="notifications">🔔 Notifications</option>
                      <option value="alarm">⏰️ Alarm</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Icono Action
                    </label>
                    <select
                      value={customIcons.action}
                      onChange={(e) => setCustomIcons(prev => ({ ...prev, action: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    >
                      <option value="play_arrow">▶️ Play Arrow</option>
                      <option value="send">📤 Send</option>
                      <option value="settings">⚙️ Settings</option>
                      <option value="code">💻 Code</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Icono Logic
                    </label>
                    <select
                      value={customIcons.logic}
                      onChange={(e) => setCustomIcons(prev => ({ ...prev, logic: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    >
                      <option value="code">💻 Code</option>
                      <option value="data_object">📊 Database</option>
                      <option value="psychology">🧠 Psychology</option>
                      <option value="api">🔌 API</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                      Icono Datos
                    </label>
                    <select
                      value={customIcons.data}
                      onChange={(e) => setCustomIcons(prev => ({ ...prev, data: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    >
                      <option value="storage">💾 Storage</option>
                      <option value="cloud_upload">☁️ Cloud</option>
                      <option value="download">⬇ Download</option>
                      <option value="email">📧 Email</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      setCustomIcons({
                        trigger: 'bolt',
                        action: 'play_arrow',
                        logic: 'code',
                        data: 'storage'
                      })
                    }}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '6px',
                      color: '#8b5cf7',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Restable Defaults
                  </button>
                  <button
                    onClick={saveCustomization}
                    style={{
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #8b5cf7, #7c3aed)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            )}
            
            {customizationTab === 'skins' && (
              <div>
                <h4 style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>Skins Predefinidos</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {workflowSkins.map(skin => (
                    <div
                      key={skin.id}
                      onClick={() => {
                        setCurrentSkin(skin.id)
                        applyCustomTheme()
                      }}
                      style={{
                        padding: '12px',
                        background: currentSkin === skin.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                        border: currentSkin === skin.id ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (currentSkin !== skin.id) {
                          e.currentTarget.style.background = 'rgba(139,92,246,0.3)'
                          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentSkin !== skin.id) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        }
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: skin.colors.primaryColor + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px'
                      }}>
                        <span className="material-icons" style={{ fontSize: '24px', color: skin.colors.primaryColor }}>
                          {skin.icon || 'palette'}
                        </span>
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: 600 }}>
                        {skin.name}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>
                        {skin.description}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      setCurrentSkin('default')
                      applyCustomTheme()
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '6px',
                      color: '#8b5cf7',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Usar Default
                  </button>
                  <button
                    onClick={saveCustomization}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #8b5cf7, #7c3aed)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            )}
            
            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCustomizationModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
