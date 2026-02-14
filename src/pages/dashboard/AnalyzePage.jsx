import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { runAnalysis } from '../../lib/analysisEngine'
import { inferCompanyIntel } from '../../lib/companyIntel'
import { generateRoundMapping } from '../../lib/roundMapping'
import { saveAnalysis } from '../../lib/storage'

export function AnalyzePage() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const jdTooShort = jdText.length > 0 && jdText.length < 200

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = runAnalysis({ company, role, jdText })
    const companyIntel = company.trim() ? inferCompanyIntel(company, jdText) : null
    const roundMapping = companyIntel
      ? generateRoundMapping(companyIntel.sizeCategory, result.extractedSkills)
      : []
    const record = saveAnalysis({
      company,
      role,
      jdText,
      ...result,
      companyIntel,
      roundMapping,
    })
    navigate(`/dashboard/results?id=${record.id}`)
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Analyze JD</h2>
        <p className="text-gray-600">Paste a job description to extract skills and get a prep plan.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter company, role, and full JD text. Analysis runs offline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Amazon"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE, Frontend Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="jd" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-gray-400">(required)</span>
              </label>
              <textarea
                id="jd"
                rows={12}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                required
              />
              {jdTooShort && (
                <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-primary hover:bg-primary-hover rounded-lg font-medium transition-colors"
            >
              Analyze
            </button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
