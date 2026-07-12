import Badge from '../ui/Badge.jsx';
import { findStatus } from '../../mocks/data/mission4.js';

export default function StatusPill({ status }) {
  const s = findStatus(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
