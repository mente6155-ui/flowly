import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Crown, User, LogOut } from 'lucide-react'
import Navigation from './Navigation.jsx'

export default function Sidebar({ activePage }) {
  const navigate = useNavigate()

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-slate-900/95 backdrop-blur-sm border-r border-slate-800/50">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50">
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  opacity: 0.2,
                  filter: 'blur(8px)'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Original SVG Logo */}
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" className="relative z-10">
                <motion.path
                  d="M12 36C12 30.4772 16.4772 26 22 26H26C31.5228 26 36 21.5228 36 16V12"
                  stroke="url(#g1)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.circle
                  cx="12"
                  cy="36"
                  r="3"
                  fill="#6366f1"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.circle
                  cx="36"
                  cy="12"
                  r="3"
                  fill="#06b6d4"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <defs>
                  <linearGradient id="g1" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
                    <motion.stop
                      stopColor="#6366f1"
                      animate={{
                        stopColor: ['#6366f1', '#8b5cf6', '#6366f1']
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.stop
                      offset="1"
                      stopColor="#06b6d4"
                      animate={{
                        stopColor: ['#06b6d4', '#0ea5e9', '#06b6d4']
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Status Indicator */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            </div>
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              FLOWLY
            </h1>
            <p className="text-xs text-slate-400">Workspace</p>
          </div>
        </motion.div>
        
        <motion.button
          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
        >
          <Crown className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Navigation */}
      <Navigation activePage={activePage} />

      {/* User Section */}
      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <User className="w-5 h-5 text-white" />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Sarah Connor</p>
            <p className="text-xs text-slate-400">Ops Lead • Premium</p>
          </div>
          
          <motion.button
            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 group-hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </motion.div>
        
        {/* Upgrade Banner */}
        <motion.div 
          className="mt-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-400">Pro Plan</p>
              <p className="text-xs text-slate-400 mt-0.5">Unlock all features</p>
            </div>
            <motion.button
              className="px-3 py-1.5 bg-indigo-500 text-white text-xs font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upgrade
            </motion.button>
          </div>
        </motion.div>
      </div>
    </aside>
  )
}
