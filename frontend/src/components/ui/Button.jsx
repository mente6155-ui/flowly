/**
 * Botón profesional y refinado.
 */
const variantStyles = {
  primary:
    'bg-flowly-accent text-white hover:bg-flowly-accentHover active:scale-[0.98] shadow-glow-sm hover:shadow-glow transition-all duration-200',
  secondary:
    'bg-flowly-card text-[#f5f5f7] border border-flowly-border hover:bg-[#1a1a1a] hover:border-[#2a2a2a] active:scale-[0.98] transition-all duration-200',
  danger:
    'bg-flowly-rose/90 text-white hover:bg-flowly-rose active:scale-[0.98] transition-all duration-200',
  success:
    'bg-flowly-emerald text-white hover:bg-[#28c850] active:scale-[0.98] transition-all duration-200',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-xl font-medium',
  md: 'px-6 py-3 text-sm rounded-xl font-semibold',
  lg: 'px-8 py-4 text-base rounded-xl font-semibold',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading
  const base =
    'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-flowly-accent/40 focus:ring-offset-2 focus:ring-offset-flowly-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Guardando...
        </>
      ) : (
        children
      )}
    </button>
  )
}
