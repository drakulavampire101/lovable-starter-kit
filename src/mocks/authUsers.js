// Mock authentication data — display-only, no real logic.
export const MOCK_USERS = {
  '220101': { name: 'John Doe', roll: '220101', roles: ['student'], batch: '2022', dept: 'CSE' },
  '220001': { name: 'Jane Smith', roll: '220001', roles: ['student', 'captain'], batch: '2022', dept: 'CSE' },
  T001: { name: 'Dr. Ahmed', roll: 'T001', roles: ['teacher'], batch: 'Faculty', dept: 'CSE' },
  O001: { name: 'Office Desk', roll: 'O001', roles: ['office'], batch: 'Faculty', dept: 'Admin' },
};

export const VALID_ROLLS = Object.keys(MOCK_USERS);

export const ROLE_META = {
  student: {
    label: 'Student',
    description: 'Submit complaints, rate peers, and access learning tools.',
    tone: 'brand',
    path: '/student',
  },
  captain: {
    label: 'Class Captain',
    description: 'Moderate reports, run SOS console, and coordinate the class.',
    tone: 'accent',
    path: '/captain',
  },
  teacher: {
    label: 'Teacher',
    description: 'Review complaints, run captain engine, and administer elections.',
    tone: 'warning',
    path: '/teacher',
  },
  office: {
    label: 'Office',
    description: 'Oversee moderation, view analytics, and manage records.',
    tone: 'danger',
    path: '/office',
  },
};
