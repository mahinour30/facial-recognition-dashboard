export const alerts = [
  { id: 1, severity: 'Critical', type: 'Tailgating Detected', timestamp: 'Jun 19, 2026 09:14', location: '3rd, Reception / CAM-03', user: null, userType: null, status: 'Active' },
  { id: 2, severity: 'Critical', type: 'Unauthorized Access', timestamp: 'Jun 19, 2026 08:32', location: 'Server Room / CAM-07', user: null, userType: null, status: 'Active' },
  { id: 3, severity: 'Very Critical', type: 'Spoofing Attempt', timestamp: 'Jun 19, 2026 08:47', location: 'Lobby / CAM-02', user: 'Farouk...', userType: 'Employee', status: 'In Progress' },
  { id: 4, severity: 'Warning', type: 'Unusual Access Hours', timestamp: 'Jun 18, 2026 17:40', location: '2nd, Reception / CAM-...', user: 'Ali, Hana', userType: 'Visitor', status: 'Resolved' },
  { id: 5, severity: 'Info', type: 'Unusual Access Hours', timestamp: 'Jun 18, 2026 17:40', location: '2nd, Reception / CAM-...', user: 'Mahmo...', userType: 'Outsource', status: 'Resolved' },
  { id: 6, severity: 'Critical', type: 'Identity Mismatch', timestamp: 'Jun 18, 2026 17:40', location: '3rd, Reception / CAM-03', user: null, userType: null, status: 'Resolved' },
  { id: 7, severity: 'Critical', type: 'Camera Tamper', timestamp: 'Jun 18, 2026 17:40', location: '3rd, Reception / CAM-03', user: null, userType: null, status: 'Resolved' },
  { id: 8, severity: 'Critical', type: 'Tailgating Detected', timestamp: 'Jun 18, 2026 17:40', location: '2nd, Reception / CAM-...', user: null, userType: null, status: 'Resolved' },
  { id: 9, severity: 'Info', type: 'Tailgating Detected', timestamp: 'Jun 18, 2026 17:40', location: 'Server Room / CAM-07', user: null, userType: null, status: 'Resolved' },
];

export const accessLogs = [
  { id: 1, timestamp: 'Jun 19, 2026 09:14', location: '3rd, Reception / CAM-03', user: 'Nour Hassan', type: 'Employee', confidence: 78.3, result: 'Entry Confirmed' },
  { id: 2, timestamp: 'Jun 19, 2026 09:02', location: 'Server Room / CAM-07', user: 'Ahmed Mahmoud', type: 'Outsource', confidence: 82.1, result: 'Entry Confirmed' },
  { id: 3, timestamp: 'Jun 19, 2026 00:47', location: 'Lobby / CAM-02', user: 'Unidentified', type: '-', confidence: 40, result: 'Flagged' },
  { id: 4, timestamp: 'Jun 18, 2026 08:31', location: '2nd, Reception / CAM-...', user: 'Ahmed Khalil', type: 'Visitor', confidence: 88.7, result: 'Exit Confirmed' },
  { id: 5, timestamp: 'Jun 18, 2026 17:40', location: '2nd, Reception / CAM-...', user: 'Farouk, Sameh', type: 'Outsource', confidence: 65.9, result: 'Entry Confirmed' },
  { id: 6, timestamp: 'Jun 18, 2026 17:40', location: '3rd, Reception / CAM-...', user: 'Hammam, Mahmour', type: 'Employee', confidence: 91.2, result: 'Entry Confirmed' },
  { id: 7, timestamp: 'Jun 18, 2026 17:40', location: '2nd, Reception / CAM-...', user: 'Mikhail, Rafik', type: 'Employee', confidence: 69.8, result: 'Re-exit without entry' },
  { id: 8, timestamp: 'Jun 18, 2026 17:40', location: '2nd, Reception / CAM-...', user: 'Ahmed, Ashrafat', type: 'Employee', confidence: 93.5, result: 'Entry Confirmed' },
  { id: 9, timestamp: 'Jun 18, 2026 17:40', location: 'Server Room / CAM-07', user: 'Youssef, Shaker', type: 'Employee', confidence: 94.2, result: 'Exit Confirmed' },
];

