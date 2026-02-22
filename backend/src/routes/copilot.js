const express = require('express')
const Groq = require('groq-sdk')
const router = express.Router()

console.log('Initializing copilot routes...')

// Initialize Groq only when needed
let groq = null

const getGroqClient = () => {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured')
    }
    groq = new Groq({ apiKey })
  }
  return groq
}

router.post('/chat', async (req, res) => {
  console.log('POST /api/copilot/chat received:', req.body)
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'Message required' })

    const client = getGroqClient()
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres el AI Copilot de Flowly, plataforma de automatización de workflows. Ayudás a crear flujos. Nodos disponibles: Webhook, Schedule, HubSpot Lead, Email Recibido, Enviar Email, Slack Message, HTTP Request, Google Sheets, GPT-4 Analysis, Condición IF, Delay, Aprobación Manual. Respondés conciso y útil.'
        },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'No response'
    console.log('Groq response:', reply)
    res.json({ success: true, reply })
  } catch (error) {
    console.error('Groq error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

console.log('Copilot routes configured. Available routes:', router.stack.map(r => r.route?.path).filter(Boolean))
module.exports = router
