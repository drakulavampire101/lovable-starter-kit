import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-3', end: true, label: 'Workspace' },
  { to: '/mission-3/input', label: 'New Analysis' },
  { to: '/mission-3/summary', label: 'Summary' },
  { to: '/mission-3/plan', label: 'Study Plan' },
  { to: '/mission-3/calendar', label: 'Calendar' },
  { to: '/mission-3/topics', label: 'Topics' },
  { to: '/mission-3/stats', label: 'Statistics' },
  { to: '/mission-3/history', label: 'History' },
];

export default function Mission3SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 3 sections" />;
}
