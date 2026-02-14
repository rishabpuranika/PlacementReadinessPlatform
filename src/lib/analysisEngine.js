/**
 * Generate checklist, 7-day plan, questions, and readiness score from JD analysis.
 * No external APIs. Offline.
 */

import { extractSkills } from './skillExtractor'

const ROUND_TEMPLATES = {
  'Round 1: Aptitude / Basics': [
    'Review quantitative aptitude (percentage, profit/loss)',
    'Brush up verbal reasoning and logical puzzles',
    'Practice time-and-work, speed-distance problems',
    'Revise basic computer fundamentals',
    'Prepare for psychometric/behavioral assessments',
    'Practice numerical reasoning under time pressure',
    'Review general awareness and current affairs',
  ],
  'Round 2: DSA + Core CS': [
    'Revise arrays, strings, hash maps',
    'Practice trees, graphs, dynamic programming',
    'Review sorting, searching, recursion',
    'Revise core CS: OS, DBMS, Networks',
    'Practice time/space complexity analysis',
    'Solve 3–5 medium LeetCode problems daily',
    'Prepare for system design basics (if applicable)',
  ],
  'Round 3: Tech Interview (Projects + Stack)': [
    'Prepare project deep-dives (architecture, trade-offs)',
    'Revise tech stack used in projects',
    'Practice live coding and debugging',
    'Prepare for behavioral STAR stories',
    'Review design patterns and best practices',
    'Prepare for API/system design questions',
    'Know your resume line-by-line',
  ],
  'Round 4: Managerial / HR': [
    'Prepare self-introduction (1–2 min)',
    'Prepare “Why this company?” and “Why you?”',
    'STAR stories: conflict, leadership, failure',
    'Salary expectations and negotiation basics',
    'Questions to ask the interviewer',
    'Review company values and culture',
    'Dress and punctuality checklist',
  ],
}

const DAY_PLANS = {
  1: { focus: 'Basics + core CS', items: ['Quantitative aptitude basics', 'Logical reasoning', 'Core CS: OS, DBMS fundamentals'] },
  2: { focus: 'Basics + core CS', items: ['Verbal reasoning', 'Computer fundamentals', 'Networks basics'] },
  3: { focus: 'DSA + coding', items: ['Arrays, strings, hashmaps', 'Sorting and searching', '3 medium problems'] },
  4: { focus: 'DSA + coding', items: ['Trees and graphs', 'DP and recursion', '4 medium problems'] },
  5: { focus: 'Project + resume', items: ['Project deep-dive prep', 'Resume alignment with JD', 'Stack revision'] },
  6: { focus: 'Mock interview', items: ['Mock tech questions', 'Mock HR questions', 'Time-boxed practice'] },
  7: { focus: 'Revision + weak', items: ['Revision of weak topics', 'Quick DSA brush-up', 'Relax and prepare mindset'] },
}

const QUESTION_GENERATORS = {
  SQL: [
    'Explain indexing and when it helps.',
    'What is the difference between INNER JOIN and LEFT JOIN?',
    'How would you optimize a slow query?',
  ],
  React: [
    'Explain state management options (useState vs Context vs Redux).',
    'What is the virtual DOM and how does reconciliation work?',
    'When would you use useMemo vs useCallback?',
  ],
  DSA: [
    'How would you optimize search in sorted data?',
    'Explain time complexity of quicksort (best, worst, average).',
    'How would you detect a cycle in a linked list?',
  ],
  Java: [
    'Explain the difference between HashMap and HashTable.',
    'What is the JVM and how does garbage collection work?',
    'Explain polymorphism with an example.',
  ],
  Python: [
    'Explain list vs tuple vs set. When to use each?',
    'What are decorators and give an example.',
    'Explain the GIL and its implications.',
  ],
  JavaScript: [
    'Explain event loop and async/await.',
    'What is closure? Give a practical example.',
    'Explain prototypal inheritance.',
  ],
  'System Design': [
    'How would you design a URL shortener?',
    'Explain scalability: horizontal vs vertical.',
    'What is caching and when to use it?',
  ],
  Docker: [
    'Explain Docker vs VMs. When to use which?',
    'What is a Dockerfile and best practices?',
    'Explain container orchestration basics.',
  ],
  AWS: [
    'Explain S3, EC2, Lambda use cases.',
    'How would you ensure high availability?',
    'What is auto-scaling and when to use it?',
  ],
  OOP: [
    'Explain SOLID principles with examples.',
    'Difference between abstraction and encapsulation.',
    'When would you use composition over inheritance?',
  ],
  DBMS: [
    'Explain ACID properties.',
    'What is normalization? When to denormalize?',
    'Explain CAP theorem.',
  ],
  Networks: [
    'Explain TCP vs UDP. When to use which?',
    'What happens when you type a URL in browser?',
    'Explain HTTP/1.1 vs HTTP/2.',
  ],
  General: [
    'Tell me about yourself.',
    'Describe a challenging project you worked on.',
    'How do you handle disagreements in a team?',
  ],
}

