import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { isTestChecklistComplete } from '../../lib/testChecklistStorage'
import { Lock, CheckCircle } from 'lucide-react'

export function ShipPage() {
  const unlocked = isTestChecklistComplete()

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-700 mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ship locked</h1>
          <p className="text-gray-600 mb-6">
            Complete all 10 tests in the checklist before shipping.
          </p>
          <Link
            to="/prp/07-test"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
          >
            Open test checklist
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link to="/prp/07-test" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-2">
            ← Back to Test Checklist
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Ship</h1>
          <p className="text-gray-600 text-sm">All tests passed. Ready to ship.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>Ready to ship</CardTitle>
                <p className="text-sm text-gray-500">10 / 10 tests passed.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Your placement readiness platform has passed all verification tests. 
              Complete proof and artifact links to reach Shipped status.
            </p>
            <Link
              to="/prp/proof"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
            >
              Open Proof & Submission
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
