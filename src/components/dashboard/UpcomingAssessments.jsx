import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Calendar } from 'lucide-react'

const ITEMS = [
  { title: 'DSA Mock Test', when: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', when: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', when: 'Friday, 11:00 AM' },
]

export function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {ITEMS.map(({ title, when }) => (
            <li key={title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{when}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
