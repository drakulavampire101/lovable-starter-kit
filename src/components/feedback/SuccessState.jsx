import { CheckCircle2 } from 'lucide-react';

export default function SuccessState({ title = 'All good', message = '', action }) {
  return (
    <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 size={18} />
      </div>
      <p className="text-sm font-medium text-success">{title}</p>
      {message && <p className="mt-1 text-xs text-success/80">{message}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
