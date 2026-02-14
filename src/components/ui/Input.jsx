export function Input({ className = '', ...props }) {
  return <input className={`kn-input ${className}`.trim()} {...props} />
}
