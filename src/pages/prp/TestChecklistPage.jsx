import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import {
  getTestChecklist,
  setTestChecklist,
  resetTestChecklist,
  isTestChecklistComplete,
} from '../../lib/testChecklistStorage'
import { RotateCcw, ChevronRight, AlertTriangle } from 'lucide-react'

const TESTS = [
  { label: 'JD required validation works', hint: 'Clear JD and submit; form should block.' },
  { label: 'Short JD warning shows for <200 chars', hint: 'Paste <200 chars in JD; warning should appear.' },
  { label: 'Skills extraction groups correctly', hint: 'Paste JD with DSA, React; skills should be in Core CS, Web.' },
  { label: 'Round mapping changes based on company + skills', hint: 'Analyze with Amazon vs unknown; rounds should differ.' },
  { label: 'Score calculation is deterministic', hint: 'Same JD twice; same base score.' },
  { label: 'Skill toggles update score live', hint: 'Toggle skill on Results; score updates immediately.' },
  { label: 'Changes persist after refresh', hint: 'Toggle skill, refresh; same state.' },
  { label: 'History saves and loads correctly', hint: 'Run analysis, open History; entry appears and opens.' },
  { label: 'Export buttons copy the correct content', hint: 'Copy 7-day plan; paste in editor; verify format.' },
  { label: 'No console errors on core pages', hint: 'Visit /, /dashboard, /dashboard/analyze, /dashboard/results; check DevTools console.' },
]

export function TestChecklistPage() {
  const [checked, setChecked] = useState(getTestChecklist)
  const passed = checked.filter(Boolean).length
  const complete = passed === 10

  useEffect(() => {
    setTestChecklist(checked)
  }, [checked])

  const handleToggle = (index) => {
    setChecked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleReset = () => {
    setChecked(resetTestChecklist())
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Test Checklist</h1>
          <p className="text-gray-600 text-sm">Verify placement readiness platform before shipping.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tests Passed: {passed} / 10</CardTitle>
            {passed < 10 && (
              <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="font-medium">Fix issues before shipping.</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {TESTS.map(({ label, hint }, i) => (
                <li key={i} className="flex items-start gap-4">
                  <label className="flex items-start gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={checked[i] ?? false}
                      onChange={() => handleToggle(i)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-medium text-gray-900">{label}</span>
                      {hint && (
                        <p className="text-sm text-gray-500 mt-1">How to test: {hint}</p>
                      )}
                    </div>
                  </label>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset checklist
              </button>
              <Link
                to="/prp/08-ship"
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  complete
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                Ship <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
