/**
 * localStorage persistence for PRP final submission (proof).
 */

const KEY = 'prp_final_submission'

const DEFAULT_STEPS = [false, false, false, false, false, false, false, false]

const DEFAULT = {
  steps: [...DEFAULT_STEPS],
  lovableLink: '',
  githubLink: '',
  deployedLink: '',
}

function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false
  const trimmed = str.trim()
  if (!trimmed) return false
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function getProofSubmission() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT, steps: [...DEFAULT_STEPS] }
    const parsed = JSON.parse(raw)
    const steps = Array.isArray(parsed.steps) && parsed.steps.length === 8
      ? parsed.steps.map((v) => Boolean(v))
      : [...DEFAULT_STEPS]
    return {
      steps,
      lovableLink: typeof parsed.lovableLink === 'string' ? parsed.lovableLink : '',
      githubLink: typeof parsed.githubLink === 'string' ? parsed.githubLink : '',
      deployedLink: typeof parsed.deployedLink === 'string' ? parsed.deployedLink : '',
    }
  } catch {
    return { ...DEFAULT, steps: [...DEFAULT_STEPS] }
  }
}

export function setProofSubmission(data) {
  try {
    const toSave = {
      steps: (data.steps ?? DEFAULT.steps).slice(0, 8).map(Boolean),
      lovableLink: typeof data.lovableLink === 'string' ? data.lovableLink : '',
      githubLink: typeof data.githubLink === 'string' ? data.githubLink : '',
      deployedLink: typeof data.deployedLink === 'string' ? data.deployedLink : '',
    }
    if (toSave.steps.length < 8) {
      toSave.steps = [...toSave.steps, ...Array(8 - toSave.steps.length).fill(false)]
    }
    localStorage.setItem(KEY, JSON.stringify(toSave))
    return toSave
  } catch (e) {
    console.warn('proof submission save failed:', e)
    return null
  }
}

export function validateUrl(str) {
  return isValidUrl(str)
}

export function areProofLinksComplete(proof) {
  const p = proof ?? getProofSubmission()
  return isValidUrl(p.lovableLink) && isValidUrl(p.githubLink) && isValidUrl(p.deployedLink)
}
