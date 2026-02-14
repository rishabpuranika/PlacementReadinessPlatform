import {
  OverallReadiness,
  SkillBreakdown,
  ContinuePractice,
  WeeklyGoals,
  UpcomingAssessments,
} from '../../components/dashboard'

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Your placement readiness at a glance.</p>
      </div>

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
