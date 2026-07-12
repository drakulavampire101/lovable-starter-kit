// Path-prefix access matrix per role. `*` = allow everything.
// Order does not matter — we check with startsWith.
export const COMMON = ['/profile', '/settings', '/notifications', '/team', '/analytics'];

export const ROLE_ACCESS = {
  student: [
    '/student',
    '/mission-1', '/mission-1/submit', '/mission-1/submitted', '/mission-1/history',
    '/mission-1/strikes', '/mission-1/evidence',
    '/mission-2',
    '/mission-3',

    '/mission-4/tiffin',
    '/mission-5', '/mission-5/report', '/mission-5/success', '/mission-5/history',
    '/mission-6',
    '/mission-7', '/mission-7/students', '/mission-7/rate', '/mission-7/leaderboard', '/mission-7/history',
    '/mission-9', '/mission-9/candidates', '/mission-9/compare', '/mission-9/ballot', '/mission-9/confirmation', '/mission-9/results',
    ...COMMON,
  ],
  captain: [
    '/captain',
    '/mission-1/captain', '/mission-1/history', '/mission-1/strikes',
    '/mission-2',
    '/mission-4',
    '/mission-5/captain', '/mission-5/map', '/mission-5/analytics', '/mission-5/notifications', '/mission-5/history', '/mission-5',
    '/mission-7/leaderboard', '/mission-7/analytics', '/mission-7/students',
    '/mission-8', '/mission-8/rankings', '/mission-8/leaderboard', '/mission-8/compare', '/mission-8/candidates', '/mission-8/analytics', '/mission-8/history',
    '/mission-9/results', '/mission-9/candidates',
    ...COMMON,
  ],
  office: ['*'],
};

export function canAccess(role, pathname) {
  const allow = ROLE_ACCESS[role] || ROLE_ACCESS.student;
  if (allow.includes('*')) return true;
  // exact `/` handled by home redirect
  return allow.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export const ROLE_HOME = {
  student: '/student',
  captain: '/captain',
  office: '/office',
  teacher: '/office',
};
