import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { getHistory } from '../../lib/storage'
import { Calendar, Building2, Briefcase } from 'lucide-react'

export function HistoryPage() {
  const { entries, skippedCount } = getHistory()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">History</h2>
        <p className="text-gray-600">Your past JD analyses. Click to view results.</p>
      </div>

      {skippedCount > 0 && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          One saved entry couldn&apos;t be loaded. Create a new analysis.
        </p>
      )}

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No analyses yet. Run an analysis from the Analyze page.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link to={`/dashboard/results?id=${entry.id}`}>
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.company && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm">{entry.company}</span>
                          </div>
                        )}
                        {entry.role && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-sm">{entry.role}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{entry.finalScore ?? entry.readinessScore}</span>
                        <span className="text-sm text-gray-500">score</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
