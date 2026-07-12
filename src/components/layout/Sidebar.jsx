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
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        style={{ background: 'rgb(var(--sidebar-bg))', color: 'rgb(var(--chrome-fg))' }}
        className={cx(
          'fixed lg:sticky top-0 z-40 h-dvh shrink-0',
          'border-r border-white/15',
          'flex flex-col transition-[width,transform] duration-200',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          mobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header — official stamp */}
        <div className="border-b border-white/15 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 border border-white/40 bg-white/15 text-white flex items-center justify-center font-display text-xl">
              K
              <span aria-hidden className="absolute -bottom-1 -right-1 h-3 w-3 bg-white border border-white/60" />
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="font-display text-[15px] uppercase tracking-wide truncate text-white">Anti Kuddus Protocol</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/80 mt-0.5">
                  Class 9C · Reg. 2026
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map((group) => (
            <div key={group.section} className="mb-5">
              {!collapsed && (
                <div className="flex items-baseline justify-between px-4 mb-2">
                  <p className="font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-white/75">{group.section}</p>
                  <p className="font-mono text-[9px] tracking-widest text-white/50">{group.code}</p>
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
                          'relative flex items-center gap-3 py-2.5 pl-4 pr-3 text-sm font-medium transition-colors',
                          'border-l-[3px]',
                          isActive
                            ? 'border-white bg-white/20 text-white'
                            : 'border-transparent text-white/85 hover:text-white hover:bg-white/10',
                          collapsed && 'justify-center px-2'
                        )
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      {!collapsed && (
                        <span className="font-mono text-[10px] tracking-wider text-white/60 w-5 shrink-0">
                          {item.code}
                        </span>
                      )}
                      <item.icon size={16} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/15 p-3 hidden lg:block">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 h-8 text-[11px] font-mono uppercase tracking-widest text-white/80 hover:text-white transition-colors"
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {collapsed ? <ChevronRight size={14} /> : (<><ChevronLeft size={14} /> Collapse</>)}
          </button>
        </div>
      </aside>
    </>
  );
}
