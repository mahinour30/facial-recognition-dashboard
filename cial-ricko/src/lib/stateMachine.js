/** Apply an action to a person and return the state patch */
export function applyAction(person, action) {
  switch (action) {
    case 'requestConsent':
      return { consent: 'Pending', state: 'Consent Requested' }
    case 'invite':
      return { state: 'Awaiting Capture' }
    case 'enroll':
      return { consent: 'Consented', state: 'Enrolled / Active' }
    case 'reenroll':
      return { state: 'Pending re-enrollment' }
    case 'withdraw':
      return { consent: 'Withdrawn', state: 'Deletion requested' }
    case 'delete':
      return null // caller removes the record
    default:
      return {}
  }
}
