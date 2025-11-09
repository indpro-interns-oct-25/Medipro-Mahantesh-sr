import { getUser } from '../services/auth.js';

export function RoleGuard({ allowedRoles, children, fallback = null }) {
  const user = getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }
  return children;
}

export function hasRole(role) {
  const user = getUser();
  return user?.role === role;
}

export function hasAnyRole(...roles) {
  const user = getUser();
  return user && roles.includes(user.role);
}

