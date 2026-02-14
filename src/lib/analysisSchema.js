/**
 * Canonical analysis entry schema. All saved entries normalized to this shape.
 */

const SKILL_KEYS = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other']
const LEGACY_SKILL_MAP = {
  'Core CS': 'coreCS',
  Languages: 'languages',
  Web: 'web',
  Data: 'data',
  'Cloud/DevOps': 'cloud',
  Testing: 'testing',
}

const DEFAULT_SKILLS = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: [],
}

const DEFAULT_OTHER_WHEN_EMPTY = ['Communication', 'Problem solving', 'Basic coding', 'Projects']

function ensureArray(x) {
  if (Array.isArray(x)) return x
  if (x == null) return []
  return [x]
}

function ensureObject(x) {
  if (x != null && typeof x === 'object' && !Array.isArray(x)) return x
  return {}
}

/** Normalize extractedSkills to canonical { coreCS, languages, web, data, cloud, testing, other } */
export function normalizeExtractedSkills(raw) {
  const out = { ...DEFAULT_SKILLS }
  if (!raw || typeof raw !== 'object') {
    out.other = [...DEFAULT_OTHER_WHEN_EMPTY]
    return out
  }
  const flat = Object.entries(raw).flatMap(([k, v]) => {
    const arr = ensureArray(v)
    const key = LEGACY_SKILL_MAP[k] || 'other'
    return arr.map((s) => ({ key, skill: s }))
  })
  if (flat.length === 0) {
    out.other = [...DEFAULT_OTHER_WHEN_EMPTY]
    return out
  }
  for (const { key, skill } of flat) {
    if (SKILL_KEYS.includes(key) && !out[key].includes(skill)) {
      out[key].push(skill)
    }
  }
  if (flat.length > 0 && out.other.length === 0 && raw.other) {
    out.other = ensureArray(raw.other)
  }
  if (Object.values(out).every((arr) => arr.length === 0)) {
    out.other = [...DEFAULT_OTHER_WHEN_EMPTY]
  }
  return out
}

/** Normalize roundMapping to [{ roundTitle, focusAreas[], whyItMatters }] */
export function normalizeRoundMapping(raw) {
  const arr = ensureArray(raw)
  return arr.map((r) => {
    if (r && typeof r === 'object') {
      const title = r.roundTitle ?? r.name ?? ''
      const areas = Array.isArray(r.focusAreas) ? r.focusAreas : (r.desc ? [r.desc] : [])
      const why = r.whyItMatters ?? r.why ?? ''
      return { roundTitle: title, focusAreas: areas, whyItMatters: why }
    }
    return { roundTitle: '', focusAreas: [], whyItMatters: '' }
  })
}

/** Normalize checklist to [{ roundTitle, items[] }] */
export function normalizeChecklist(raw) {
  if (Array.isArray(raw)) {
    return raw.map((c) => ({
      roundTitle: c?.roundTitle ?? '',
      items: ensureArray(c?.items),
    }))
  }
  const obj = ensureObject(raw)
  return Object.entries(obj).map(([roundTitle, items]) => ({
    roundTitle,
    items: ensureArray(items),
  }))
}

/** Normalize plan to plan7Days: [{ day, focus, tasks[] }] */
export function normalizePlan7Days(raw) {
  if (Array.isArray(raw)) {
    return raw.map((p) => ({
      day: p?.day ?? '',
      focus: p?.focus ?? '',
      tasks: ensureArray(p?.tasks ?? p?.items),
    }))
  }
  const obj = ensureObject(raw)
  return Object.entries(obj).map(([day, v]) => ({
    day,
    focus: v?.focus ?? '',
    tasks: ensureArray(v?.items ?? v?.tasks),
  }))
}

/** Full entry normalization for save/read */
export function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') return null
  const id = entry.id ?? ''
  const createdAt = entry.createdAt ?? new Date().toISOString()
  const updatedAt = entry.updatedAt ?? createdAt
  const company = typeof entry.company === 'string' ? entry.company : ''
  const role = typeof entry.role === 'string' ? entry.role : ''
  const jdText = typeof entry.jdText === 'string' ? entry.jdText : ''
  const extractedSkills = normalizeExtractedSkills(entry.extractedSkills)
  const roundMapping = normalizeRoundMapping(entry.roundMapping)
  const checklist = normalizeChecklist(entry.checklist)
  const plan7Days = normalizePlan7Days(entry.plan7Days ?? entry.plan)
  const questions = ensureArray(entry.questions)
  const baseScore = typeof entry.baseScore === 'number' ? Math.max(0, Math.min(100, entry.baseScore)) : (typeof entry.baseReadinessScore === 'number' ? Math.max(0, Math.min(100, entry.baseReadinessScore)) : 0)
  const skillConfidenceMap = ensureObject(entry.skillConfidenceMap)
  const finalScore = typeof entry.finalScore === 'number' ? Math.max(0, Math.min(100, entry.finalScore)) : (typeof entry.readinessScore === 'number' ? Math.max(0, Math.min(100, entry.readinessScore)) : baseScore)

  return {
    id,
    createdAt,
    company,
    role,
    jdText,
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt,
    companyIntel: entry.companyIntel ?? null,
  }
}

/** Validate entry for loading; returns true if entry is usable */
export function validateEntry(entry) {
  try {
    if (!entry || typeof entry !== 'object') return false
    if (typeof entry.id !== 'string' || !entry.id) return false
    if (typeof entry.jdText !== 'string') return false
    return true
  } catch {
    return false
  }
}
