import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import MainLayout from "../layout/MainLayout";

export const CustomRoute = ({ route }) => {
  const {
    auth_required,
    ownerOnly,
    renterOnly,
    layout,
    component: Component,
    raw,
  } = route;
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

  const routeElement = <Component />;

  if (layout) {
    return <MainLayout>{routeElement}</MainLayout>;
  }

  return routeElement;
};
