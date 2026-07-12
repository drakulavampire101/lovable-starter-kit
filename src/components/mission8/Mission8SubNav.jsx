import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-8', end: true, label: 'Dashboard' },
  { to: '/mission-8/rankings', label: 'Rankings' },
  { to: '/mission-8/leaderboard', label: 'Leaderboard' },
  { to: '/mission-8/compare', label: 'Compare' },
  { to: '/mission-8/review', label: 'Teacher Review' },
  { to: '/mission-8/history', label: 'History' },
  { to: '/mission-8/analytics', label: 'Analytics' },
];

export default function Mission8SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 8 sections" />;
}
