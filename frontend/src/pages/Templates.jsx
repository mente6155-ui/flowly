import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { 
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Play,
  Plus,
  ShoppingBag,
  Bot,
  Smartphone,
  BarChart3,
  Mail,
  Package,
  TrendingUp,
  Zap,
  Sparkles,
  Layers,
  Grid3X3,
  ChevronRight,
  Heart,
  Download,
  Eye,
  Award,
  Target,
  Rocket,
  Flame
} from 'lucide-react'

export default function Templates() {
  const navigate = useNavigate()
  
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'E-commerce Automation',
      category: 'Sales',
      description: 'Automatiza el procesamiento de pedidos y notificaciones',
      icon: ShoppingBag,
      color: '#22c55e',
      difficulty: 'Intermedio',
      difficultyLevel: 2,
      estimatedTime: '15 min',
      uses: 1247,
      rating: 4.8,
      trending: true,
      featured: true
    },
    {
      id: '2',
      name: 'Customer Support Bot',
      category: 'Support',
      description: 'Bot inteligente para atención al cliente 24/7',
      icon: Bot,
      color: '#6366f1',
      difficulty: 'Avanzado',
      difficultyLevel: 3,
      estimatedTime: '30 min',
      uses: 892,
      rating: 4.9,
      trending: true,
      featured: true
    },
    {
      id: '3',
      name: 'Social Media Manager',
      category: 'Marketing',
      description: 'Programa y analiza contenido en redes sociales',
      icon: Smartphone,
      color: '#a855f7',
      difficulty: 'Básico',
      difficultyLevel: 1,
      estimatedTime: '10 min',
      uses: 2156,
      rating: 4.6,
      trending: false,
      featured: false
    },
    {
      id: '4',
      name: 'Data Analytics Pipeline',
      category: 'Analytics',
      description: 'Procesamiento automático de datos y reportes',
      icon: BarChart3,
      color: '#06b6d4',
      difficulty: 'Avanzado',
      difficultyLevel: 3,
      estimatedTime: '45 min',
      uses: 567,
      rating: 4.7,
      trending: false,
      featured: true
    },
    {
      id: '5',
      name: 'Email Marketing Campaign',
      category: 'Marketing',
      description: 'Campañas de email personalizadas y automatizadas',
      icon: Mail,
      color: '#f59e0b',
      difficulty: 'Intermedio',
      difficultyLevel: 2,
      estimatedTime: '20 min',
      uses: 1432,
      rating: 4.5,
      trending: false,
      featured: false
    },
    {
      id: '6',
      name: 'Inventory Management',
      category: 'Operations',
      description: 'Control de stock y alertas de reabastecimiento',
      icon: Package,
      color: '#ef4444',
      difficulty: 'Intermedio',
      difficultyLevel: 2,
      estimatedTime: '25 min',
      uses: 789,
      rating: 4.4,
      trending: false,
      featured: false
    }
  ])

  const [categories] = useState([
    { name: 'Todos', count: templates.length, icon: Grid3X3 },
    { name: 'Sales', count: 1, icon: TrendingUp },
    { name: 'Support', count: 1, icon: Bot },
    { name: 'Marketing', count: 2, icon: Sparkles },
    { name: 'Analytics', count: 1, icon: BarChart3 },
    { name: 'Operations', count: 1, icon: Package }
  ])

  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.uses - a.uses
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'newest') return b.id - a.id
    return 0
  })

  const getDifficultyColor = (level) => {
    const colors = {
      1: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      2: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
      3: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' }
    }
    return colors[level] || colors[1]
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="fill-amber-400 text-amber-400" />)
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} className="fill-amber-400/50 text-amber-400/50" />)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} size={14} className="text-slate-600" />)
    }
    
    return stars
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .glass-morphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .template-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .template-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .category-pill {
          transition: all 0.2s ease;
        }
        .category-pill:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar activePage="Templates" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Templates Gallery</h1>
          </div>
          <button 
            onClick={() => navigate('/editor/new')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={16} />
            Create Workflow
          </button>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* HERO SECTION */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Discover Perfect Templates</h2>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-2xl">
                    Jumpstart your automation journey with our curated collection of professional templates. 
                    From e-commerce to analytics, find the perfect workflow for your needs.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Rocket size={16} className="text-purple-400" />
                      <span className="text-sm text-slate-300">{templates.length} Templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-pink-400" />
                      <span className="text-sm text-slate-300">{templates.reduce((acc, t) => acc + t.uses, 0).toLocaleString()} Active Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-amber-400" />
                      <span className="text-sm text-slate-300">{templates.filter(t => t.featured).length} Featured</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center">
                    <Target size={48} className="text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-900/70 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* CATEGORIES */}
            <div className="flex gap-3 flex-wrap">
              {categories.map(category => {
                const Icon = category.icon
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`category-pill flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      selectedCategory === category.name
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{category.name}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                      selectedCategory === category.name
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-white/10 text-slate-400'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* TEMPLATES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(template => {
              const Icon = template.icon
              const difficultyColors = getDifficultyColor(template.difficultyLevel)
              
              return (
                <div
                  key={template.id}
                  className="template-card group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                  }}
                  onClick={() => navigate(`/editor/new?template=${template.id}`)}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${template.color}15 0%, transparent 70%)`
                    }}
                  />

                  {/* Featured badge */}
                  {template.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1">
                        <Flame size={12} />
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Trending badge */}
                  {template.trending && !template.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold flex items-center gap-1">
                        <TrendingUp size={12} />
                        Trending
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${template.color}20` }}
                      >
                        <Icon size={24} style={{ color: template.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-base mb-1">{template.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${difficultyColors.bg} ${difficultyColors.text} ${difficultyColors.border} border`}>
                            {template.difficulty}
                          </span>
                          <span className="text-xs text-slate-400">{template.category}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(template.rating)}
                        <span className="text-xs text-slate-400 ml-1">{template.rating}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {template.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          {template.uses}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/editor/new?template=${template.id}`)
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Play size={14} />
                        Use Template
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors"
                      >
                        <Heart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* EMPTY STATE */}
          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-center mb-6">
                <Search size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
              <p className="text-slate-400">Try adjusting your search or browse different categories</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
