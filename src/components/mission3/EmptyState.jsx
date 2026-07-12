import Card from '../common/Card.jsx';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center gap-3">
      <div className="h-12 w-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
        {icon || <Inbox size={20} />}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {description && <p className="text-xs text-muted mt-1 max-w-sm">{description}</p>}
      </div>
      {action}
    </Card>
  );
}
