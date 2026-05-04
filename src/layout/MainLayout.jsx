import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar/Topbar";
import "./style.css";

const MainLayout = ({ children }) => {
  return (
    <>
      <Topbar />
      <main className="main-layout-content">
        {children || <Outlet />}
      </main>
    </>
  );
};

export default MainLayout;
