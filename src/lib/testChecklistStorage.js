/**
 * localStorage persistence for PRP test checklist.
 */

const KEY = 'prp_test_checklist'

const DEFAULT = [false, false, false, false, false, false, false, false, false, false]

export function getTestChecklist() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return [...DEFAULT]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== 10) return [...DEFAULT]
    return parsed.map((v) => Boolean(v))
  } catch {
    return [...DEFAULT]
  }
}

export function setTestChecklist(checked) {
  if (!Array.isArray(checked) || checked.length !== 10) return
  try {
    localStorage.setItem(KEY, JSON.stringify(checked))
  } catch (e) {
    console.warn('test checklist save failed:', e)
  }
}

export function updateTestChecklist(index, value) {
  const list = getTestChecklist()
  if (index < 0 || index >= 10) return list
  list[index] = Boolean(value)
  setTestChecklist(list)
  return list
}

export function resetTestChecklist() {
  setTestChecklist([...DEFAULT])
  return [...DEFAULT]
}

export function isTestChecklistComplete() {
  const list = getTestChecklist()
  return list.length === 10 && list.every(Boolean)
}