export const people = [
  { id: 1, name: 'Ashraf, Salma', type: 'Employee', employeeId: '20230594', offering: 'Customer', consent: 'Pending', state: 'Not Enrolled' },
  { id: 2, name: 'John, Samy', type: 'Employee', employeeId: '20230598', offering: 'Customer', consent: 'Pending', state: 'Consent Requested' },
  { id: 3, name: 'Salem, Sandra', type: 'Employee', employeeId: '20230902', offering: 'Customer', consent: 'Consented', state: 'Ready to enroll' },
  { id: 4, name: 'Ashraf, Peter', type: 'Employee', employeeId: '20230603', offering: 'Engineering', consent: 'Consented', state: 'Awaiting Capture' },
  { id: 5, name: 'Hammam, Mahmour', type: 'Employee', employeeId: '20230903', offering: 'Cyber Security', consent: 'Consented', state: 'Enrolled / Active' },
  { id: 6, name: 'Mikhail, Rafik', type: 'Employee', employeeId: '20230605', offering: 'Customer', consent: 'Consented', state: 'Pending re-enrollment' },
  { id: 7, name: 'Ashraf, Ashrafat', type: 'Employee', employeeId: '20230605', offering: 'Engineering', consent: 'Declined', state: 'Deletion requested' },
  { id: 8, name: 'Youssef, Shaker', type: 'Employee', employeeId: '20230605', offering: 'AI & Data', consent: '-', state: 'Consent Requested' },
  { id: 9, name: 'Ali, Hassan', type: 'Visitor + Bank', employeeId: '-', offering: '-', consent: 'Consented', state: 'Enrolled / Active' },
  { id: 10, name: 'Sam, Gambel', type: 'Visitor - Client', employeeId: '-', offering: '-', consent: 'Pending', state: 'Consent Requested' },
  { id: 11, name: 'John, Rosie', type: 'Visitor - Client', employeeId: '-', offering: '-', consent: 'Consented', state: 'Enrolled / Active' },
  { id: 12, name: 'Omar, Saeed', type: 'Outsource', employeeId: '-', offering: '-', consent: 'Declined', state: 'Expired' },
  { id: 13, name: 'Maya, Khalil', type: 'Outsource', employeeId: '-', offering: '-', consent: 'Declined', state: 'Not Enrolled' },
];

export const entryVolumeData = [
  { day: 'Sun', employees: 40, visitors: 20, outsource: 10, underTest: 5 },
  { day: 'Mon', employees: 80, visitors: 60, outsource: 30, underTest: 15 },
  { day: 'Tue', employees: 70, visitors: 50, outsource: 20, underTest: 10 },
  { day: 'Wed', employees: 90, visitors: 70, outsource: 40, underTest: 20 },
  { day: 'Thu', employees: 60, visitors: 45, outsource: 25, underTest: 12 },
  { day: 'Fri', employees: 50, visitors: 35, outsource: 15, underTest: 8 },
  { day: 'Sat', employees: 30, visitors: 25, outsource: 10, underTest: 5 },
];

export const recentActivity = [
  { id: 1, name: 'Nour Hassan', confidence: 94, event: 'Entry Confirmed', time: '1 min ago', status: 'confirmed' },
  { id: 2, name: 'Ahmed Mahmoud', confidence: 38, event: 'Entry Confirmed', time: '3 min ago', status: 'warning' },
  { id: 3, name: 'Unidentified', confidence: 12, event: 'Entry Confirmed', time: '5 min ago', status: 'error' },
  { id: 4, name: 'Ahmed Khalil', confidence: 90, event: 'Exit Confirmed', time: '6 min ago', status: 'confirmed' },
  { id: 5, name: 'Unnamed', confidence: 65, event: 'Re-entry without exit', time: '4 min ago', status: 'flagged' },
];

export const activeAlerts = [
  { id: 1, type: 'Unauthorized Access Attempt', location: 'Zone III - Main Entrance', time: 'Now AM', status: 'active' },
  { id: 2, type: 'Unauthorized Access Attempt', location: 'Zone III - Main Entrance', time: 'Now AM', status: 'active' },
  { id: 3, type: 'Tailgating Detected', location: 'Loading Dock - West', time: '10:24 AM', status: 'active' },
  { id: 4, type: 'Credential Expired', location: 'Entry Door - Badge P8647', time: '9:01 AM', status: 'resolved' },
  { id: 5, type: 'Tailgating Detected', location: 'Loading Dock - West', time: '10:20 AM', status: 'resolved' },
  { id: 6, type: 'Tailgating Detected', location: 'Loading Dock - West', time: '10:20 AM', status: 'resolved' },
];
