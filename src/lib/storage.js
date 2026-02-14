/**
 * localStorage persistence for analysis history.
 * All entries normalized to canonical schema. Corrupted entries skipped.
 */

import { normalizeEntry, validateEntry } from './analysisSchema'

const KEY = 'placement_prep_history'
const LAST_ID_KEY = 'placement_prep_last_id'

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function getRawHistory() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/** Returns { entries: normalized[], skippedCount } */
export function getHistory() {
  const raw = getRawHistory()
  const entries = []
  let skippedCount = 0
  for (const entry of raw) {
    if (!validateEntry(entry)) {
      skippedCount += 1
      continue
    }
    const normalized = normalizeEntry(entry)
    if (normalized) entries.push(normalized)
    else skippedCount += 1
  }
  return { entries, skippedCount }
}

export function saveAnalysis(entry) {
  const { entries } = getHistory()
  const id = entry.id || genId()
  const now = new Date().toISOString()
  const baseScore = typeof entry.baseScore === 'number' ? entry.baseScore : (entry.baseReadinessScore ?? entry.readinessScore ?? 0)
  const toSave = normalizeEntry({
    ...entry,
    id,
    createdAt: entry.createdAt ?? now,
    updatedAt: now,
    baseScore,
    finalScore: baseScore,
    baseReadinessScore: baseScore,
    readinessScore: baseScore,
  })
  if (!toSave) return null
  const updated = [toSave, ...entries.filter((e) => e.id !== id)]
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
    localStorage.setItem(LAST_ID_KEY, id)
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
  return toSave
}

export function getAnalysisById(id) {
  const { entries } = getHistory()
  const found = entries.find((e) => e.id === id)
  return found ?? null
}

export function getLastAnalysisId() {
  try {
    return localStorage.getItem(LAST_ID_KEY)
  } catch {
    return null
  }
}

/** Only skillConfidenceMap, finalScore, updatedAt are updated. baseScore never changed. */
export function updateAnalysis(id, updates) {
  const { entries } = getHistory()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return null
  const now = new Date().toISOString()
  const allowed = {
    skillConfidenceMap: updates.skillConfidenceMap,
    finalScore: updates.finalScore ?? updates.readinessScore,
    updatedAt: now,
  }
  const merged = { ...entries[idx], ...allowed }
  if (merged.finalScore != null) merged.finalScore = Math.max(0, Math.min(100, merged.finalScore))
  const updated = [...entries]
  updated[idx] = merged
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch (e) {
    console.warn('localStorage update failed:', e)
    return null
  }
  return merged
}
