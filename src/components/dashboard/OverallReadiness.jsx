import { Card, CardContent } from '../ui/card'

const SIZE = 160
const STROKE = 12
const R = (SIZE - STROKE) / 2
const CX = SIZE / 2
const CY = SIZE / 2
const CIRCUMFERENCE = 2 * Math.PI * R

export function OverallReadiness({ score = 72, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100))
  const dashOffset = CIRCUMFERENCE * (1 - pct / 100)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="relative inline-flex" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                className="text-gray-200"
              />
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
                className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{score}</span>
              <span className="text-xs font-medium text-gray-500">Readiness Score</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
