import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { getAnalysisById, getLastAnalysisId } from '../../lib/storage'
import { ArrowLeft } from 'lucide-react'

export function ResultsPage() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || getLastAnalysisId()

  const data = useMemo(() => {
    if (id) return getAnalysisById(id)
    return null
  }, [id])

  if (!data) {
    return (
      <div className="space-y-6">
        <Link to="/dashboard/analyze" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Analyze
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No analysis found. Run an analysis first.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/dashboard/analyze" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Analyze
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600 text-sm">
            {data.company && `${data.company}`}
            {data.role && ` · ${data.role}`}
            {data.createdAt && ` · ${new Date(data.createdAt).toLocaleDateString()}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{data.readinessScore}</p>
          <p className="text-sm text-gray-500">Readiness Score</p>
        </div>
      </div>

      {/* Key skills */}
      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.extractedSkills || {}).map(([cat, skills]) =>
              skills.map((s) => (
                <span
                  key={`${cat}-${s}`}
                  className="px-3 py-1 text-sm rounded-full bg-primary-light text-primary"
                >
                  {s}
                </span>
              ))
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(data.extractedSkills || {}).map(([cat, skills]) => (
              <div key={cat}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{cat}</p>
                <p className="text-sm text-gray-700">{skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {Object.entries(data.checklist || {}).map(([round, items]) => (
              <li key={round}>
                <h3 className="font-semibold text-gray-900 mb-2">{round}</h3>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(data.plan || {}).map(([day, { focus, items }]) => (
              <div key={day}>
                <h3 className="font-semibold text-gray-900 mb-1">{day}: {focus}</h3>
                <ul className="space-y-1">
                  {items?.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 10 likely questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {(data.questions || []).map((q) => (
              <li key={q} className="text-gray-700">
                {q}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
