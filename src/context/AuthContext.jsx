import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/authService.js';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext(null);

const ROLE_ROUTES = { student: '/student', captain: '/captain', office: '/office', teacher: '/teacher', admin: '/office' };
const ROLE_KEY = 'akp:selectedRole';

// DB roles (STUDENT/CAPTAIN/TEACHER/OFFICE) -> frontend routes (lowercase)
function normalizeRole(r) {
  if (!r) return null;
  const v = String(r).toLowerCase();
  if (v === 'admin') return 'office';
  return v;
}

function buildUser(supaUser, profile, roles) {
  if (!supaUser) return null;
  const normRoles = (roles || []).map(normalizeRole).filter(Boolean);
  return {
    id: supaUser.id,
    email: supaUser.email,
    rollNumber: profile?.roll_number || supaUser.user_metadata?.roll_number || '',
    name: profile?.name || supaUser.user_metadata?.name || 'User',
    className: profile?.class_name || null,
    section: profile?.section || null,
    height: profile?.height ?? null,
    dob: profile?.dob || null,
    vision: profile?.vision || null,
    hearing: profile?.hearing || null,
    avatarColor: profile?.avatar_color || 'brand',
    roles: normRoles.length ? normRoles : ['student'],
    role: normRoles[0] || 'student',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRoleState] = useState(() => localStorage.getItem(ROLE_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roles = user?.roles || [];
  const normalizedRole = normalizeRole(role);
  const activeRole = normalizedRole && (!roles.length || roles.includes(normalizedRole))
    ? normalizedRole
    : roles[0] || null;

  const setRole = (r) => {
    const n = normalizeRole(r);
    setRoleState(n);
    try { n ? localStorage.setItem(ROLE_KEY, n) : localStorage.removeItem(ROLE_KEY); } catch {}
  };

  const hydrate = useCallback(async (session) => {
    if (!session?.user) { setUser(null); return null; }
    const [profile, dbRoles] = await Promise.all([
      authService.getProfile(session.user.id).catch(() => null),
      authService.getRoles(session.user.id).catch(() => []),
    ]);
    const u = buildUser(session.user, profile, dbRoles);
    setUser(u);
    return u;
  }, []);

  useEffect(() => {
    // ⚠️ Auth temporarily disabled for demo — inject a demo user with all roles.
    const demoUser = {
      id: 'demo-user',
      email: 'demo@baiust.local',
      rollNumber: 'DEMO-001',
      name: 'Demo User',
      className: '9',
      section: 'C',
      height: null, dob: null, vision: null, hearing: null,
      avatarColor: 'brand',
      roles: ['student', 'captain', 'teacher', 'office'],
      role: 'office',
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setTimeout(() => { hydrate(session); }, 0);
      } else {
        setUser(demoUser);
      }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) await hydrate(data.session);
      else setUser(demoUser);
      setLoading(false);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [hydrate]);

  useEffect(() => {
    if (!user) return;
    const active = normalizeRole(role);
    if (user.roles.length && (!active || !user.roles.includes(active))) setRole(user.roles[0]);
  }, [user, role]);

  const signIn = useCallback(async ({ rollNumber, role: chosenRole }) => {
    // ⚠️ Auth temporarily disabled for demo — accept any credentials.
    setError(null);
    const roleName = chosenRole || 'student';
    const demoUser = {
      id: 'demo-user',
      email: `${(rollNumber || 'demo').toLowerCase()}@baiust.local`,
      rollNumber: rollNumber || 'DEMO-001',
      name: rollNumber ? `Demo ${rollNumber}` : 'Demo User',
      className: '9', section: 'C',
      height: null, dob: null, vision: null, hearing: null,
      avatarColor: 'brand',
      roles: ['student', 'captain', 'teacher', 'office'],
      role: roleName,
    };
    setUser(demoUser);
    setRole(roleName);
    return { success: true };
  }, []);

  const signUp = useCallback(async ({ rollNumber, name, password, role: chosenRole, className, section, height, dob, vision, hearing }) => {
    setError(null);
    try {
      await authService.register({
        rollNumber, name, password,
        role: chosenRole ? chosenRole.toUpperCase() : 'STUDENT',
        className, section, height, dob, vision, hearing,
      });
      if (chosenRole) setRole(chosenRole);
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  const chooseRole = useCallback((r) => setRole(r), []);
  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return hydrate(data.session);
  }, [hydrate]);

  return (
    <AuthContext.Provider
      value={{ user, role: activeRole, roles, loading, error, signIn, signUp, chooseRole, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export { ROLE_ROUTES };
