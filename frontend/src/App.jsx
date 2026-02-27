import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import WorkflowEditor from './pages/WorkflowEditor.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Workflows from './pages/Workflows.jsx'
import Analytics from './pages/Analytics.jsx'
import Agents from './pages/Agents.jsx'
import Settings from './pages/Settings.jsx'
import Templates from './pages/Templates.jsx'
import Integrations from './pages/Integrations.jsx'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1d27',
              color: '#f1f5f9',
              border: '1px solid rgba(99,102,241,0.25)',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editor/new" element={<WorkflowEditor />} />
          <Route path="/editor/:id" element={<WorkflowEditor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
