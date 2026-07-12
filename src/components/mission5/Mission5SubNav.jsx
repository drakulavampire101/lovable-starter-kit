import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-5', end: true, label: 'SOS' },
  { to: '/mission-5/report', label: 'Report' },
  { to: '/mission-5/history', label: 'History' },
  { to: '/mission-5/captain', label: 'Captain' },
  { to: '/mission-5/map', label: 'Map' },
  { to: '/mission-5/analytics', label: 'Analytics' },
  { to: '/mission-5/notifications', label: 'Notifications' },
];

export default function Mission5SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 5 sections" />;
}
