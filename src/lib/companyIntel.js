/**
 * Company Intel — heuristic inference from company name and JD text.
 * No external APIs. Demo mode.
 */

const ENTERPRISE_NAMES = [
  'amazon', 'microsoft', 'google', 'meta', 'apple', 'netflix',
  'infosys', 'tcs', 'wipro', 'cognizant', 'accenture', 'capgemini',
  'hcl', 'tech mahindra', 'oracle', 'ibm', 'sap', 'adobe',
  'salesforce', 'intel', 'nvidia', 'cisco', 'qualcomm', 'vmware',
]

const INDUSTRY_KEYWORDS = {
  'Fintech': ['finance', 'banking', 'payments', 'fintech', 'crypto', 'blockchain'],
  'Healthcare': ['healthcare', 'health', 'pharma', 'medical', 'hospital'],
  'E-commerce': ['ecommerce', 'e-commerce', 'retail', 'marketplace', 'shopping'],
  'EdTech': ['edtech', 'education', 'learning', 'edtech'],
  'Product / SaaS': ['saas', 'product', 'subscription', 'b2b', 'enterprise software'],
}

export function inferCompanyIntel(company, jdText = '') {
  const name = (company || '').trim()
  const text = ((company || '') + ' ' + (jdText || '')).toLowerCase()

  const industry = inferIndustry(text)
  const sizeCategory = inferSize(name, jdText)
  const typicalFocus = inferTypicalFocus(sizeCategory)

  const sizeLabel = sizeCategory === 'Enterprise' ? 'Enterprise (2000+)'
  : sizeCategory === 'Mid-size' ? 'Mid-size (200–2000)'
  : 'Startup (<200)'

return {
    companyName: name || '—',
    industry,
    sizeCategory,
    sizeLabel,
    typicalFocus,
  }
}

function inferIndustry(text) {
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) return industry
  }
  return 'Technology Services'
}

function inferSize(companyName, jdText) {
  const lower = (companyName || '').toLowerCase()
  const text = (jdText || '').toLowerCase()
  for (const name of ENTERPRISE_NAMES) {
    if (lower.includes(name)) return 'Enterprise'
  }
  if (/\b(mid-size|mid size|growth stage|series [abc]|200-2000)\b/.test(text)) {
    return 'Mid-size'
  }
  return 'Startup'
}

function inferTypicalFocus(sizeCategory) {
  if (sizeCategory === 'Enterprise') {
    return 'Structured DSA and core CS fundamentals. Strong emphasis on problem-solving patterns, system design basics, and behavioral interviews.'
  }
  if (sizeCategory === 'Mid-size') {
    return 'Mix of DSA, practical coding, and stack depth. Expect project deep-dives and culture fit discussions.'
  }
  return 'Practical problem solving and stack depth. Hands-on coding, real-world scenarios, and team fit matter more than formal rounds.'
}
