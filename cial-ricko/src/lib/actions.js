/**
 * Returns which actions are enabled for a given person.
 * All actions are always shown in the menu; disabled ones are greyed.
 * Rule source: §3.4 of the build spec.
 */
export function getActions(person) {
  const { state, consent, type } = person
  const isVisitor = type === 'Visitor'
  const isConsented = consent === 'Consented'
  const isDeletionRequested = state === 'Deletion requested'

  // Base: Edit + Delete + View always available (unless deletion requested blocks edit)
  const a = {
    enroll:         false,
    reenroll:       false,
    requestConsent: false,
    invite:         false,
    suspend:        false,   // always disabled in this build
    edit:           !isDeletionRequested,
    delete:         true,
    withdraw:       false,
    view:           true,
    enrollLabel:    'Enroll',
    deleteLabel:    'Delete / offboard',
  }

  if (isDeletionRequested) {
    // Only view + delete (cancel deletion)
    a.delete = true
    a.deleteLabel = 'Cancel deletion'
    return a
  }

  // Request consent: only when Not Sent or Pending (resend)
  if (consent === 'Not Sent' || consent === 'Pending') {
    a.requestConsent = true
  }

  // Invite: only Ready to enroll + must be Consented
  if (state === 'Ready to enroll' && isConsented) a.invite = true

  // Enroll/Capture: Ready to enroll, Awaiting Capture, Pending re-enrollment
  if (['Ready to enroll', 'Awaiting Capture', 'Pending re-enrollment'].includes(state) && isConsented) {
    a.enroll = true
    a.enrollLabel = state === 'Pending re-enrollment' ? 'Re-capture' : 'Enroll'
  }

  // Re-enrollment: Enrolled/Active, Pending re-enrollment, Expiring — NOT Visitor
  if (['Enrolled / Active', 'Pending re-enrollment', 'Expiring'].includes(state) && !isVisitor && isConsented) {
    a.reenroll = true
  }

  // Suspend: Enrolled/Active, NOT Visitor — disabled in this build
  if (state === 'Enrolled / Active' && !isVisitor) {
    a.suspend = true // shown but disabled
  }

  // Withdraw: whenever Consented
  if (isConsented) a.withdraw = true

  // Expired Visitor: only Edit (extend) + Delete
  if (state === 'Expired' && isVisitor) {
    return { ...a, enroll: false, reenroll: false, invite: false, requestConsent: false, withdraw: false, suspend: false }
  }

  // Declined: only request consent (resend) + edit + delete
  if (consent === 'Declined') {
    return { ...a, enroll: false, reenroll: false, invite: false, withdraw: false, suspend: false }
  }

  return a
}
