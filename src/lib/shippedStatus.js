/**
 * Shipped status: only true when ALL conditions met.
 * Do NOT bypass checklist lock.
 */

import { isTestChecklistComplete } from './testChecklistStorage'
import { getProofSubmission, areProofLinksComplete } from './proofStorage'

export function isShipped() {
  const checklistComplete = isTestChecklistComplete()
  if (!checklistComplete) return false

  const proof = getProofSubmission()
  const allStepsComplete = proof.steps?.length === 8 && proof.steps.every(Boolean)
  if (!allStepsComplete) return false

  const linksComplete = areProofLinksComplete(proof)
  if (!linksComplete) return false

  return true
}
