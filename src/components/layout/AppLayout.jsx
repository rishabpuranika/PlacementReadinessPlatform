import { TopBar } from './TopBar'
import { ContextHeader } from './ContextHeader'
import { PrimaryWorkspace } from './PrimaryWorkspace'
import { SecondaryPanel } from './SecondaryPanel'
import { ProofFooter } from './ProofFooter'

export function AppLayout({
  projectName,
  step,
  totalSteps,
  status,
  headline,
  subtext,
  stepExplanation,
  promptText,
  children,
  onCopy,
  onBuildInLovable,
  onItWorked,
  onError,
  onAddScreenshot,
  proofItems,
  onProofChange,
}) {
  return (
    <div className="kn-app">
      <TopBar
        projectName={projectName}
        step={step}
        totalSteps={totalSteps}
        status={status}
      />
      <ContextHeader headline={headline} subtext={subtext} />
      <div className="kn-main">
        <PrimaryWorkspace>
          {children ?? (
            <div className="kn-card">
              <p className="kn-text-block kn-caption">
                Primary workspace. Main product interaction lives here. Clean cards, predictable components.
              </p>
            </div>
          )}
        </PrimaryWorkspace>
        <SecondaryPanel
          stepExplanation={stepExplanation}
          promptText={promptText}
          onCopy={onCopy}
          onBuildInLovable={onBuildInLovable}
          onItWorked={onItWorked}
          onError={onError}
          onAddScreenshot={onAddScreenshot}
        />
      </div>
      <ProofFooter items={proofItems} onProofChange={onProofChange} />
    </div>
  )
}
