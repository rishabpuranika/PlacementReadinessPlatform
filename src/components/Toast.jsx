import { useEffect } from 'react'

export function Toast({ message, visible, onDismiss }) {
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, 2500)
    return () => clearTimeout(t)
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
