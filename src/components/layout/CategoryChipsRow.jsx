import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShieldAlert, Grid3X3, BookOpen, Coins, Siren, SearchCheck,
} from 'lucide-react';
import { cx } from '../../utils/index.js';

// Play-store style colorful category chips. Each mission gets its own hue.
// Colors are placeholders until the final palette lands — swap the `chip` values
// or move them to CSS tokens once the theme is finalized.
const CHIPS = [
  { to: '/',           label: 'For You',      icon: LayoutDashboard, end: true, chip: 'bg-[#0F9D58] text-white' },
  { to: '/mission-1',  label: 'Whistleblower', icon: ShieldAlert,             chip: 'bg-[#EA4335] text-white' },
  { to: '/mission-2',  label: 'Seat Planner',  icon: Grid3X3,                 chip: 'bg-[#4285F4] text-white' },
  { to: '/mission-3',  label: 'Syllabus AI',   icon: BookOpen,                chip: 'bg-[#AB47BC] text-white' },
  { to: '/mission-4',  label: 'Tiffin Ledger', icon: Coins,                   chip: 'bg-[#FBBC04] text-black' },
  { to: '/mission-5',  label: 'SOS Rescue',    icon: Siren,                   chip: 'bg-[#F4511E] text-white' },
  { to: '/mission-6',  label: 'Fact Checker',  icon: SearchCheck,             chip: 'bg-[#00ACC1] text-white' },
];

export default function CategoryChipsRow() {
  return (
    <div className="border-b border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          aria-label="Mission categories"
          className="flex gap-2 overflow-x-auto py-3 no-scrollbar"
        >
          {CHIPS.map(({ to, label, icon: Icon, end, chip }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cx(
                  'group inline-flex items-center gap-2 rounded-full px-3.5 h-9 text-sm font-medium whitespace-nowrap shrink-0 transition-all',
                  'border',
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
                      'flex h-5 w-5 items-center justify-center rounded-full transition-colors',
                      isActive ? 'bg-white/20' : `${chip.split(' ')[0]} text-white`
                    )}
                  >
                    <Icon size={12} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
