const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')
const router = express.Router()

// Cliente de Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

console.log('Supabase URL:', process.env.SUPABASE_URL ? 'OK' : 'FALTA')
console.log('Supabase KEY:', process.env.SUPABASE_KEY ? 'OK' : 'FALTA')

// ── REGISTRO ────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    // Verificar si ya existe en Supabase
    const { data: exists } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (exists) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('Intentando registrar:', email)

    // Guardar usuario en Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        email, 
        name, 
        password: hashedPassword 
      }])
      .select()
      .single()

    console.log('Resultado:', { data, error })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Generar token
    const token = jwt.sign(
      { id: data.id, email: data.email },
      process.env.JWT_SECRET || 'flowly_secret_key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Usuario creado correctamente',
      token,
      user: { id: data.id, email: data.email, name: data.name }
    })

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ── LOGIN ───────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' })
    }

    // Buscar usuario en Supabase
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }
    
    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'flowly_secret_key',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    })

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// ── VERIFICAR TOKEN ─────────────────────────────────
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No autorizado' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flowly_secret_key')
    res.json({ user: decoded })
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
})

module.exports = router
