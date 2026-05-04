import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const TITLE_MAP = {
  "/dashboard": "Product Listings",
  "/owner": "Owner Dashboard",
  "/owner/products": "My Products",
  "/owner/requests": "Incoming Requests",
  "/renter": "Renter Dashboard",
};

const parentRoutes = {
  "/owner/products": "/dashboard",
  "/owner/requests": "/dashboard",
  "/renter": "/dashboard",
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const parentPath = parentRoutes[pathname];

  const pageTitle = useMemo(() => {
    return TITLE_MAP[pathname] || "Rentora";
  }, [pathname]);

  const handleBack = () => {
    if (parentPath) {
      navigate(parentPath);
    }
  };

  return (
    <header className="topbar" role="banner">
      <div className="topbar-content">
        <div className="topbar-left">
          {parentPath && (
            <button type="button" className="topbar-back-btn" onClick={handleBack}>
              Back
            </button>
          )}
        </div>

        <h1 className="topbar-title">{pageTitle}</h1>
      </div>
    </header>
  );
};

export default Topbar;
