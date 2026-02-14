import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

const SOLVED = 12
const TARGET = 20
const PCT = (SOLVED / TARGET) * 100

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// Filled for days with activity (e.g. Mon–Thu have activity this week)
const ACTIVITY = [true, true, true, true, false, false, false]

export function WeeklyGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Problems Solved: {SOLVED}/{TARGET} this week</p>
          <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${PCT}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          {DAYS.map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  ACTIVITY[i]
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {day.slice(0, 1)}
              </div>
              <span className="text-xs text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
