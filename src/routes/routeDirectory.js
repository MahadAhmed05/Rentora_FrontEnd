import { lazy } from "react";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const OwnerDashboard = lazy(() => import("../pages/OwnerDashBoard"));
const OwnerProducts = lazy(() => import("../pages/OwnerDashBoard/Products"));
const OwnerRequests = lazy(() => import("../pages/OwnerDashBoard/Requests"));
const NotFound = lazy(() => import("../pages/NotFound"));
const RenterDashboard = lazy(() => import("../pages/RenterDashBoard"));

export const routeDirectory = {
  login: {
    raw: "/login",
    auth_required: false,
    component: Login,
  },
  register: {
    raw: "/register",
    auth_required: false,
    component: Register,
  },
  dashboard: {
    raw: "/dashboard",
    auth_required: true,
    component: Dashboard,
  },
  owner: {
    raw: "/owner",
    auth_required: true,
    ownerOnly: true,
    component: OwnerDashboard,
    children: [
      { index: true, redirectTo: "products" },
      { path: "products", component: OwnerProducts },
      { path: "requests", component: OwnerRequests },
    ],
  },
  renter: {
    raw: "/renter",
    auth_required: true,
    renterOnly: true,
    component: RenterDashboard,
  },
  notFound: {
    raw: "*",
    auth_required: false,
    component: NotFound,
  },
};
