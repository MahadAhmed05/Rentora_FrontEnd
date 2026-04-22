import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const CustomRoute = ({ route }) => {
  const { auth_required, ownerOnly, renterOnly, component: Component, raw } = route;
  const { isAuthenticated, user } = useAuth();

  if (auth_required && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if ((raw === "/login" || raw === "/register") && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (ownerOnly && user?.role !== "owner") {
    return <Navigate to="/dashboard" replace />;
  }

  if (renterOnly && user?.role !== "renter") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Component />;
};
