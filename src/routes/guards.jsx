import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLE_HOME } from './permissions.js';

// ⚠️ Auth temporarily disabled for demo. Guards are pass-through.
export function RequireAuth({ children }) {
  return children ?? <Outlet />;
}

export function RoleGuard({ children }) {
  const { user, role } = useAuth();
  const loc = useLocation();
  const active = role || user?.roles?.[0] || 'office';
  if (loc.pathname === '/app') {
    return <Navigate to={ROLE_HOME[active] || '/office'} replace />;
  }
  return children ?? <Outlet />;
}
