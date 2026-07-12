import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '../../utils/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_BY_ROLE } from '../../routes/navigation.js';

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { role } = useAuth();
  const NAV = NAV_BY_ROLE[role] || NAV_BY_ROLE.student;
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-ink/60 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        style={{ background: 'rgb(var(--sidebar-bg))' }}
        className={cx(
          'fixed lg:sticky top-0 z-40 h-dvh shrink-0',
          'text-ink border-r border-ink/15',
          'flex flex-col transition-[width,transform] duration-200',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          mobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >

        {/* Header — official stamp */}
        <div className="border-b border-ink/15 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 border border-ink/40 bg-ink text-paper flex items-center justify-center font-display text-xl">
              K
              <span aria-hidden className="absolute -bottom-1 -right-1 h-3 w-3 bg-ochre border border-ink" />
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="font-display text-[15px] uppercase tracking-wide truncate">Anti Kuddus Protocol</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/55 mt-0.5">
                  Class 9C · Reg. 2026
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav — ledger rows */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map((group) => (
            <div key={group.section} className="mb-5">
              {!collapsed && (
                <div className="flex items-baseline justify-between px-4 mb-2">
                  <p className="eyebrow text-ink/50">{group.section}</p>
                  <p className="font-mono text-[9px] tracking-widest text-ink/30">{group.code}</p>
                </div>
              )}
              <ul>
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        cx(
                          'relative flex items-center gap-3 py-2.5 pl-4 pr-3 text-sm transition-colors',
                          'border-l-[3px]',
                          isActive
                            ? 'border-ochre bg-ink/5 text-ink'
                            : 'border-transparent text-ink/65 hover:text-ink hover:bg-ink/5',
                          collapsed && 'justify-center px-2'
                        )
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      {!collapsed && (
                        <span className="font-mono text-[10px] tracking-wider text-ink/40 w-5 shrink-0">
                          {item.code}
                        </span>
                      )}
                      <item.icon size={15} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer — stamped identity */}
        <div className="border-t border-ink/15 p-3 hidden lg:block">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 h-8 text-[11px] font-mono uppercase tracking-widest text-ink/60 hover:text-ink transition-colors"
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {collapsed ? <ChevronRight size={14} /> : (<><ChevronLeft size={14} /> Collapse</>)}
          </button>
        </div>
      </aside>
    </>
  );
}
