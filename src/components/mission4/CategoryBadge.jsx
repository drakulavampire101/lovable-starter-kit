import Badge from '../ui/Badge.jsx';
import { findCategory } from '../../mocks/data/mission4.js';

export default function CategoryBadge({ category }) {
  const c = findCategory(category);
  return (
    <Badge tone={c.tone}>
      <span className="mr-1">{c.icon}</span>
      {c.label}
    </Badge>
  );
}
