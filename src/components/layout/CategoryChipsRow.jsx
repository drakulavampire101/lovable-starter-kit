import { NavLink } from 'react-router-dom';
import { cx } from '../../utils/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_BY_ROLE } from '../../routes/navigation.js';

// Mobile quick-nav: mirrors the sidebar for the current role. Each chip gets its
// own hue so kids can spot destinations by color, not just label.
const PALETTE = [
  'bg-[#0F9D58] text-white',
  'bg-[#EA4335] text-white',
  'bg-[#4285F4] text-white',
  'bg-[#AB47BC] text-white',
  'bg-[#FBBC04] text-black',
  'bg-[#00ACC1] text-white',
  'bg-[#FB8C00] text-white',
  'bg-[#5E35B1] text-white',
  'bg-[#E91E63] text-white',
  'bg-[#43A047] text-white',
  'bg-[#3949AB] text-white',
  'bg-[#00897B] text-white',
];

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
          {items.map(({ to, label, icon: Icon, end }, i) => {
            const chip = PALETTE[i % PALETTE.length];
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cx(
                    'inline-flex items-center gap-2 rounded-full px-3.5 h-9 text-sm font-medium whitespace-nowrap shrink-0 transition-all border',
                    isActive
                      ? `${chip} border-transparent shadow-sm`
                      : 'bg-surface text-fg border-border hover:bg-elevated'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cx(
                        'flex h-5 w-5 items-center justify-center rounded-full',
                        isActive ? 'bg-white/20' : chip
                      )}
                    >
                      <Icon size={12} />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
