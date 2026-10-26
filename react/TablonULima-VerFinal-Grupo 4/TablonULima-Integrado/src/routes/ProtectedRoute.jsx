import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HOME_BY_ROLE } from '../utils/constants';
import ForbiddenPage from '../pages/auth/ForbiddenPage';

// Solo para usuarios con sesión y rol permitido: <RequireRole roles={['ADMINISTRADOR']}>
export function RequireRole({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname, needLogin: true }} />;
  if (!roles.includes(user.rol)) return <ForbiddenPage />;
  return children;
}

// Solo para visitantes (login, registro, recuperar). Con sesión, redirige a su vista principal.
export function GuestOnly({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user) return <Navigate to={location.state?.from || HOME_BY_ROLE[user.rol]} replace />;
  return children;
}
