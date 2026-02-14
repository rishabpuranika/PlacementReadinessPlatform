export function ContextHeader({ headline, subtext }) {
  return (
    <div className="kn-context-header">
      <h1 className="kn-headline">{headline}</h1>
      {subtext && <p className="kn-subtext">{subtext}</p>}
    </div>
  )
}
