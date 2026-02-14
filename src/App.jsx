import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { DashboardLayout } from './pages/dashboard/DashboardLayout'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AnalyzePage } from './pages/dashboard/AnalyzePage'
import { ResultsPage } from './pages/dashboard/ResultsPage'
import { HistoryPage } from './pages/dashboard/HistoryPage'
import { PracticePage } from './pages/dashboard/PracticePage'
import { AssessmentsPage } from './pages/dashboard/AssessmentsPage'
import { ResourcesPage } from './pages/dashboard/ResourcesPage'
import { ProfilePage } from './pages/dashboard/ProfilePage'
import { TestChecklistPage } from './pages/prp/TestChecklistPage'
import { ShipPage } from './pages/prp/ShipPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/prp/07-test" element={<TestChecklistPage />} />
        <Route path="/prp/08-ship" element={<ShipPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
