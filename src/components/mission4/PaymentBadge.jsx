import Badge from '../ui/Badge.jsx';
import { findPayment } from '../../mocks/data/mission4.js';

export default function PaymentBadge({ method }) {
  const p = findPayment(method);
  return (
    <Badge tone="neutral">
      <span className="mr-1">{p.icon}</span>
      {p.label}
    </Badge>
  );
}
