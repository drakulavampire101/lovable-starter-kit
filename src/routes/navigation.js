// Single source of truth for role-based sidebar navigation.
// Keep in sync with routes/permissions.js — nav links MUST be reachable.
import {
  LayoutDashboard, ShieldAlert, Grid3X3, BookOpen, Coins, Siren, SearchCheck,
  Star, Award, Vote, BarChart3, Bell, Settings, User, Gavel, Users, ClipboardList, Network,
} from 'lucide-react';

const ACCOUNT_TAIL = {
  section: 'Account', code: '·', items: [
    { to: '/notifications', label: 'Notifications', code: 'N1', icon: Bell },
    { to: '/profile', label: 'Profile', code: 'P1', icon: User },
    { to: '/settings', label: 'Settings', code: 'S1', icon: Settings },
  ],
};

export const NAV_BY_ROLE = {
  student: [
    { section: 'Register', code: '00', items: [
      { to: '/student', label: 'My bulletin', code: '00', icon: LayoutDashboard, end: true },
    ]},
    { section: 'Student tools', code: '01–09', items: [
      { to: '/mission-1', label: 'Whistleblower', code: '01', icon: ShieldAlert },
      { to: '/mission-2', label: 'Seat planner', code: '02', icon: Grid3X3 },
      { to: '/mission-3', label: 'Syllabus AI', code: '03', icon: BookOpen },

      { to: '/mission-4/tiffin', label: 'Tiffin report', code: '04', icon: Coins },
      { to: '/mission-5', label: 'SOS rescue', code: '05', icon: Siren },
      { to: '/mission-6', label: 'Fact checker', code: '06', icon: SearchCheck },
      { to: '/mission-7', label: 'Peer rating', code: '07', icon: Star },
      { to: '/mission-9', label: 'Captain voting', code: '09', icon: Vote },
    ]},
    ACCOUNT_TAIL,
  ],
  captain: [
    { section: 'Register', code: '00', items: [
      { to: '/captain', label: 'Captain desk', code: '00', icon: LayoutDashboard, end: true },
    ]},
    { section: 'Captain tools', code: '01–09', items: [
      { to: '/mission-1/captain', label: 'Complaint queue', code: '01', icon: ShieldAlert },
      { to: '/mission-2', label: 'Seat planner', code: '02', icon: Grid3X3 },
      { to: '/mission-4', label: 'Tiffin ledger', code: '04', icon: Coins },
      { to: '/mission-5/captain', label: 'SOS console', code: '05', icon: Siren },
      { to: '/mission-7/leaderboard', label: 'Peer leaderboard', code: '07', icon: Star },
      { to: '/mission-8', label: 'Captain engine', code: '08', icon: Award },
      { to: '/mission-9/results', label: 'Vote results', code: '09', icon: Vote },
    ]},
    ACCOUNT_TAIL,
  ],
  office: [
    { section: 'Register', code: '00', items: [
      { to: '/office', label: 'Office desk', code: '00', icon: LayoutDashboard, end: true },
    ]},
    { section: 'Administration', code: '10–13', items: [
      { to: '/analytics', label: 'Analytics', code: '10', icon: BarChart3 },
      { to: '/mission-1/archive', label: 'Case archive', code: '11', icon: ClipboardList },
      { to: '/mission-8', label: 'Candidate review', code: '12', icon: Users },
      { to: '/mission-9', label: 'Election admin', code: '13', icon: Gavel },
    ]},
    { section: 'Oversight', code: '14–19', items: [
      { to: '/mission-2', label: 'Seat planner', code: '14', icon: Grid3X3 },
      { to: '/mission-4', label: 'Tiffin ledger', code: '15', icon: Coins },
      { to: '/mission-5/incidents', label: 'SOS overview', code: '16', icon: Siren },
      { to: '/mission-6', label: 'Fact checker', code: '17', icon: SearchCheck },
      { to: '/mission-10', label: 'Trust graph', code: '18', icon: Network },
    ]},
    ACCOUNT_TAIL,
  ],
};
