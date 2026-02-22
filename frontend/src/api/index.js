// API configuration and endpoints
const API_BASE_URL = 'http://localhost:3001/api'

// Generic request function
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('flowly_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

// Authentication API
export const auth = {
  login: async (email, password) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  logout: async () => {
    return await request('/auth/logout', {
      method: 'POST',
    })
  },

  me: async () => {
    return await request('/auth/me')
  },
}

// Workflows API
export const workflows = {
  getAll: async () => {
    return await request('/workflows')
  },

  get: async (id) => {
    return await request(`/workflows/${id}`)
  },

  create: async (workflowData) => {
    return await request('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflowData),
    })
  },

  update: async (id, workflowData) => {
    return await request(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflowData),
    })
  },

  delete: async (id) => {
    return await request(`/workflows/${id}`, {
      method: 'DELETE',
    })
  },

  run: async (id) => {
    return await request(`/workflows/${id}/run`, {
      method: 'POST',
    })
  },
}

// Export everything
export default {
  auth,
  workflows,
  request,
}
