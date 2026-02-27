import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar.jsx'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  Key, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  Moon, 
  Sun, 
  Monitor, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  Edit3, 
  LogOut,
  HelpCircle,
  FileText,
  Zap,
  Cpu,
  HardDrive,
  Wifi,
  Volume2,
  VolumeX
} from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  }
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    desktop: true
  })
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accent: 'blue',
    fontSize: 'medium',
    language: 'en'
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    apiAccess: false
  })

  const settingsSections = [
    { id: 'profile', name: 'Profile', icon: User, color: '#6366f1' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: '#22c55e' },
    { id: 'security', name: 'Security', icon: Shield, color: '#ef4444' },
    { id: 'appearance', name: 'Appearance', icon: Palette, color: '#a855f7' },
    { id: 'integrations', name: 'Integrations', icon: Globe, color: '#06b6d4' },
    { id: 'data', name: 'Data & Storage', icon: Database, color: '#f59e0b' },
    { id: 'api', name: 'API Keys', icon: Key, color: '#8b5cf6' },
    { id: 'advanced', name: 'Advanced', icon: Cpu, color: '#64748b' }
  ]

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const SectionCard = ({ title, description, children, icon: Icon, color }) => (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full border-0 cursor-pointer p-0 transition-all duration-300 ${
          checked 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
            : 'bg-white/10'
        }`}
      >
        <span 
          className={`absolute top-0.5 transition-all duration-300 w-5 h-5 rounded-full bg-white shadow-md ${
            checked ? 'left-6' : 'left-0.5'
          }`} 
        />
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0f1117', color: '#cbd5e1', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
        .settings-card { transition: all 0.2s ease; }
        .settings-card:hover { border-color: rgba(99,102,241,0.3) !important; transform: translateY(-2px); }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .neon-border {
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
        }
        .magnetic-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .magnetic-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
        }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Settings" />

      {/* MAIN CONTENT */}
      <main className="ml-64 relative z-10">
        {/* Premium Header */}
        <motion.header 
          className="sticky top-0 z-50 glass-morphism border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <SettingsIcon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Settings</h1>
                  <p className="text-slate-400 text-sm mt-0.5">Manage your account and preferences</p>
                </div>
              </motion.div>
              
              <motion.button
                onClick={handleSave}
                disabled={isLoading}
                className="glass-morphism px-6 py-3 rounded-xl flex items-center gap-3 text-slate-200 hover:text-white transition-all duration-300 magnetic-hover"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="font-medium">Save Changes</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Premium Content */}
        <div className="p-8">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {/* Sidebar Navigation */}
            <motion.div 
              className="w-80 flex-shrink-0"
              variants={cardVariants}
            >
              <div className="glass-morphism rounded-2xl p-6 neon-border">
                <div className="space-y-3">
                  {settingsSections.map((section, index) => {
                    const Icon = section.icon
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all magnetic-hover ${
                          activeSection === section.id
                            ? 'bg-white/10 border border-white/20'
                            : 'hover:bg-white/5'
                        }`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: activeSection === section.id ? `${section.color}20` : 'rgba(255,255,255,0.05)' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: activeSection === section.id ? section.color : '#64748b' }} />
                        </div>
                        <span className={`font-medium ${
                          activeSection === section.id ? 'text-white' : 'text-slate-400'
                        }`}>
                          {section.name}
                        </span>
                        {activeSection === section.id && (
                          <motion.div
                            className="ml-auto"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* SETTINGS CONTENT */}
            <div className="flex-1 space-y-6">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <motion.div variants={cardVariants}>
                  <div className="glass-morphism rounded-2xl overflow-hidden neon-border magnetic-hover">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
                          <p className="text-sm text-slate-400">Manage your account information and preferences</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <User className="w-8 h-8 text-white" />
                            </div>
                            <motion.button 
                              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Camera className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">John Doe</h4>
                            <p className="text-slate-400 text-sm">john.doe@example.com</p>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                            <input
                              type="text"
                              defaultValue="John"
                              className="w-full px-4 py-2 glass-morphism border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                            <input
                              type="text"
                              defaultValue="Doe"
                              className="w-full px-4 py-2 glass-morphism border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                            <input
                              type="email"
                              defaultValue="john.doe@example.com"
                              className="w-full px-4 py-2 glass-morphism border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                            <input
                              type="tel"
                              defaultValue="+1 234 567 8900"
                              className="w-full px-4 py-2 glass-morphism border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <motion.div variants={cardVariants}>
                  <div className="glass-morphism rounded-2xl overflow-hidden neon-border magnetic-hover">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                          <Bell className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                          <p className="text-sm text-slate-400">Control how and when you receive notifications</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {[
                          { key: 'email', label: 'Email Notifications', icon: Mail },
                          { key: 'push', label: 'Push Notifications', icon: Volume2 },
                          { key: 'sms', label: 'SMS Notifications', icon: Phone },
                          { key: 'desktop', label: 'Desktop Notifications', icon: Monitor }
                        ].map((item, index) => {
                          const Icon = item.icon
                          return (
                            <motion.div 
                              key={item.key}
                              className="flex items-center justify-between p-4 rounded-xl glass-morphism border border-white/5"
                              whileHover={{ scale: 1.02 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + index * 0.1 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-300">{item.label}</span>
                              </div>
                              <motion.button
                                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={`relative w-12 h-6 rounded-full border-0 cursor-pointer p-0 transition-all duration-300 ${
                                  notifications[item.key] 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                    : 'bg-white/10'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <motion.span 
                                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                                  animate={{ x: notifications[item.key] ? 24 : 2 }}
                                  transition={{ type: 'spring', stiffness: 500 }}
                                />
                              </motion.button>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <motion.div variants={cardVariants}>
                  <div className="glass-morphism rounded-2xl overflow-hidden neon-border magnetic-hover">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                          <p className="text-sm text-slate-400">Manage your account security and access</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Change Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="w-full px-4 py-2 pr-12 glass-morphism border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-all"
                            />
                            <motion.button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </motion.button>
                          </div>
                        </motion.div>
                        
                        <div className="space-y-4">
                          {[
                            { key: 'twoFactor', label: 'Two-Factor Authentication', icon: Lock },
                            { key: 'apiAccess', label: 'API Access', icon: Key }
                          ].map((item, index) => {
                            const Icon = item.icon
                            return (
                              <motion.div 
                                key={item.key}
                                className="flex items-center justify-between p-4 rounded-xl glass-morphism border border-white/5"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-slate-400" />
                                  </div>
                                  <span className="text-sm text-slate-300">{item.label}</span>
                                </div>
                                <motion.button
                                  onClick={() => setSecurity(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                  className={`relative w-12 h-6 rounded-full border-0 cursor-pointer p-0 transition-all duration-300 ${
                                    security[item.key] 
                                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                                      : 'bg-white/10'
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <motion.span 
                                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                                    animate={{ x: security[item.key] ? 24 : 2 }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                  />
                                </motion.button>
                              </motion.div>
                            )
                          })}
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Session Timeout</label>
                          <select
                            value={security.sessionTimeout}
                            onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                            className="w-full px-4 py-2 glass-morphism border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50 transition-all"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="240">4 hours</option>
                          </select>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <motion.div variants={cardVariants}>
                  <div className="glass-morphism rounded-2xl overflow-hidden neon-border magnetic-hover">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <Palette className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Appearance Settings</h3>
                          <p className="text-sm text-slate-400">Customize the look and feel of your interface</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Theme</label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: 'light', icon: Sun, label: 'Light' },
                              { value: 'dark', icon: Moon, label: 'Dark' },
                              { value: 'system', icon: Monitor, label: 'System' }
                            ].map(theme => {
                              const Icon = theme.icon
                              return (
                                <motion.button
                                  key={theme.value}
                                  onClick={() => setAppearance(prev => ({ ...prev, theme: theme.value }))}
                                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all magnetic-hover ${
                                    appearance.theme === theme.value
                                      ? 'bg-purple-500/10 border-purple-500/30'
                                      : 'bg-white/5 border-white/10 hover:border-white/20'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Icon className={`w-6 h-6 ${appearance.theme === theme.value ? 'text-purple-400' : 'text-slate-400'}`} />
                                  <span className={`text-sm ${appearance.theme === theme.value ? 'text-purple-400' : 'text-slate-400'}`}>
                                    {theme.label}
                                  </span>
                                </motion.button>
                              )
                            })}
                          </div>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Accent Color</label>
                          <div className="grid grid-cols-6 gap-3">
                            {['blue', 'purple', 'green', 'red', 'orange', 'pink'].map((color, index) => (
                              <motion.button
                                key={color}
                                onClick={() => setAppearance(prev => ({ ...prev, accent: color }))}
                                className={`w-12 h-12 rounded-lg border-2 transition-all magnetic-hover ${
                                  appearance.accent === color ? 'border-white scale-110' : 'border-transparent'
                                }`}
                                style={{
                                  background: color === 'blue' ? '#3b82f6' :
                                             color === 'purple' ? '#a855f7' :
                                             color === 'green' ? '#22c55e' :
                                             color === 'red' ? '#ef4444' :
                                             color === 'orange' ? '#f59e0b' :
                                             '#ec4899'
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                              />
                            ))}
                          </div>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Font Size</label>
                          <select
                            value={appearance.fontSize}
                            onChange={(e) => setAppearance(prev => ({ ...prev, fontSize: e.target.value }))}
                            className="w-full px-4 py-2 glass-morphism border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-all"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Other sections placeholder */}
              {['integrations', 'data', 'api', 'advanced'].includes(activeSection) && (
                <motion.div variants={cardVariants}>
                  <div className="glass-morphism rounded-2xl overflow-hidden neon-border magnetic-hover">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-400/20 flex items-center justify-center">
                          {(() => {
                            const section = settingsSections.find(s => s.id === activeSection)
                            const Icon = section?.icon || SettingsIcon
                            return <Icon className="w-6 h-6 text-slate-400" />
                          })()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {settingsSections.find(s => s.id === activeSection)?.name || 'Settings'}
                          </h3>
                          <p className="text-sm text-slate-400">This section is under development</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-center py-12">
                        <motion.div 
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700/20 to-slate-600/10 flex items-center justify-center mx-auto mb-4"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <SettingsIcon className="w-8 h-8 text-slate-400" />
                        </motion.div>
                        <motion.p 
                          className="text-slate-400 font-medium"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Coming Soon
                        </motion.p>
                        <motion.p 
                          className="text-slate-500 text-sm mt-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          Advanced settings will be available soon
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
