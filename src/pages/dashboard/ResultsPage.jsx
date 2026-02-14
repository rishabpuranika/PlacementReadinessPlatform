import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { getAnalysisById, getLastAnalysisId, updateAnalysis } from '../../lib/storage'
import { ArrowLeft, Copy, Download } from 'lucide-react'

const CATEGORY_LABELS = { coreCS: 'Core CS', languages: 'Languages', web: 'Web', data: 'Data', cloud: 'Cloud/DevOps', testing: 'Testing', other: 'Other' }

function formatPlanText(planOrPlan7Days) {
  if (!planOrPlan7Days) return ''
  if (Array.isArray(planOrPlan7Days)) {
    return planOrPlan7Days
      .map(({ day, focus, tasks }) => {
        const lines = [`${day}: ${focus}`, ...(tasks || []).map((i) => `  • ${i}`)]
        return lines.join('\n')
      })
      .join('\n\n')
  }
  return Object.entries(planOrPlan7Days)
    .map(([day, v]) => {
      const focus = v?.focus ?? ''
      const items = v?.items ?? v?.tasks ?? []
      const lines = [`${day}: ${focus}`, ...items.map((i) => `  • ${i}`)]
      return lines.join('\n')
    })
    .join('\n\n')
}

function formatChecklistText(checklist) {
  if (!checklist) return ''
  if (Array.isArray(checklist)) {
    return checklist
      .map(({ roundTitle, items }) => {
        const lines = [roundTitle, ...(items || []).map((i) => `  • ${i}`)]
        return lines.join('\n')
      })
      .join('\n\n')
  }
  return Object.entries(checklist)
    .map(([round, items]) => {
      const lines = [round, ...(items || []).map((i) => `  • ${i}`)]
      return lines.join('\n')
    })
    .join('\n\n')
}

function formatQuestionsText(questions) {
  if (!questions?.length) return ''
  return questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
}

