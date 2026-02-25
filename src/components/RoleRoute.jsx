import { Navigate } from "react-router-dom";

export default function RoleRoute({ auth, allowedRoles, children }) {
  if (!auth) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(auth.role)) return <Navigate to="/" replace />;
  return children;
}
