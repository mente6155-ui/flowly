/**
 * Card profesional y refinada.
 */
export default function Card({ title, children, className = '', hoverable = false }) {
  return (
    <div
      className={`
        rounded-2xl bg-flowly-card border border-flowly-border shadow-apple
        transition-all duration-300
        ${hoverable ? 'hover:shadow-apple-lg hover:border-flowly-accent/20 hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
    >
      {title && (
        <div className="px-8 py-6 border-b border-flowly-border">
          <h3 className="text-[#f5f5f7] font-semibold text-lg">{title}</h3>
        </div>
      )}
      <div className={title ? 'p-8' : 'p-8'}>{children}</div>
    </div>
  )
}
