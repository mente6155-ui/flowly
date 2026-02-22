class WorkflowExecutor {
  constructor(workflow) {
    this.workflow = workflow
    this.nodes = Array.isArray(workflow.nodes) ? workflow.nodes : []
    this.edges = Array.isArray(workflow.edges) ? workflow.edges : []
    this.logs = []
  }

  log(type, message) {
    const entry = {
      time: new Date().toISOString(),
      type,
      message
    }
    this.logs.push(entry)
    console.log(`[${type}] ${message}`)
  }

  findStartNode() {
    if (this.nodes.length === 0) return null
    const targetIds = new Set(this.edges.map(e => e.target))
    return this.nodes.find(n => !targetIds.has(n.id)) || this.nodes[0]
  }

  getNextNodes(currentNodeId) {
    const outgoingEdges = this.edges.filter(e => e.source === currentNodeId)
    return outgoingEdges.map(e => this.nodes.find(n => n.id === e.target)).filter(Boolean)
  }

  getNodeLabel(node) {
    if (!node) return 'Unknown'
    if (node.data && node.data.label) {
      // Si el label es un objeto React, extraer el texto
      if (typeof node.data.label === 'object') {
        return 'Node'
      }
      return node.data.label
    }
    return node.id || 'Unknown'
  }

  async executeNode(node, context = {}) {
    const label = this.getNodeLabel(node)
    this.log('INFO', `Executing node: ${label}`)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const labelLower = label.toLowerCase()
      
      if (labelLower.includes('webhook')) {
        context.webhookData = { id: '123', timestamp: Date.now() }
        this.log('SUCCESS', 'Webhook received with data')
      }
      else if (labelLower.includes('email') || labelLower.includes('enviar')) {
        this.log('SUCCESS', 'Email sent successfully')
      }
      else if (labelLower.includes('slack')) {
        this.log('SUCCESS', 'Slack message sent')
      }
      else if (labelLower.includes('http')) {
        this.log('SUCCESS', 'HTTP request completed')
      }
      else if (labelLower.includes('schedule')) {
        this.log('SUCCESS', 'Schedule configured')
      }
      else if (labelLower.includes('gpt') || labelLower.includes('ai')) {
        context.aiResponse = 'Analysis completed'
        this.log('SUCCESS', 'AI processing completed')
      }
      else if (labelLower.includes('condition') || labelLower.includes('if')) {
        this.log('SUCCESS', 'Condition evaluated: true')
      }
      else if (labelLower.includes('delay')) {
        await new Promise(resolve => setTimeout(resolve, 500))
        this.log('SUCCESS', 'Delay completed')
      }
      else {
        this.log('SUCCESS', `Node executed: ${label}`)
      }
      
      return { ...context, lastNodeId: node.id }
    } catch (error) {
      this.log('ERROR', `Failed to execute ${label}: ${error.message}`)
      throw error
    }
  }

  async run() {
    this.log('START', `Starting workflow execution: ${this.workflow.id || this.workflow.name}`)
    
    if (this.nodes.length === 0) {
      this.log('ERROR', 'No nodes to execute')
      return { success: false, logs: this.logs }
    }
    
    const startNode = this.findStartNode()
    if (!startNode) {
      this.log('ERROR', 'Could not find start node')
      return { success: false, logs: this.logs }
    }

    let currentNodes = [startNode]
    let context = {}
    const visited = new Set()

    while (currentNodes.length > 0) {
      const node = currentNodes.shift()
      
      if (visited.has(node.id)) {
        continue
      }
      visited.add(node.id)
      
      context = await this.executeNode(node, context)
      
      const nextNodes = this.getNextNodes(node.id)
      currentNodes.push(...nextNodes)
    }

    this.log('COMPLETE', 'Workflow execution completed successfully')
    return { success: true, logs: this.logs, context }
  }
}

module.exports = WorkflowExecutor
