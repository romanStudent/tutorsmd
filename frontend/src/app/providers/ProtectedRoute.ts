import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectActiveRole,
} from '@entities/user/model/selectors';
import type { Role } from '@entities/user/model/types';

interface Props {
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeRole      = useSelector(selectActiveRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && activeRole && !allowedRoles.includes(activeRole)) {
    // Авторизован, но не та роль — на dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
