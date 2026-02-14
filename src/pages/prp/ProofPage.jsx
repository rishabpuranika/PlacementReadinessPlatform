import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import {
  getProofSubmission,
  setProofSubmission,
  validateUrl,
  areProofLinksComplete,
} from '../../lib/proofStorage'
import { isTestChecklistComplete } from '../../lib/testChecklistStorage'
import { isShipped } from '../../lib/shippedStatus'
import { Copy, CheckCircle, Circle } from 'lucide-react'

const STEPS = [
  'Landing page built',
  'JD analysis flow with validation',
  'Results page (skills, checklist, plan, questions)',
  'Interactive skill toggles + live score',
  'History persistence',
  'Company intel + round mapping',
  'Export tools (copy/download)',
  'Test checklist passed (10/10)',
]

const SUBMISSION_TEMPLATE = (lovable, github, deployed) => `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${lovable || '—'}
GitHub Repository: ${github || '—'}
Live Deployment: ${deployed || '—'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`

export function ProofPage() {
  const [proof, setProof] = useState(getProofSubmission)
  const [validation, setValidation] = useState({
    lovableLink: null,
    githubLink: null,
    deployedLink: null,
  })

  const shipped = isShipped()
  const checklistComplete = isTestChecklistComplete()

  useEffect(() => {
    setProofSubmission(proof)
  }, [proof])

  const handleStepToggle = (index) => {
    setProof((prev) => {
      const next = { ...prev, steps: [...prev.steps] }
      next.steps[index] = !next.steps[index]
      return next
    })
  }

  const handleLinkChange = (field, value) => {
    setProof((prev) => ({ ...prev, [field]: value }))
    if (value.trim() === '') {
      setValidation((v) => ({ ...v, [field]: null }))
    } else {
      setValidation((v) => ({ ...v, [field]: validateUrl(value) }))
    }
  }

  const handleCopySubmission = useCallback(async () => {
    const text = SUBMISSION_TEMPLATE(
      proof.lovableLink?.trim() || '',
      proof.githubLink?.trim() || '',
      proof.deployedLink?.trim() || ''
    )
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.warn('Copy failed:', e)
    }
  }, [proof.lovableLink, proof.githubLink, proof.deployedLink])

  const linksComplete = areProofLinksComplete(proof)
  const stepsComplete = proof.steps?.length === 8 && proof.steps.every(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link to="/prp/08-ship" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-2">
            ← Back to Ship
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Proof</h1>
          <p className="text-gray-600 text-sm">Step completion and artifact links required for Shipped status.</p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              shipped ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {shipped ? (
              <>
                <CheckCircle className="w-4 h-4" /> Shipped
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" /> In Progress
              </>
            )}
          </span>
        </div>

        {/* Completion message when Shipped */}
        {shipped && (
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="py-8">
              <p className="text-lg font-medium text-gray-900 mb-2">You built a real product.</p>
              <p className="text-gray-700 mb-1">Not a tutorial. Not a clone.</p>
              <p className="text-gray-700 mb-4">A structured tool that solves a real problem.</p>
              <p className="text-gray-900 font-semibold">This is your proof of work.</p>
            </CardContent>
          </Card>
        )}

        {/* Step Completion Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Step Completion Overview</CardTitle>
            <p className="text-sm text-gray-500">
              {proof.steps?.filter(Boolean).length ?? 0} / 8 completed
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {STEPS.map((label, i) => (
                <li key={i} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepToggle(i)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    {proof.steps?.[i] ? (
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                    <span className={proof.steps?.[i] ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                      {label}
                    </span>
                  </button>
                  <span className="text-xs text-gray-400">
                    {proof.steps?.[i] ? 'Completed' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Artifact Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Artifact Inputs (Required for Ship Status)</CardTitle>
            <p className="text-sm text-gray-500">All links must be valid URLs (http:// or https://).</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="lovable" className="block text-sm font-medium text-gray-700 mb-1">
                Lovable Project Link
              </label>
              <input
                id="lovable"
                type="url"
                value={proof.lovableLink ?? ''}
                onChange={(e) => handleLinkChange('lovableLink', e.target.value)}
                placeholder="https://lovable.app/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {validation.lovableLink === false && proof.lovableLink?.trim() && (
                <p className="mt-1 text-sm text-red-600">Enter a valid URL (http:// or https://).</p>
              )}
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Repository Link
              </label>
              <input
                id="github"
                type="url"
                value={proof.githubLink ?? ''}
                onChange={(e) => handleLinkChange('githubLink', e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {validation.githubLink === false && proof.githubLink?.trim() && (
                <p className="mt-1 text-sm text-red-600">Enter a valid URL (http:// or https://).</p>
              )}
            </div>
            <div>
              <label htmlFor="deployed" className="block text-sm font-medium text-gray-700 mb-1">
                Deployed URL
              </label>
              <input
                id="deployed"
                type="url"
                value={proof.deployedLink ?? ''}
                onChange={(e) => handleLinkChange('deployedLink', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {validation.deployedLink === false && proof.deployedLink?.trim() && (
                <p className="mt-1 text-sm text-red-600">Enter a valid URL (http:// or https://).</p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Shipped status requires: 8/8 steps completed, 10/10 checklist passed, and all 3 links valid.
                {!checklistComplete && (
                  <span className="block mt-1 text-amber-700">
                    Complete the test checklist at <Link to="/prp/07-test" className="underline">/prp/07-test</Link>.
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={handleCopySubmission}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy Final Submission
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
