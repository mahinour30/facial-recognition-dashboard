export function stateBadge(state) {
  const map = {
    'Not Enrolled':          { bg: 'var(--tag-gray-bg)',   fg: 'var(--tag-gray-fg)' },
    'Consent Requested':     { bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)' },
    'Ready to enroll':       { bg: 'var(--tag-blue-bg)',   fg: 'var(--tag-blue-fg)' },
    'Awaiting Capture':      { bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)' },
    'Enrolled / Active':     { bg: 'var(--tag-green-bg)',  fg: 'var(--tag-green-fg)' },
    'Suspended':             { bg: 'var(--tag-gray-bg)',   fg: 'var(--tag-gray-fg)' },
    'Pending re-enrollment': { bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)' },
    'Expiring':              { bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)' },
    'Expired':               { bg: 'var(--tag-red-bg)',    fg: 'var(--tag-red-fg)' },
    'Deletion requested':    { bg: 'var(--tag-red-bg)',    fg: 'var(--tag-red-fg)' },
  }
  return map[state] || { bg: 'var(--tag-gray-bg)', fg: 'var(--tag-gray-fg)' }
}

export function consentDot(consent) {
  const map = {
    'Not Sent':  'var(--status-neutral)',
    'Pending':   'var(--status-warning)',
    'Consented': 'var(--status-success)',
    'Declined':  'var(--status-danger)',
    'Withdrawn': 'var(--status-neutral)',
  }
  return map[consent] || 'var(--status-neutral)'
}
