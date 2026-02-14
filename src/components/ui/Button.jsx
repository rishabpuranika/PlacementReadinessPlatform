export function Button({ variant = 'secondary', children, onClick, type = 'button', ...props }) {
  const className = variant === 'primary' ? 'kn-btn kn-btn-primary' : 'kn-btn kn-btn-secondary'
  return (
    <button type={type} className={className} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
