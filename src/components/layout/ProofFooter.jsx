const DEFAULT_ITEMS = [
  { id: 'ui', label: 'UI Built', proof: null },
  { id: 'logic', label: 'Logic Working', proof: null },
  { id: 'test', label: 'Test Passed', proof: null },
  { id: 'deployed', label: 'Deployed', proof: null },
]

export function ProofFooter({ items = DEFAULT_ITEMS, onProofChange }) {
  return (
    <footer className="kn-proof-footer" role="contentinfo">
      <h2 className="kn-proof-footer__title">Proof</h2>
      <ul className="kn-proof-footer__list">
        {items.map((item) => (
          <li key={item.id}>
            <label className="kn-check-item">
              <input
                type="checkbox"
                checked={!!item.proof}
                onChange={(e) => onProofChange?.(item.id, e.target.checked)}
                aria-label={`${item.label} — proof required`}
              />
              <span>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </footer>
  )
}
