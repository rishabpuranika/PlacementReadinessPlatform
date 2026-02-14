import { Link } from 'react-router-dom'
import {
  OverallReadiness,
  SkillBreakdown,
  ContinuePractice,
  WeeklyGoals,
  UpcomingAssessments,
} from '../../components/dashboard'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Search } from 'lucide-react'

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Your placement readiness at a glance.</p>
      </div>

      <Link to="/dashboard/analyze">
        <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer bg-primary-light/30">
          <CardContent className="py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analyze a JD</h3>
              <p className="text-sm text-gray-600">Paste a job description to get skills, checklist, and prep plan.</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallReadiness score={72} max={100} />
        <SkillBreakdown />
        <ContinuePractice />
        <WeeklyGoals />
        <div className="lg:col-span-2">
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  )
}
