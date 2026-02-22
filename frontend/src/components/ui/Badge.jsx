/**
 * Badge nivel enterprise - con más variantes y efectos.
 */
const variants = {
  active: 'bg-flowly-emerald/20 text-flowly-emerald border-flowly-emerald/40 shadow-sm',
  inactive: 'bg-flowly-card text-flowly-muted border-flowly-border',
  primary: 'bg-flowly-accent/20 text-flowly-accent border-flowly-accent/40 shadow-sm',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm',
  success: 'bg-flowly-emerald/20 text-flowly-emerald border-flowly-emerald/40 shadow-sm',
  error: 'bg-flowly-rose/20 text-flowly-rose border-flowly-rose/40 shadow-sm',
}

export default function Badge({ children, variant = 'inactive', className = '', dot = false }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold
        border transition-all duration-200
        ${variants[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'active' || variant === 'success' ? 'bg-flowly-emerald' :
          variant === 'error' ? 'bg-flowly-rose' :
          variant === 'warning' ? 'bg-amber-400' :
          'bg-flowly-accent'
        }`} />
      )}
      {children}
    </span>
  )
}
