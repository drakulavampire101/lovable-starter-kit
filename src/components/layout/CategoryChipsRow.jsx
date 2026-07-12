import { NavLink, useLocation, matchPath } from 'react-router-dom';
import { useMemo } from 'react';
import { cx } from '../../utils/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_BY_ROLE } from '../../routes/navigation.js';
import { prefetchRoute } from '../../routes/prefetch.js';

// Mobile quick-nav: minimal chips, active one pinned to the front.
export default function CategoryChipsRow() {
  const { role } = useAuth();
  const { pathname } = useLocation();
  const navRole = role === 'teacher' ? 'office' : role;
  const NAV = NAV_BY_ROLE[navRole] || NAV_BY_ROLE.student;

  const items = useMemo(() => {
    const flat = NAV.flatMap((g) => g.items);
    const isActive = (item) =>
      !!matchPath({ path: item.to, end: !!item.end }, pathname) ||
      (!item.end && pathname.startsWith(item.to + '/'));
    // Best match: longest matching `to` wins.
    const activeIdx = flat.reduce(
      (best, item, i) => (isActive(item) && item.to.length > (flat[best]?.to.length || -1) ? i : best),
      -1
    );
    if (activeIdx <= 0) return flat;
    const clone = [...flat];
    const [selected] = clone.splice(activeIdx, 1);
    return [selected, ...clone];
  }, [NAV, pathname]);

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
              onMouseEnter={() => prefetchRoute(to)}
              onTouchStart={() => prefetchRoute(to)}
              onFocus={() => prefetchRoute(to)}
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
