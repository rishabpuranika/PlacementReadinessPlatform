export function Card({ children, className = '', ...props }) {
  return (
    <div className={`kn-card ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
