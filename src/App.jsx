import { AppLayout } from './components/layout/AppLayout'

function App() {
  return (
    <AppLayout
      projectName="Project Name"
      step={1}
      totalSteps={5}
      status="In Progress"
      headline="Context headline"
      subtext="One-line subtext describing purpose."
      stepExplanation="Short step explanation for the secondary panel."
      promptText="Copyable prompt content for the step."
    />
  )
}

export default App
