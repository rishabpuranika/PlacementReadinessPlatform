import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Video, BarChart3 } from 'lucide-react'
import { Toast } from '../components/Toast'

const features = [
  {
    title: 'Practice Problems',
    description: 'Sharpen your skills with curated problems and instant feedback.',
    icon: Code2,
  },
  {
    title: 'Mock Interviews',
    description: 'Simulate real interviews with timed sessions and video practice.',
    icon: Video,
  },
  {
    title: 'Track Progress',
    description: 'Monitor your growth with detailed analytics and milestones.',
    icon: BarChart3,
  },
]

const COMING_SOON = 'Coming soon'

export function LandingPage() {
  const [toastVisible, setToastVisible] = useState(false)
  const showComingSoon = useCallback((e) => {
    e.preventDefault()
    setToastVisible(true)
  }, [])
  const dismissToast = useCallback(() => setToastVisible(false), [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Ace Your Placement
        </h1>
        <p className="text-xl text-gray-600 max-w-xl mb-8">
          Practice, assess, and prepare for your dream job
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors duration-200"
        >
          Get Started
        </Link>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Placement Readiness Platform</span>
          <a href="#" onClick={showComingSoon} className="hover:text-primary hover:underline">
            Privacy Policy
          </a>
          <a href="#" onClick={showComingSoon} className="hover:text-primary hover:underline">
            Terms of Use
          </a>
          <a href="#" onClick={showComingSoon} className="hover:text-primary hover:underline">
            Contact
          </a>
        </div>
      </footer>
      <Toast message={COMING_SOON} visible={toastVisible} onDismiss={dismissToast} />
    </div>
  )
}
