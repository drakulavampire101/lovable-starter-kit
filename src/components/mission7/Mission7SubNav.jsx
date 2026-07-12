import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-7', end: true, label: 'Dashboard' },
  { to: '/mission-7/students', label: 'Students' },
  { to: '/mission-7/rate', label: 'Rate' },
  { to: '/mission-7/comments', label: 'Comments' },
  { to: '/mission-7/leaderboard', label: 'Leaderboard' },
  { to: '/mission-7/history', label: 'My History' },
  { to: '/mission-7/analytics', label: 'Analytics' },
  { to: '/mission-7/moderation', label: 'Moderation' },
];

export default function Mission7SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 7 sections" />;
}
