import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card'

const TOPIC = 'Dynamic Programming'
const COMPLETED = 3
const TOTAL = 10
const PCT = (COMPLETED / TOTAL) * 100

export function ContinuePractice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium text-gray-900 mb-2">{TOPIC}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{COMPLETED}/{TOTAL} completed</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${PCT}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to="/dashboard/practice"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
        >
          Continue
        </Link>
      </CardFooter>
    </Card>
  )
}
