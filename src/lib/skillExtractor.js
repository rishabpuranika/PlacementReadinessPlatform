/**
 * Skill extraction from JD text (heuristic, case-insensitive).
 * No external APIs. Offline.
 */

const CATEGORIES = {
  'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
  Languages: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'C', 'Go'],
  Web: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
  Data: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
  'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
  Testing: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest'],
}

// Order matters: longer tokens first (e.g. Next.js before Node)
const FLATTENED = Object.entries(CATEGORIES).flatMap(([cat, skills]) =>
  skills.map((s) => ({ category: cat, skill: s }))
)

export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { byCategory: {}, all: [], hasAny: false }
  }

  const lower = jdText.toLowerCase()
  const byCategory = {}
  const seen = new Set()

  for (const { category, skill } of FLATTENED) {
    let matched = false
    if (skill === 'C++') {
      matched = /c\+\+/i.test(lower)
    } else if (skill === 'C#') {
      matched = /c#/i.test(lower)
    } else {
      const pattern = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'gi')
      matched = pattern.test(lower)
    }
    if (matched) {
      if (!byCategory[category]) byCategory[category] = []
      const norm = normalizeSkill(skill)
      if (!seen.has(norm)) {
        seen.add(norm)
        byCategory[category].push(skill)
      }
    }
  }

  const all = Object.values(byCategory).flat()
  const hasAny = all.length > 0

  return { byCategory, all, hasAny }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeSkill(s) {
  return s.replace(/[.+#]/g, '').toLowerCase()
}

export function getSkillCategories() {
  return Object.keys(CATEGORIES)
}
