/**
 * localStorage persistence for analysis history.
 * Offline, no external APIs.
 */

const KEY = 'placement_prep_history'
const LAST_ID_KEY = 'placement_prep_last_id'

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function saveAnalysis(entry) {
  const list = getHistory()
  const id = entry.id || genId()
  const record = {
    id,
    createdAt: entry.createdAt ?? new Date().toISOString(),
    company: entry.company ?? '',
    role: entry.role ?? '',
    jdText: entry.jdText ?? '',
    extractedSkills: entry.extractedSkills ?? {},
    plan: entry.plan ?? {},
    checklist: entry.checklist ?? {},
    questions: entry.questions ?? [],
    readinessScore: entry.readinessScore ?? 0,
  }
  const updated = [record, ...list.filter((e) => e.id !== id)]
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
    localStorage.setItem(LAST_ID_KEY, id)
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
  return record
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function getAnalysisById(id) {
  const list = getHistory()
  return list.find((e) => e.id === id) ?? null
}

export function getLastAnalysisId() {
  try {
    return localStorage.getItem(LAST_ID_KEY)
  } catch {
    return null
  }
}
