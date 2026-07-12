import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { canAccess, ROLE_HOME } from './permissions.js';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/landing" replace state={{ from: loc.pathname }} />;
  return children ?? <Outlet />;
}

export function RoleGuard({ children }) {
  const { user, role, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/auth/welcome" replace />;
  const active = role || user.roles?.[0] || 'student';
  if (loc.pathname === '/') {
    return <Navigate to={ROLE_HOME[active] || '/student'} replace />;
  }
  if (!canAccess(active, loc.pathname)) {
    return <Navigate to="/auth/denied" replace />;
  }
  return children ?? <Outlet />;
}
