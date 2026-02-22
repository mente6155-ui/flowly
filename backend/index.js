require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./src/routes/auth')
const workflowRoutes = require('./src/routes/workflows')
const copilotRoutes = require('./src/routes/copilot')

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`)
  next()
})

// ── Rutas ───────────────────────────────────────────
console.log('Loading auth routes...')
app.use('/api/auth', authRoutes)
console.log('Loading workflow routes...')
app.use('/api/workflows', workflowRoutes)
console.log('Loading copilot routes...')
app.use('/api/copilot', copilotRoutes)
console.log('All routes loaded successfully!')

// ── Ruta de salud ───────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Flowly Backend funcionando',
    timestamp: new Date().toISOString()
  })
})

// ── Iniciar servidor ────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Flowly Backend corriendo en http://localhost:${PORT}`)
})
