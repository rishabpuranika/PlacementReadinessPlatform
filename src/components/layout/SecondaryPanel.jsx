import { CopyablePrompt } from '../ui/CopyablePrompt'
import { Button } from '../ui/Button'

export function SecondaryPanel({
  stepExplanation,
  promptText,
  onCopy,
  onBuildInLovable,
  onItWorked,
  onError,
  onAddScreenshot,
}) {
  return (
    <aside className="kn-panel" role="complementary">
      <section>
        <h2 className="kn-panel__title">Step</h2>
        <p className="kn-caption">{stepExplanation}</p>
      </section>
      <section>
        <h2 className="kn-panel__title">Prompt</h2>
        <CopyablePrompt text={promptText} onCopy={onCopy} />
      </section>
      <section className="kn-panel__actions">
        <Button variant="secondary" onClick={onCopy}>Copy</Button>
        <Button variant="primary" onClick={onBuildInLovable}>Build in Lovable</Button>
        <Button variant="secondary" onClick={onItWorked}>It Worked</Button>
        <Button variant="secondary" onClick={onError}>Error</Button>
        <Button variant="secondary" onClick={onAddScreenshot}>Add Screenshot</Button>
      </section>
    </aside>
  )
}
