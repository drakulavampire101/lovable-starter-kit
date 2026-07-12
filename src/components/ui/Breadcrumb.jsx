import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} className="text-subtle" />}
          {it.to ? (
            <Link to={it.to} className="hover:text-fg transition-colors">{it.label}</Link>
          ) : (
            <span className="text-fg">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