export function ResultsPage() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || getLastAnalysisId()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (id) setData(getAnalysisById(id))
    else setData(null)
  }, [id])

  const baseScore = data?.baseScore ?? data?.baseReadinessScore ?? data?.readinessScore ?? 0
  const extractedSkills = data?.extractedSkills ?? {}
  const skills = Object.entries(extractedSkills).flatMap(([cat, arr]) =>
    (Array.isArray(arr) ? arr : []).map((skill) => ({ category: CATEGORY_LABELS[cat] ?? cat, skill }))
  )
  const skillConfidenceMap = data?.skillConfidenceMap ?? {}
  const getConfidence = (skill) => skillConfidenceMap[skill] ?? 'practice'
  const knowCount = skills.filter((s) => getConfidence(s.skill) === 'know').length
  const practiceCount = skills.filter((s) => getConfidence(s.skill) === 'practice').length
  const liveScore = Math.min(100, Math.max(0, baseScore + 2 * knowCount - 2 * practiceCount))

  const toggleSkill = useCallback(
    (skill) => {
      if (!data?.id) return
      const next = getConfidence(skill) === 'know' ? 'practice' : 'know'
      const nextMap = { ...skillConfidenceMap, [skill]: next }
      const nextKnowCount = Object.values(nextMap).filter((v) => v === 'know').length
      const nextPracticeCount = skills.length - nextKnowCount
      const nextScore = Math.min(100, Math.max(0, baseScore + 2 * nextKnowCount - 2 * nextPracticeCount))
      const updated = updateAnalysis(data.id, {
        skillConfidenceMap: nextMap,
        finalScore: nextScore,
      })
      if (updated) setData(updated)
    },
    [data?.id, skillConfidenceMap, baseScore, skills.length]
  )


  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])

  const handleCopyPlan = useCallback(() => {
    copyToClipboard(formatPlanText(data?.plan7Days ?? data?.plan), '7-day plan')
  }, [data?.plan7Days, data?.plan, copyToClipboard])

  const handleCopyChecklist = useCallback(() => {
    copyToClipboard(formatChecklistText(data?.checklist), 'round checklist')
  }, [data?.checklist, copyToClipboard])

  const handleCopyQuestions = useCallback(() => {
    copyToClipboard(formatQuestionsText(data?.questions), '10 questions')
  }, [data?.questions, copyToClipboard])

  const handleDownloadTxt = useCallback(() => {
    const intelSection = data?.companyIntel
      ? [
        '',
        '--- Company Intel ---',
        `Company: ${data.companyIntel.companyName}`,
        `Industry: ${data.companyIntel.industry}`,
        `Size: ${data.companyIntel.sizeLabel}`,
        `Typical Focus: ${data.companyIntel.typicalFocus}`,
      ].join('\n')
      : ''
    const roundSection = data?.roundMapping?.length
      ? [
        '',
        '--- Round Mapping ---',
        ...data.roundMapping.map((r) => {
          const title = r.roundTitle ?? r.name ?? ''
          const areas = (r.focusAreas ?? (r.desc ? [r.desc] : [])).join(', ')
          const why = r.whyItMatters ?? r.why ?? ''
          return `${title}: ${areas}\n  Why: ${why}`
        }),
      ].join('\n')
      : ''
    const sections = [
      `Analysis: ${data?.company || '—'} · ${data?.role || '—'}`,
      `Readiness Score: ${liveScore}`,
      intelSection,
      roundSection,
      '',
      '--- Key Skills ---',
      skills.map((s) => `${s.category}: ${s.skill} (${getConfidence(s.skill)})`).join('\n'),
      '',
      '--- 7-Day Plan ---',
      formatPlanText(data?.plan7Days ?? data?.plan),
      '',
      '--- Round-wise Checklist ---',
      formatChecklistText(data?.checklist),
      '',
      '--- 10 Likely Interview Questions ---',
      formatQuestionsText(data?.questions),
    ]
    const blob = new Blob([sections.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `placement-prep-${data?.company || 'analysis'}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, liveScore, skills, getConfidence])

  const weakSkills = skills.filter((s) => getConfidence(s.skill) === 'practice').slice(0, 3).map((s) => s.skill)

  if (!data) {
    return (
      <div className="space-y-6">
        <Link to="/dashboard/analyze" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Analyze
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No analysis found. Run an analysis first.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to="/dashboard/analyze" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Analyze
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600 text-sm">
            {data.company && `${data.company}`}
            {data.role && ` · ${data.role}`}
            {data.createdAt && ` · ${new Date(data.createdAt).toLocaleDateString()}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{liveScore}</p>
          <p className="text-sm text-gray-500">Readiness Score</p>
        </div>
      </div>

      {/* Company Intel — only when company provided */}
      {data.company?.trim() && data.companyIntel && (
        <Card>
          <CardHeader>
            <CardTitle>Company Intel</CardTitle>
            <p className="text-sm text-gray-500">
              {data.companyIntel.companyName} · {data.companyIntel.industry}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Estimated size</p>
                <p className="text-sm font-medium text-gray-900">{data.companyIntel.sizeLabel}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Typical Hiring Focus</p>
                <p className="text-sm text-gray-700">{data.companyIntel.typicalFocus}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">Demo Mode: Company intel generated heuristically.</p>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping — timeline */}
      {data.roundMapping?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Round Mapping</CardTitle>
            <p className="text-sm text-gray-500">Expected interview flow based on company and skills</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {data.roundMapping.map((round, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {i < data.roundMapping.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-[20px] mt-1 bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-6">
                    <h3 className="font-semibold text-gray-900">{round.roundTitle ?? round.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {(round.focusAreas ?? (round.desc ? [round.desc] : [])).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      Why this round matters: {round.whyItMatters ?? round.why}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 italic mt-4">Demo Mode: Company intel generated heuristically.</p>
          </CardContent>
        </Card>
      )}

      {/* Key skills with toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
          <p className="text-sm text-gray-500">Click a skill to toggle &quot;I know this&quot; / &quot;Need practice&quot;</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map(({ category, skill }) => {
              const confidence = getConfidence(skill)
              const isKnow = confidence === 'know'
              return (
                <button
                  key={`${category}-${skill}`}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${isKnow
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    }`}
                  title={isKnow ? 'I know this (click to change)' : 'Need practice (click to change)'}
                >
                  {skill}
                  <span className="ml-1.5 text-xs opacity-80">
                    {isKnow ? '✓ know' : '○ practice'}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <p className="text-sm text-gray-500">Copy or download sections as plain text</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyPlan}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy 7-day plan
          </button>
          <button
            type="button"
            onClick={handleCopyChecklist}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy round checklist
          </button>
          <button
            type="button"
            onClick={handleCopyQuestions}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy 10 questions
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> Download as TXT
          </button>
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {(Array.isArray(data.checklist) ? data.checklist : Object.entries(data.checklist || {})).map((item, idx) => {
              const roundTitle = item.roundTitle ?? item[0]
              const items = item.items ?? item[1] ?? []
              return (
                <li key={idx}>
                  <h3 className="font-semibold text-gray-900 mb-2">{roundTitle}</h3>
                  <ul className="space-y-1">
                    {(Array.isArray(items) ? items : []).map((task) => (
                      <li key={task} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-primary mt-0.5">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(Array.isArray(data.plan7Days) ? data.plan7Days : Object.entries(data.plan ?? {})).map((item, idx) => {
              const day = item.day ?? item[0]
              const focus = item.focus ?? item[1]?.focus ?? ''
              const tasks = item.tasks ?? item[1]?.items ?? []
              return (
                <div key={idx}>
                  <h3 className="font-semibold text-gray-900 mb-1">{day}: {focus}</h3>
                  <ul className="space-y-1">
                    {(Array.isArray(tasks) ? tasks : []).map((task) => (
                      <li key={task} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-primary mt-0.5">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 10 likely questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {(data.questions || []).map((q) => (
              <li key={q} className="text-gray-700">
                {q}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/20 bg-primary-light/20">
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
          <p className="text-sm text-gray-600">Suggested next steps</p>
        </CardHeader>
        <CardContent>
          {weakSkills.length > 0 && (
            <p className="text-sm text-gray-700 mb-3">
              Top skills to practice: <strong>{weakSkills.join(', ')}</strong>
            </p>
          )}
          <p className="text-base font-medium text-gray-900">Start Day 1 plan now.</p>
        </CardContent>
      </Card>
    </div>
  )
}
