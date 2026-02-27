import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  GitBranch, 
  LayoutTemplate, 
  Cloud, 
  Bot, 
  BarChart3,
  Home,
  Settings,
  Users,
  Zap
} from 'lucide-react'

export default function Navigation({ activePage }) {
  const navigate = useNavigate()

  const navigationItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      route: '/dashboard', 
      color: '#6366f1',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-500/10 to-indigo-600/10',
      borderColor: 'border-indigo-500/30',
      shadowColor: 'shadow-indigo-500/10'
    },
    { 
      icon: GitBranch, 
      label: 'Workflows', 
      route: '/workflows', 
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/30',
      shadowColor: 'shadow-purple-500/10'
    },
    { 
      icon: LayoutTemplate, 
      label: 'Templates', 
      route: '/templates', 
      color: '#ec4899',
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-500/10 to-pink-600/10',
      borderColor: 'border-pink-500/30',
      shadowColor: 'shadow-pink-500/10'
    },
    { 
      icon: Cloud, 
      label: 'Integrations', 
      route: '/integrations', 
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-500/10 to-cyan-600/10',
      borderColor: 'border-cyan-500/30',
      shadowColor: 'shadow-cyan-500/10'
    },
    { 
      icon: Bot, 
      label: 'Agents', 
      route: '/agents', 
      color: '#f59e0b',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-500/10 to-amber-600/10',
      borderColor: 'border-amber-500/30',
      shadowColor: 'shadow-amber-500/10'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      route: '/analytics', 
      color: '#10b981',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/10',
      borderColor: 'border-emerald-500/30',
      shadowColor: 'shadow-emerald-500/10'
    },
  ]

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navigationItems.map((item, index) => {
        const Icon = item.icon
        const isActive = activePage === item.label
        
        return (
          <motion.button
            key={item.label}
            onClick={() => navigate(item.route)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
              isActive 
                ? `bg-gradient-to-r ${item.bgGradient} border ${item.borderColor} shadow-lg ${item.shadowColor}` 
                : 'hover:bg-slate-800/30 hover:border-slate-700/50 border border-transparent'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`relative flex items-center justify-center w-5 h-5 ${
              isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
            }`}>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                isActive ? `bg-gradient-to-br ${item.gradient}` : 'bg-slate-700/50'
              }`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: item.color, opacity: 0.2 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            
            <div className="flex-1">
              <span className={`font-medium text-sm ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className={`h-0.5 rounded-full mt-1 bg-gradient-to-r ${item.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                />
              )}
            </div>
            
            {isActive && (
              <motion.div
                className={`w-2 h-2 rounded-full bg-gradient-to-br ${item.gradient}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        )
      })}
      
      {/* Divider */}
      <div className="border-t border-slate-700/50 my-4" />
      
      {/* Additional Items */}
      <motion.button
        onClick={() => navigate('/settings')}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group hover:bg-slate-800/30 hover:border-slate-700/50 border border-transparent"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Settings className="w-5 h-5 text-slate-400 group-hover:text-white" />
        <span className="font-medium text-sm text-slate-400 group-hover:text-white">Settings</span>
      </motion.button>
    </nav>
  )
}
