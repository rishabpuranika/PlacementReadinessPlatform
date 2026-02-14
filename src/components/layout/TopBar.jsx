import { StatusBadge } from '../ui/StatusBadge'

export function TopBar({ projectName, step, totalSteps, status }) {
  return (
    <header className="kn-topbar" role="banner">
      <div className="kn-topbar__left">{projectName}</div>
      <div className="kn-topbar__center">
        Step {step} / {totalSteps}
      </div>
      <div className="kn-topbar__right">
        <StatusBadge status={status} />
      </div>
    </header>
  )
}
