import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-2', end: true, label: 'Overview' },
  { to: '/mission-2/students', label: 'Students' },
  { to: '/mission-2/classroom', label: 'Classroom' },
  { to: '/mission-2/interactive', label: 'Interactive' },
  { to: '/mission-2/constraints', label: 'Constraints' },
  { to: '/mission-2/line-of-sight', label: 'Line of Sight' },
  { to: '/mission-2/plan', label: 'Generated Plan' },
  { to: '/mission-2/analytics', label: 'Analytics' },
];

export default function Mission2SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 2 sections" />;
}
