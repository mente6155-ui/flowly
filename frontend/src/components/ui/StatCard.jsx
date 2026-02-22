import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * Tarjeta de estadística profesional y refinada.
 */
export default function StatCard({ icon: Icon, value, label, trend, trendLabel, subtitle, className = '' }) {
  const hasPositiveTrend = trend !== null && trend !== undefined && trend > 0
  const hasNegativeTrend = trend !== null && trend !== undefined && trend < 0
  
  return (
    <div className={`group relative rounded-2xl bg-flowly-card border border-flowly-border p-8 hover:border-flowly-accent/30 hover:shadow-apple-lg transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        {Icon && (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-flowly-accent/20 to-flowly-violet/20 flex items-center justify-center border border-flowly-accent/20 group-hover:border-flowly-accent/30 transition-all duration-300">
            <Icon className="w-8 h-8 text-flowly-accent" />
          </div>
        )}
        {trend !== null && trend !== undefined && (
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
            hasPositiveTrend 
              ? 'bg-flowly-emerald/15 text-flowly-emerald border-flowly-emerald/30' 
              : hasNegativeTrend
              ? 'bg-flowly-rose/15 text-flowly-rose border-flowly-rose/30'
              : 'bg-flowly-card text-flowly-muted border-flowly-border'
          }`}>
            {hasPositiveTrend && <TrendingUp className="w-3.5 h-3.5" />}
            {hasNegativeTrend && <TrendingDown className="w-3.5 h-3.5" />}
            <span>
              {hasPositiveTrend ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-5xl font-bold text-[#f5f5f7] mb-2 tracking-tight">{value}</div>
      <div className="text-sm text-flowly-muted font-medium mb-1">{label}</div>
      {subtitle && (
        <div className="text-xs text-flowly-muted/70 mt-2">{subtitle}</div>
      )}
      {trendLabel && (
        <div className="text-xs text-flowly-muted/60 mt-3 pt-3 border-t border-flowly-border/50">{trendLabel}</div>
      )}
    </div>
  )
}