function mapSkillsToQuestionKeys(byCategory) {
  const keys = new Set()
  const skillToKey = {
    SQL: 'SQL', MongoDB: 'SQL', PostgreSQL: 'SQL', MySQL: 'SQL',
    React: 'React', 'Next.js': 'React',
    DSA: 'DSA', 'Data Structures': 'DSA', Algorithms: 'DSA',
    Java: 'Java', Python: 'Python', JavaScript: 'JavaScript',
    'System Design': 'System Design', AWS: 'AWS', Docker: 'Docker',
    OOP: 'OOP', DBMS: 'DBMS', Networks: 'Networks',
  }
  for (const skills of Object.values(byCategory)) {
    for (const s of skills) {
      const k = skillToKey[s] || (s.includes('Design') ? 'System Design' : null)
      if (k) keys.add(k)
    }
  }
  return Array.from(keys)
}

function generateQuestions(byCategory) {
  const keys = mapSkillsToQuestionKeys(byCategory || {})
  const questions = []
  const used = new Set()
  const onlyOther = !byCategory || (Object.keys(byCategory).length === 1 && (byCategory.other || byCategory['General fresher stack']))

  if (onlyOther) {
    return [
      'Tell me about yourself.',
      'Describe a challenging project you worked on.',
      'How do you handle disagreements in a team?',
      'What is your approach to problem-solving?',
      'Where do you see yourself in five years?',
      'Why do you want to join us?',
      'What are your strengths and weaknesses?',
      'Describe a time you learned something new quickly.',
      'How do you prioritize tasks under pressure?',
      'Do you have any questions for us?',
    ].slice(0, 10)
  }

  for (const key of keys) {
    const list = QUESTION_GENERATORS[key]
    if (list) {
      for (const q of list) {
        if (!used.has(q) && questions.length < 10) {
          questions.push(q)
          used.add(q)
        }
      }
    }
  }

  while (questions.length < 10 && QUESTION_GENERATORS.General) {
    for (const q of QUESTION_GENERATORS.General) {
      if (!used.has(q) && questions.length < 10) {
        questions.push(q)
        used.add(q)
      }
    }
    break
  }

  return questions.slice(0, 10)
}

