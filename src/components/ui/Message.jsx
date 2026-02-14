/**
 * Error: explain what went wrong + how to fix. Empty: provide next action.
 */
export function Message({ variant = 'empty', title, children }) {
  const className = variant === 'error' ? 'kn-message kn-message--error' : 'kn-message kn-message--empty'
  return (
    <div className={className}>
      {title && <strong>{title}</strong>}
      {children}
    </div>
  )
}
