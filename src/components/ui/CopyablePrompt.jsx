import { useState } from 'react'

export function CopyablePrompt({ text, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        onCopy?.()
        setTimeout(() => setCopied(false), 1500)
      })
    } else {
      onCopy?.()
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        className="kn-prompt-box"
        readOnly
        value={text}
        aria-label="Copyable prompt"
      />
      <button
        type="button"
        className="kn-btn kn-btn-secondary"
        onClick={handleCopy}
        style={{ marginTop: 'var(--space-1)' }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
