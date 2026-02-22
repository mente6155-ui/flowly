require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server working' })
})

app.post('/api/copilot/chat', (req, res) => {
  console.log('Request received:', req.body)
  res.json({ success: true, reply: 'Test response from copilot' })
})

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`)
})
