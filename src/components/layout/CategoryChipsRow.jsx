import { NavLink } from 'react-router-dom';
import { cx } from '../../utils/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_BY_ROLE } from '../../routes/navigation.js';

// Mobile quick-nav: mirrors the sidebar for the current role so every
// destination is reachable without opening the drawer.
export default function CategoryChipsRow() {
  const { role } = useAuth();
  const navRole = role === 'teacher' ? 'office' : role;
  const NAV = NAV_BY_ROLE[navRole] || NAV_BY_ROLE.student;
  const items = NAV.flatMap((g) => g.items);

  return (
    <div className="border-b border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          aria-label="Quick navigation"
          className="flex gap-2 overflow-x-auto py-3 no-scrollbar"
        >
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cx(
                  'inline-flex items-center gap-2 rounded-full px-3.5 h-9 text-sm font-medium whitespace-nowrap shrink-0 transition-colors border',
                  isActive
                    ? 'bg-brand text-brand-fg border-transparent shadow-sm'
                    : 'bg-surface text-fg border-border hover:bg-elevated'
                )
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
