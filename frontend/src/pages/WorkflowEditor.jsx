import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import {
  Activity, Bot, ChevronLeft, Copy, Cpu, Database, Edit3, FileText, Globe,
  GitBranch, Layers, Mail, Play, Rocket, Save, Search, Square, Trash2, X, Bell, Box,
} from 'lucide-react'

const GRID_SIZE = 20

const getNodeGradient = (type) => {
  const gradients = {
    start: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    process: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    decision: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    end: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    database: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    api: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    file: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    email: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    notification: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  }
  return gradients[type] || gradients.start
}

const getNodeIcon = (type) => {
  const icons = {
    start: <Play className="w-4 h-4 text-white" />,
    process: <Cpu className="w-4 h-4 text-white" />,
    decision: <GitBranch className="w-4 h-4 text-white" />,
    end: <Square className="w-4 h-4 text-white" />,
    database: <Database className="w-4 h-4 text-white" />,
    api: <Globe className="w-4 h-4 text-white" />,
    file: <FileText className="w-4 h-4 text-white" />,
    email: <Mail className="w-4 h-4 text-white" />,
    notification: <Bell className="w-4 h-4 text-white" />,
  }
  return icons[type] || <Box className="w-4 h-4 text-white" />
}

const CustomNode = ({ data, selected, id }) => {
  const onEdit = data?.onEdit
  const onCopy = data?.onCopy
  const onDelete = data?.onDelete

  return (
    <motion.div
      className="relative group cursor-move"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: 2 }}
    >
      {/* Handle izquierdo (entrada) - Premium */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-indigo-500 !border-2 !border-slate-900 !rounded-full transition-all duration-300 hover:!scale-150 hover:!bg-cyan-400"
        style={{ 
          left: -8,
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
        }}
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-20" />
      </Handle>
      
      {/* Handle derecho (salida) - Premium */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-indigo-500 !border-2 !border-slate-900 !rounded-full transition-all duration-300 hover:!scale-150 hover:!bg-cyan-400"
        style={{ 
          right: -8,
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
        }}
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-20" />
      </Handle>

      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-lg"
        style={{ background: getNodeGradient(data?.type) }}
      />
      <div
        className={`relative bg-slate-900/90 backdrop-blur-xl rounded-xl p-3 min-w-[150px] border transition-all duration-200 ${
          selected ? 'border-indigo-400 shadow-lg shadow-indigo-400/40' : 'border-slate-700/50 hover:border-slate-600/50 shadow-md'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl" style={{ background: getNodeGradient(data?.type) }} />
        <div className="flex items-center gap-2">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: getNodeGradient(data?.type) }}
            whileHover={{ rotate: 360, scale: 1.06 }}
            transition={{ duration: 0.5 }}
          >
            {getNodeIcon(data?.type)}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{data?.label}</div>
            <div className="flex items-center gap-1">
              <motion.div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[11px] text-slate-400">Active</span>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button type="button" onClick={(e) => { e.stopPropagation(); onEdit?.(id); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10" whileTap={{ scale: 0.95 }} title="Edit"><Edit3 className="w-3.5 h-3.5 text-slate-300" /></motion.button>
            <motion.button type="button" onClick={(e) => { e.stopPropagation(); onCopy?.(id); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10" whileTap={{ scale: 0.95 }} title="Copy"><Copy className="w-3.5 h-3.5 text-slate-300" /></motion.button>
            <motion.button type="button" onClick={(e) => { e.stopPropagation(); onDelete?.(id); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10" whileTap={{ scale: 0.95 }} title="Delete"><Trash2 className="w-3.5 h-3.5 text-slate-300" /></motion.button>
          </div>
        </div>
        <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: getNodeGradient(data?.type) }} initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 0.8 }} />
        </div>
      </div>
    </motion.div>
  )
}

const nodeTypes = { custom: CustomNode }

const NODE_LIBRARY = [
  {
    group: 'Core Components',
    items: [
      { title: 'Start Node', desc: 'Initialize workflow execution', icon: <Play className="w-5 h-5 text-white" />, type: 'start', color: '#6366f1' },
      { title: 'Process Node', desc: 'Execute business logic', icon: <Cpu className="w-5 h-5 text-white" />, type: 'process', color: '#a855f7' },
      { title: 'Decision Node', desc: 'Conditional branching', icon: <GitBranch className="w-5 h-5 text-white" />, type: 'decision', color: '#f59e0b' },
      { title: 'End Node', desc: 'Terminate workflow', icon: <Square className="w-5 h-5 text-white" />, type: 'end', color: '#22c55e' },
    ]
  },
  {
    group: 'Data Operations',
    items: [
      { title: 'Database', desc: 'Connect to database', icon: <Database className="w-5 h-5 text-white" />, type: 'database', color: '#06b6d4' },
      { title: 'API Call', desc: 'REST API integration', icon: <Globe className="w-5 h-5 text-white" />, type: 'api', color: '#ef4444' },
      { title: 'File Handler', desc: 'Process files', icon: <FileText className="w-5 h-5 text-white" />, type: 'file', color: '#10b981' },
    ]
  },
  {
    group: 'Communication',
    items: [
      { title: 'Email Sender', desc: 'Send emails', icon: <Mail className="w-5 h-5 text-white" />, type: 'email', color: '#f59e0b' },
      { title: 'Push Notification', desc: 'Send push notifications', icon: <Bell className="w-5 h-5 text-white" />, type: 'notification', color: '#ef4444' },
    ]
  }
]

export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  )
}

function WorkflowEditorContent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const reactFlowWrapper = useRef(null)
  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [showCopilot, setShowCopilot] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('components')
  const [logs, setLogs] = useState([])
  const [workflowName, setWorkflowName] = useState('Advanced Workflow')
  const [workflowDescription, setWorkflowDescription] = useState('High-performance automation workflow')
  const [autoSave, setAutoSave] = useState(true)

  // Generar claves de localStorage únicas por workflow ID
  const getStorageKey = (type) => `flowly_${type}_${id || 'default'}`

  useEffect(() => {
    // Limpiar nodos actuales antes de cargar nuevos
    setNodes([])
    setEdges([])
    setLogs([])
    
    // Cargar nodos/edges específicos de este workflow
    const savedNodes = localStorage.getItem(getStorageKey('nodes'))
    const savedEdges = localStorage.getItem(getStorageKey('edges'))
    
    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes))
        addLog(`Workflow ${id || 'default'} loaded from storage`, 'info')
      } catch (e) {
        console.error('Error loading nodes:', e)
      }
    }
    if (savedEdges) {
      try {
        setEdges(JSON.parse(savedEdges))
      } catch (e) {
        console.error('Error loading edges:', e)
      }
    }
    if (id) {
      setWorkflowName(`Workflow ${id}`)
      setWorkflowDescription(`Advanced automation workflow #${id}`)
    } else {
      setWorkflowName('New Workflow')
      setWorkflowDescription('Create your automation workflow')
    }
  }, [id])

  useEffect(() => {
    if (autoSave && nodes.length > 0) {
      const timeout = setTimeout(() => {
        localStorage.setItem(getStorageKey('nodes'), JSON.stringify(nodes))
        localStorage.setItem(getStorageKey('edges'), JSON.stringify(edges))
        addLog('Auto-saved to localStorage', 'info')
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [nodes, edges, autoSave, id])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = useCallback((event) => {
    event.preventDefault()
    const type = event.dataTransfer.getData('application/reactflow')
    if (!type) return

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    const libraryItem = NODE_LIBRARY.flatMap(g => g.items).find(item => item.type === type)

    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'custom',
      position,
      data: {
        label: libraryItem?.title || type,
        icon: libraryItem?.icon || '📦',
        description: libraryItem?.desc || `Advanced ${type} node`,
        type: type,
        onCopy: (nodeId) => {
          const nodeToCopy = nodes.find(n => n.id === nodeId)
          if (nodeToCopy) {
            const newNode = {
              ...nodeToCopy,
              id: `${nodeToCopy.data.type}-${Date.now()}`,
              position: { x: nodeToCopy.position.x + 50, y: nodeToCopy.position.y + 50 },
            }
            setNodes((nds) => nds.concat(newNode))
            addLog(`Node copied: ${nodeId}`, 'success')
          }
        },
        onDelete: (nodeId) => {
          setNodes((nds) => nds.filter(n => n.id !== nodeId))
          setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId))
          addLog(`Node deleted: ${nodeId}`, 'warning')
        },
      },
    }

    setNodes((nds) => nds.concat(newNode))
    addLog(`Node added: ${newNode.data.label}`, 'success')
  }, [screenToFlowPosition, setNodes, setEdges, nodes])

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem(getStorageKey('nodes'), JSON.stringify(nodes))
      localStorage.setItem(getStorageKey('edges'), JSON.stringify(edges))
      await new Promise(resolve => setTimeout(resolve, 500))
      addLog(`Workflow ${id || 'default'} saved successfully`, 'success')
    } catch (error) {
      addLog('Failed to save workflow', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleRun = async () => {
    if (nodes.length === 0) {
      addLog('No nodes to execute', 'warning')
      return
    }

    setRunning(true)
    addLog('Starting workflow execution...', 'info')

    try {
      // Encontrar nodos de inicio (tipo 'start' o sin conexiones entrantes)
      const startNodes = nodes.filter(n => 
        n.data.type === 'start' || 
        !edges.some(e => e.target === n.id)
      )

      if (startNodes.length === 0) {
        addLog('No start nodes found', 'error')
        setRunning(false)
        return
      }

      // Función para ejecutar un nodo
      const executeNode = async (node, depth = 0) => {
        const indent = '  '.repeat(depth)
        addLog(`${indent}▶️ Executing: ${node.data.label}`, 'info')
        
        // Simular ejecución según tipo
        const executionTime = Math.random() * 1000 + 500
        await new Promise(resolve => setTimeout(resolve, executionTime))
        
        const typeActions = {
          start: () => ({ status: 'started', output: 'Workflow initiated' }),
          process: () => ({ status: 'processed', output: 'Data processed successfully' }),
          decision: () => ({ status: 'evaluated', output: 'Condition evaluated' }),
          database: () => ({ status: 'queried', output: 'Database operation completed' }),
          api: () => ({ status: 'called', output: 'API response received' }),
          file: () => ({ status: 'handled', output: 'File processed' }),
          email: () => ({ status: 'sent', output: 'Email dispatched' }),
          notification: () => ({ status: 'pushed', output: 'Notification delivered' }),
          end: () => ({ status: 'completed', output: 'Workflow finished' }),
        }
        
        const action = typeActions[node.data.type] || typeActions.start
        const result = action()
        
        addLog(`${indent}✅ ${node.data.label}: ${result.output}`, 'success')
        
        // Encontrar siguiente nodo(s)
        const outgoingEdges = edges.filter(e => e.source === node.id)
        
        for (const edge of outgoingEdges) {
          const nextNode = nodes.find(n => n.id === edge.target)
          if (nextNode) {
            await executeNode(nextNode, depth + 1)
          }
        }
        
        return result
      }

      // Ejecutar desde cada nodo de inicio
      for (const startNode of startNodes) {
        await executeNode(startNode)
      }

      addLog('Workflow execution completed successfully! 🎉', 'success')
    } catch (error) {
      addLog(`Execution failed: ${error.message}`, 'error')
    } finally {
      setRunning(false)
    }
  }

  const deployWorkflow = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      addLog('Workflow deployed to production', 'success')
    } catch (error) {
      addLog('Deployment failed', 'error')
    }
  }

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString()
    const colors = { info: '#6366f1', success: '#22c55e', error: '#ef4444', warning: '#f59e0b' }
    setLogs(prev => [{ time, msg: message, color: colors[type] }, ...prev].slice(0, 100))
  }

  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear all nodes?')) {
      setNodes([])
      setEdges([])
      localStorage.removeItem(getStorageKey('nodes'))
      localStorage.removeItem(getStorageKey('edges'))
      addLog('Canvas cleared', 'warning')
    }
  }

  const filteredNodeLibrary = NODE_LIBRARY.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }} />
        </div>
      </div>

      <header className="relative bg-slate-900/50 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="h-16 flex items-center justify-between px-6">
          {/* Logo Flowly Premium */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  opacity: 0.2,
                  filter: 'blur(8px)'
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Logo SVG Flowly */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="relative z-10">
                <motion.path
                  d="M12 36C12 30.4772 16.4772 26 22 26H26C31.5228 26 36 21.5228 36 16V12"
                  stroke="url(#logoGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.circle cx="12" cy="36" r="3" fill="#6366f1" animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                <motion.circle cx="36" cy="12" r="3" fill="#06b6d4" animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
                <defs>
                  <linearGradient id="logoGradient" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
                    <motion.stop stopColor="#6366f1" animate={{ stopColor: ['#6366f1', '#8b5cf6', '#6366f1'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.stop offset="1" stopColor="#06b6d4" animate={{ stopColor: ['#06b6d4', '#0ea5e9', '#06b6d4'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Status Indicator */}
              <motion.div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            </motion.div>
            
            <div>
              <h1 className="text-lg font-bold text-white">Flowly</h1>
              <p className="text-xs text-slate-400">Workflow Automation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón Back - Premium */}
            <motion.button 
              onClick={() => navigate('/')} 
              className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/20 transition-all duration-300 group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronLeft className="w-5 h-5 relative z-10 group-hover:text-white transition-colors" />
            </motion.button>
            
            {/* Separador */}
            <div className="w-px h-8 bg-white/10" />
            
            {/* Botón Save - Premium */}
            <motion.button 
              onClick={handleSave} 
              disabled={saving} 
              className="relative flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-50 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                animate={saving ? { rotate: 360 } : { rotate: 0 }}
                transition={saving ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                <Save className="w-4 h-4 relative z-10 group-hover:text-emerald-400 transition-colors" />
              </motion.div>
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">{saving ? 'Saving...' : 'Save'}</span>
            </motion.button>

            {/* Botón Run - Premium con Glow */}
            <motion.button 
              onClick={handleRun} 
              disabled={running} 
              className="relative flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl disabled:opacity-60 disabled:shadow-none border border-white/20 transition-all duration-300 overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                animate={running ? { scale: [1, 1.2, 1] } : {}}
                transition={running ? { duration: 0.8, repeat: Infinity } : {}}
              >
                <Play className="w-4 h-4 relative z-10 fill-white" />
              </motion.div>
              <span className="text-sm font-semibold relative z-10">{running ? 'Running...' : 'Run'}</span>
            </motion.button>

            {/* Botón Deploy - Premium */}
            <motion.button 
              onClick={deployWorkflow} 
              className="relative flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl border border-white/20 transition-all duration-300 overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                whileHover={{ rotate: 45, y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <Rocket className="w-4 h-4 relative z-10" />
              </motion.div>
              <span className="text-sm font-semibold relative z-10">Deploy</span>
            </motion.button>

            {/* Separador */}
            <div className="w-px h-8 bg-white/10 mx-1" />

            {/* Botón Copilot - Premium */}
            <motion.button 
              onClick={() => setShowCopilot(!showCopilot)} 
              className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all duration-300 overflow-hidden group ${showCopilot ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/40' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-purple-500/30'}`}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {!showCopilot && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              <motion.div
                animate={showCopilot ? { rotate: [0, -10, 10, 0] } : {}}
                transition={showCopilot ? { duration: 0.5, repeat: Infinity, repeatDelay: 2 } : {}}
              >
                <Bot className="w-4 h-4 relative z-10" />
              </motion.div>
              <span className="text-sm font-medium relative z-10">Copilot</span>
              {showCopilot && (
                <motion.div 
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Botón Activity - Premium */}
            <motion.button 
              onClick={() => setShowRightPanel(!showRightPanel)} 
              className={`relative p-3 rounded-xl border transition-all duration-300 overflow-hidden group ${showRightPanel ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/30'}`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {!showRightPanel && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              <motion.div
                animate={showRightPanel ? { rotate: [0, 15, -15, 0] } : {}}
                transition={showRightPanel ? { duration: 2, repeat: Infinity } : {}}
              >
                <Activity className="w-5 h-5 relative z-10" />
              </motion.div>
              {showRightPanel && logs.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {logs.length > 9 ? '9+' : logs.length}
                </span>
              )}
            </motion.button>

            {/* Botón Clear - Premium */}
            <motion.button 
              onClick={clearCanvas} 
              className="relative p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 group overflow-hidden"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              title="Clear Canvas"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                <Trash2 className="w-5 h-5 relative z-10" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] relative z-0">
        <aside className="w-80 bg-slate-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search components..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>

          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Auto-save</span>
            <button onClick={() => setAutoSave(!autoSave)} className={`w-10 h-5 rounded-full transition-colors ${autoSave ? 'bg-emerald-500' : 'bg-slate-600'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoSave ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex border-b border-white/10">
            {['components', 'templates'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-medium capitalize transition-all relative ${activeTab === tab ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                {tab}
                {activeTab === tab && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-cyan-400" layoutId="activeTab" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'components' ? (
              <div className="space-y-6">
                {filteredNodeLibrary.map((section, i) => (
                  <motion.div key={section.group} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{section.group}</h3>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <motion.div key={item.title} draggable onDragStart={(e) => onDragStart(e, item.type)} className="p-3 bg-white/5 rounded-xl cursor-move hover:bg-white/10 border border-white/5 transition-all group" whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}>
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/30" 
                              style={{ background: `linear-gradient(135deg, ${item.color}dd, ${item.color}80)` }} 
                              whileHover={{ rotate: 360, scale: 1.1 }} 
                              transition={{ duration: 0.6 }}
                            >
                              {item.icon}
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.title}</p>
                              <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <motion.div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg" whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}>
                  <Layers className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">Premium Templates</h3>
                <p className="text-sm text-slate-400">Coming soon</p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 relative">
          <div className="w-full h-full" ref={reactFlowWrapper}>
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              onNodesChange={onNodesChange} 
              onEdgesChange={onEdgesChange} 
              onConnect={onConnect} 
              onDrop={onDrop} 
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }} 
              nodeTypes={nodeTypes} 
              fitView 
              style={{ background: 'transparent' }}
              defaultEdgeOptions={{
                type: 'smoothstep',
                style: { 
                  strokeWidth: 4,
                  stroke: 'url(#edgeGradient)',
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))',
                },
                animated: true,
              }}
              proOptions={{ hideAttribution: true }}
            >
              {/* Definición del gradiente para los edges */}
              <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                  <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
              
              <Background color="#1e293b" gap={GRID_SIZE} variant="dots" style={{ opacity: 0.1 }} />
              <Controls className="bg-slate-900 border border-white/10 rounded-xl shadow-lg" showInteractive={false} />
              <MiniMap className="bg-slate-900 border border-white/10 rounded-xl shadow-lg" nodeColor="#6366f1" maskColor="rgba(0,0,0,0.8)" />
            </ReactFlow>
          </div>
        </main>

        <AnimatePresence>
          {showRightPanel && (
            <motion.aside 
              className="w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col" 
              initial={{ opacity: 0, x: 100 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center"><Activity className="w-4 h-4 text-white" /></div>
                  <h3 className="text-lg font-semibold text-white">Activity</h3>
                </div>
                <button onClick={() => setShowRightPanel(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {logs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"><Activity className="w-8 h-8 text-slate-500" /></div>
                      <p className="text-sm text-slate-400">No activity yet</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <motion.div key={i} className="p-3 bg-white/5 rounded-xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className="flex items-start gap-3">
                          <motion.div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: log.color }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                          <div className="flex-1">
                            <p className="text-sm text-slate-200">{log.msg}</p>
                            <p className="text-xs text-slate-500 mt-1">{log.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCopilot && (
            <motion.div 
              className="absolute bottom-4 right-4 w-96 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl z-50" 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Flowly Copilot</h3>
                </div>
                <button onClick={() => setShowCopilot(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-400 mb-3">Ask me to help you build workflows, suggest optimizations, or explain your automation.</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Ask Copilot..." className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50" />
                  <button className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium">Send</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
