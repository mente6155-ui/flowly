const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const WorkflowExecutor = require('../engine/executor')
const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// GET - Listar todos los workflows
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true, data: data || [], total: data?.length || 0 })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET - Obtener un workflow
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', req.params.id)
      .single()
    if (error) return res.status(404).json({ error: 'Workflow no encontrado' })
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST - Crear workflow
router.post('/', async (req, res) => {
  try {
    const { name, nodes, edges } = req.body
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' })
    const newWorkflow = {
      id: 'WF-' + Math.floor(Math.random() * 900 + 100),
      name,
      nodes: nodes || [],
      edges: edges || [],
      status: 'inactive',
      executions: 0,
      last_run: null,
    }
    const { data, error } = await supabase
      .from('workflows')
      .insert([newWorkflow])
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// PUT - Actualizar workflow
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// DELETE - Eliminar workflow
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true, message: 'Workflow eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST - Ejecutar workflow
router.post('/:id/run', async (req, res) => {
  console.log('=== RUN WORKFLOW ===')
  console.log('ID:', req.params.id)
  
  try {
    const { data: workflow, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', req.params.id)
      .single()
    
    if (error || !workflow) {
      console.log('Workflow not found')
      return res.status(404).json({ error: 'Workflow not found' })
    }

    console.log('Workflow found:', workflow.name)
    console.log('Nodes:', workflow.nodes?.length || 0)
    
    const WorkflowExecutor = require('../engine/executor')
    const executor = new WorkflowExecutor(workflow)
    const result = await executor.run()

    console.log('Execution complete')
    
    await supabase
      .from('workflows')
      .update({ 
        last_run: new Date().toISOString(),
        executions: (workflow.executions || 0) + 1
      })
      .eq('id', req.params.id)

    res.json({ 
      success: true, 
      logs: result.logs,
      executionId: `exec_${Date.now()}` 
    })
  } catch (error) {
    console.error('Run error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
