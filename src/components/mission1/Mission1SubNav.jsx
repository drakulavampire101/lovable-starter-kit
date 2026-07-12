import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-1', end: true, label: 'Overview' },
  { to: '/mission-1/submit', label: 'Submit' },
  { to: '/mission-1/history', label: 'History' },
];

export default function Mission1SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 1 sections" />;
}