function buildChecklist(byCategory) {
  const rounds = {}
  const cats = Object.keys(byCategory || {})
  const hasDSA = cats.some(c => c === 'Core CS') || byCategory?.['Core CS']?.some(s => /DSA|Data Structures|Algorithms/i.test(s))
  const hasWeb = !!byCategory?.Web?.length
  const onlyOther = cats.length === 1 && (cats[0] === 'other' || cats[0] === 'General fresher stack')
  const baseItemsByRound = onlyOther
    ? {
        'Round 1: Aptitude / Basics': ['Review quantitative aptitude', 'Verbal reasoning', 'Logical puzzles', 'Computer fundamentals'],
        'Round 2: Technical': ['Basic coding practice', 'Problem-solving patterns', 'Communication and clarity'],
        'Round 3: Projects': ['Prepare project stories', 'Resume alignment', 'Behavioral STAR format'],
        'Round 4: HR': ['Self-introduction', 'Why this company?', 'Questions to ask'],
      }
    : null

  const templates = baseItemsByRound || ROUND_TEMPLATES
  for (const [roundName, baseItems] of Object.entries(templates)) {
    let items = [...(baseItems || [])]
    if (!onlyOther) {
      if (roundName.includes('Round 2') && !hasDSA) {
        items = items.filter(i => !i.includes('DSA') && !i.includes('dynamic programming'))
      }
      if (roundName.includes('Round 3') && hasWeb) {
        items = ['Revise React/frontend concepts', 'Prepare frontend project deep-dive', ...items.slice(2)]
      }
    }
    rounds[roundName] = items.slice(0, 8)
  }
  return rounds
}

function buildSevenDayPlan(byCategory) {
  const plan = {}
  const cats = byCategory || {}
  const flatSkills = Object.values(cats).flat()
  const onlyOther = Object.keys(cats).length === 1 && (cats.other || cats['General fresher stack'])
  const hasReact = flatSkills.some(s => /react/i.test(String(s)))
  const hasDSA = cats['Core CS']?.some(s => /DSA/i.test(String(s))) ?? flatSkills.some(s => /DSA/i.test(String(s)))

  const dayPlansSource = onlyOther
    ? {
        1: { focus: 'Basics + communication', items: ['Quantitative basics', 'Logical reasoning', 'Communication clarity'] },
        2: { focus: 'Basics + fundamentals', items: ['Computer fundamentals', 'Problem-solving approach', 'Practice 2–3 simple problems'] },
        3: { focus: 'Coding practice', items: ['Basic coding patterns', 'Arrays and strings', '3 easy problems'] },
        4: { focus: 'Coding + logic', items: ['More coding practice', 'Debugging mindset', '4 easy–medium problems'] },
        5: { focus: 'Project + resume', items: ['Project stories', 'Resume alignment', 'STAR format prep'] },
        6: { focus: 'Mock + behavioral', items: ['Mock interview questions', 'Self-introduction', 'Why this role?'] },
        7: { focus: 'Revision + rest', items: ['Revision of weak areas', 'Relax and prepare mindset'] },
      }
    : DAY_PLANS

  for (let d = 1; d <= 7; d++) {
    const base = dayPlansSource[d]
    let items = base ? [...base.items] : []
    if (!onlyOther) {
      if (d === 5 && hasReact) {
        items = ['Frontend project deep-dive', 'React revision', 'Resume alignment with JD']
      }
      if (d === 3 && hasDSA) {
        items = ['Arrays, strings, hashmaps', 'Sorting and searching', '3 medium DSA problems']
      }
    }
    plan[`Day ${d}`] = { focus: base?.focus || 'General', items }
  }
  return plan
}

export function computeReadinessScore({ company, role, jdText, categoryCount }) {
  let score = 35
  score += Math.min(30, (categoryCount || 0) * 5)
  if (company?.trim()) score += 10
  if (role?.trim()) score += 10
  if (jdText?.length > 800) score += 10
  return Math.min(100, score)
}

export function runAnalysis({ company, role, jdText }) {
  const { byCategory, all, hasAny } = extractSkills(jdText || '')

  const extractedSkills = hasAny
    ? byCategory
    : { other: ['Communication', 'Problem solving', 'Basic coding', 'Projects'] }

  const categoryCount = Object.keys(extractedSkills).length

  const plan = buildSevenDayPlan(extractedSkills)
  const checklist = buildChecklist(extractedSkills)
  const questions = generateQuestions(extractedSkills)

  const readinessScore = computeReadinessScore({
    company,
    role,
    jdText,
    categoryCount,
  })

  return {
    extractedSkills,
    plan,
    checklist,
    questions,
    readinessScore,
  }
}
