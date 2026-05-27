import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { RepairJobs } from "./pages/admin/RepairJobs";
import { Inventory } from "./pages/admin/Inventory";
import { POS } from "./pages/admin/POS";
import { Customers } from "./pages/admin/Customers";
import { CustomerDashboard } from "./pages/customer/Dashboard";
import { AdminLayout } from "./layouts/AdminLayout";
import { CustomerLayout } from "./layouts/CustomerLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "repair-jobs", Component: RepairJobs },
      { path: "inventory", Component: Inventory },
      { path: "pos", Component: POS },
      { path: "customers", Component: Customers },
    ],
  },
  {
    path: "/customer",
    Component: CustomerLayout,
    children: [
      { index: true, Component: CustomerDashboard },
    ],
  },
]);
