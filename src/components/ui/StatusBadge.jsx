const STATUS_MAP = {
  'Not Started': 'kn-badge',
  'In Progress': 'kn-badge kn-badge--accent',
  'Shipped': 'kn-badge kn-badge--success',
}

export function StatusBadge({ status = 'Not Started' }) {
  const className = STATUS_MAP[status] ?? STATUS_MAP['Not Started']
  return <span className={className}>{status}</span>
}
