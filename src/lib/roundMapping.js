/**
 * Round Mapping Engine — dynamic round flow based on company size + skills.
 * No external APIs. Demo mode.
 */

const ROUND_MAPPINGS = {
  enterprise_dsa: [
    { name: 'Round 1: Online Test', desc: 'DSA + Aptitude', why: 'Filters candidates on fundamentals before technical interview.' },
    { name: 'Round 2: Technical', desc: 'DSA + Core CS', why: 'Deep dive into algorithms, data structures, and CS fundamentals.' },
    { name: 'Round 3: Tech + Projects', desc: 'Coding + System Design', why: 'Validates implementation skills and project experience.' },
    { name: 'Round 4: HR', desc: 'Behavioral + Culture', why: 'Assesses fit and communication for final hiring decision.' },
  ],
  enterprise_general: [
    { name: 'Round 1: Aptitude', desc: 'Quantitative + Verbal', why: 'Initial screening on logical and reasoning ability.' },
    { name: 'Round 2: Technical', desc: 'Core CS + Coding', why: 'Tests technical knowledge and problem-solving.' },
    { name: 'Round 3: Projects', desc: 'Project Deep-dive', why: 'Validates hands-on experience and ownership.' },
    { name: 'Round 4: HR', desc: 'Behavioral', why: 'Final culture and communication fit.' },
  ],
  startup_fullstack: [
    { name: 'Round 1: Practical Coding', desc: 'Live / Take-home', why: 'Evaluates real coding ability quickly.' },
    { name: 'Round 2: System Discussion', desc: 'Architecture + Stack', why: 'Assesses design thinking and tech depth.' },
    { name: 'Round 3: Culture Fit', desc: 'Founder / Team', why: 'Ensures alignment with team and mission.' },
  ],
  startup_frontend: [
    { name: 'Round 1: Coding', desc: 'Frontend + JS/TS', why: 'Tests framework and JS fundamentals.' },
    { name: 'Round 2: Project Walkthrough', desc: 'Portfolio + Stack', why: 'Validates project experience and depth.' },
    { name: 'Round 3: Culture Fit', desc: 'Team Discussion', why: 'Assesses collaboration and values fit.' },
  ],
  startup_backend: [
    { name: 'Round 1: Practical Coding', desc: 'APIs + Logic', why: 'Tests backend and data handling skills.' },
    { name: 'Round 2: System Design', desc: 'DB + Architecture', why: 'Evaluates scalability and design thinking.' },
    { name: 'Round 3: Culture Fit', desc: 'Team Discussion', why: 'Final fit and communication check.' },
  ],
  mid_size: [
    { name: 'Round 1: Online / Take-home', desc: 'Coding + Aptitude', why: 'Initial filter on technical ability.' },
    { name: 'Round 2: Technical', desc: 'DSA + Stack', why: 'Deeper technical validation.' },
    { name: 'Round 3: Projects + HR', desc: 'Hybrid', why: 'Combines experience and fit in one round.' },
  ],
}

function flatSkills(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') return []
  return Object.values(extractedSkills).flat()
}

function hasSkill(skills, ...names) {
  const lower = skills.map((s) => String(s).toLowerCase())
  return names.some((n) => lower.some((s) => s.includes(n.toLowerCase())))
}

export function generateRoundMapping(companySize, extractedSkills) {
  const skills = flatSkills(extractedSkills)
  const hasDSA = hasSkill(skills, 'DSA', 'Data Structures', 'Algorithms')
  const hasReact = hasSkill(skills, 'React', 'Next.js', 'Vue', 'Angular')
  const hasNode = hasSkill(skills, 'Node', 'Node.js', 'Express')
  const hasBackend = hasSkill(skills, 'Node', 'Express', 'Python', 'Java', 'Go', 'SQL')
  const isFullstack = hasReact && hasNode
  const isFrontend = hasReact && !hasNode
  const isBackend = hasBackend && !hasReact

  if (companySize === 'Enterprise') {
    return hasDSA ? ROUND_MAPPINGS.enterprise_dsa : ROUND_MAPPINGS.enterprise_general
  }

  if (companySize === 'Mid-size') {
    return ROUND_MAPPINGS.mid_size
  }

  if (companySize === 'Startup') {
    if (isFullstack) return ROUND_MAPPINGS.startup_fullstack
    if (isFrontend) return ROUND_MAPPINGS.startup_frontend
    if (isBackend) return ROUND_MAPPINGS.startup_backend
    return ROUND_MAPPINGS.startup_fullstack
  }

  return ROUND_MAPPINGS.startup_fullstack
}
