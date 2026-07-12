// Mock authentication data — display-only, no real logic.
export const MOCK_USERS = {
  '220101': { name: 'John Doe', roll: '220101', roles: ['student'], batch: '2022', dept: 'CSE' },
  '220001': { name: 'Jane Smith', roll: '220001', roles: ['student', 'captain'], batch: '2022', dept: 'CSE' },
  T001: { name: 'Dr. Ahmed', roll: 'T001', roles: ['office'], batch: 'Faculty', dept: 'CSE' },
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
  office: {
    label: 'Office',
    description: 'Oversee moderation, view analytics, and manage elections.',
    tone: 'danger',
    path: '/office',
  },
  // Backwards-compat alias
  teacher: {
    label: 'Office',
    description: 'Oversee moderation, view analytics, and manage elections.',
    tone: 'danger',
    path: '/office',
  },
};
