export const ENTRY_VOLUME = [
  { day: 'Sun', employees: 38, visitors: 18, outsource: 9,  unidentified: 4 },
  { day: 'Mon', employees: 82, visitors: 55, outsource: 28, unidentified: 12 },
  { day: 'Tue', employees: 71, visitors: 48, outsource: 21, unidentified: 9  },
  { day: 'Wed', employees: 91, visitors: 67, outsource: 38, unidentified: 18 },
  { day: 'Thu', employees: 63, visitors: 44, outsource: 24, unidentified: 11 },
  { day: 'Fri', employees: 54, visitors: 33, outsource: 16, unidentified: 7  },
  { day: 'Sat', employees: 31, visitors: 24, outsource: 11, unidentified: 3  },
]

export const RECENT_ACTIVITY = [
  { id: 1, name: 'Nour Hassan',      confidence: 94, result: 'Entry Confirmed',      timeAgo: '1 min ago',  status: 'ok'   },
  { id: 2, name: 'Ahmed Mahmoud',    confidence: 38, result: 'Entry Confirmed',      timeAgo: '3 min ago',  status: 'low'  },
  { id: 3, name: 'Unidentified',     confidence: 12, result: 'Flagged',              timeAgo: '5 min ago',  status: 'flag' },
  { id: 4, name: 'Ahmed Khalil',     confidence: 91, result: 'Exit Confirmed',       timeAgo: '6 min ago',  status: 'ok'   },
  { id: 5, name: 'Mikhail, Rafik',   confidence: 65, result: 'Re-entry without exit',timeAgo: '8 min ago',  status: 'warn' },
]

export const ACTIVE_ALERTS_DASH = [
  { id: 1, type: 'Unauthorized Access Attempt', location: 'Zone III – Main Entrance', time: 'Now',     severity: 'Critical', status: 'active'   },
  { id: 2, type: 'Unauthorized Access Attempt', location: 'Zone III – Main Entrance', time: 'Now',     severity: 'Critical', status: 'active'   },
  { id: 3, type: 'Tailgating Detected',          location: 'Loading Dock – West',      time: '10:24 AM', severity: 'Critical', status: 'active'   },
  { id: 4, type: 'Credential Expired',           location: 'Entry Door – Badge P8647', time: '9:01 AM',  severity: 'Warning',  status: 'resolved' },
  { id: 5, type: 'Tailgating Detected',          location: 'Loading Dock – West',      time: '10:20 AM', severity: 'Warning',  status: 'resolved' },
]
