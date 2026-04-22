// const Products = () => {
//   return (
//     <div className="page">
//       <h1>My Products</h1>
//       <p>Owner products page placeholder.</p>
//     </div>
//   );
// };

// export default Products;


import { Tabs, Tab, Box } from "@mui/material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab =
    location.pathname.includes("requests") ? 1 : 0;

  const handleChange = (event, newValue) => {
    if (newValue === 0) navigate("/owner/products");
    else navigate("/owner/requests");
  };

  return (
    <div className="page">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTab} onChange={handleChange}>
          <Tab label="My Products" />
          <Tab label="Requests" />
        </Tabs>
      </Box>

      <Outlet />
    </div>
  );
};

export default OwnerDashboard;