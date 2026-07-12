import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import { Dropdown, Popover } from '../ui/Overlays.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const TITLES = {
  '/': 'Daily Bulletin',
  '/mission-1': 'Whistleblower',
  '/mission-2': 'Seat Planner',
  '/mission-3': 'Syllabus AI',
  '/mission-4': 'Tiffin Ledger',
  '/mission-5': 'SOS Rescue',
  '/mission-6': 'Fact Checker',
  '/mission-7': 'Peer Rating',
  '/mission-8': 'Captain Engine',
  '/mission-9': 'Captain Voting',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

const CODES = {
  '/': 'FILE 00',
  '/mission-1': 'FILE 01',
  '/mission-2': 'FILE 02',
  '/mission-3': 'FILE 03',
  '/mission-4': 'FILE 04',
  '/mission-5': 'FILE 05',
  '/mission-6': 'FILE 06',
  '/mission-7': 'FILE 07',
  '/mission-8': 'FILE 08',
  '/mission-9': 'FILE 09',
};

export default function Topbar({ onOpenSidebar, liveCount = 0 }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const base = '/' + (pathname.split('/')[1] || '');
  const title = TITLES[base] || 'Console';
  const code = CODES[base] || 'OFFICE';

  const handleSignOut = () => {
    signOut();
    navigate('/auth/welcome', { replace: true });
  };

  return (
    <header
      style={{ background: 'rgb(var(--sidebar-bg))', color: 'rgb(var(--chrome-fg))' }}
      className="sticky top-0 z-20 border-b border-white/15 text-white"
    >
      {/* Row 1 — utility rail */}
      <div className="h-9 px-4 sm:px-6 flex items-center gap-3 border-b border-white/15 text-white/80">

        <button
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="lg:hidden -ml-1 h-8 w-8 flex items-center justify-center text-white/90 hover:text-white"
        >
          <Menu size={17} />
        </button>
        <div className="flex-1" />
        {liveCount > 0 && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white stamp-live" />
            {liveCount} live signal{liveCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Row 2 — title bar */}
      <div className="px-4 sm:px-6 py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-white/75">{code}</p>
          <h1 className="mt-0.5 font-display text-xl sm:text-2xl leading-none text-white truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <label className="hidden md:flex items-center gap-2 w-72 h-9 px-3 border border-white/30 bg-white/10 text-sm text-white/90 rounded-sm focus-within:border-white focus-within:bg-white/15">
            <Search size={14} />
            <input
              className="flex-1 bg-transparent outline-none placeholder:text-white/60 text-white"
              placeholder="Search cases, students, rolls…"
              aria-label="Search"
            />
            <kbd className="font-mono text-[10px] text-white/70 border border-white/30 px-1">/</kbd>
          </label>

          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-9 w-9 border border-white/30 text-white/90 hover:text-white hover:bg-white/10 flex items-center justify-center rounded-sm"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Popover
            trigger={
              <span className="relative h-9 w-9 border border-white/30 text-white/90 hover:text-white hover:bg-white/10 flex items-center justify-center rounded-sm">
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
              </span>
            }
          >
            <p className="eyebrow mb-2">Recent entries</p>
            <ul className="space-y-2 text-xs text-muted">
              <li>New SOS filed from Playground</li>
              <li>Trust score drop flagged for Captain Rana</li>
              <li>Vote closes in 2 hours</li>
            </ul>
          </Popover>

          <Dropdown
            trigger={<Avatar name={user?.name || user?.rollId || 'Account'} />}
            items={[
              { label: 'Profile', onClick: () => navigate('/profile') },
              { label: 'Settings', onClick: () => navigate('/settings') },
              { label: 'Sign out', onClick: handleSignOut },
            ]}
          />
        </div>
      </div>

    </header>
  );
}
