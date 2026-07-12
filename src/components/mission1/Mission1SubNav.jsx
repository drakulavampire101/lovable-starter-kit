import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-1', end: true, label: 'Overview' },
  { to: '/mission-1/submit', label: 'Submit' },
  { to: '/mission-1/history', label: 'History' },
  { to: '/mission-1/strikes', label: 'Strikes' },
  { to: '/mission-1/evidence', label: 'Evidence' },
  { to: '/mission-1/captain', label: 'Captain' },
  { to: '/mission-1/moderation', label: 'Moderation' },
  { to: '/mission-1/analytics', label: 'Analytics' },
];

export default function Mission1SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 1 sections" />;
}
