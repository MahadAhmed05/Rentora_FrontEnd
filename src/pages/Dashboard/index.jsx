// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { ROLES } from "../../constants";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const isOwner = user?.role === ROLES.OWNER;
//   const buttonText = isOwner ? "My Products" : "My Requests";
//   const targetPath = isOwner ? "/products" : "/requests";

//   return (
//     <div className="page">
//       <h1>Dashboard</h1>
//       <p>Welcome, {user?.name || "User"}.</p>
//       <p>This is a placeholder dashboard. Product modules can be added later.</p>
//       <div className="actions-row">
//         <button onClick={() => navigate(targetPath)}>{buttonText}</button>
//         <button className="secondary" onClick={logout}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants";
import { useGetProductsQuery } from "../../store/api/productsApi";
import AddProductModal from "../../components/modals/addProduct";
import RequestProductModal from "../../components/modals/RequestProduct";
import "./style.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isOwner = user?.role === ROLES.OWNER;
  const buttonText = isOwner ? "Owner DashBoard" : "Renter Dashboard";
  const targetPath = isOwner ? "/owner/products" : "/renter";

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [queryParams, setQueryParams] = useState({ page: 1, limit: 10 });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetProductsQuery(queryParams);

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const apiErrorMessage =
    error?.data?.message || "Failed to load products. Please try again.";

  useEffect(() => {
    const nextParams = {
      category: filters.category,
      location: filters.location,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      page,
      limit,
    };
    setQueryParams(nextParams);
  }, [filters, page]);

  useEffect(() => {
    if (data?.success && Array.isArray(data.data)) {
      setProducts(data.data);
    } else {
      setProducts([]);
    }
  }, [data]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPage(1);
  };

  return (
    <div className="dashboard-page">
      {/* Top Section */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.name || "User"}</p>
        </div>

        <div className="actions-row">
          <button onClick={() => navigate(targetPath)}>{buttonText}</button>
          {isOwner && (
            <button onClick={() => setIsAddProductOpen(true)}>Add Product</button>
          )}
          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Makeup">Makeup</option>
          <option value="Others">Others</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />

        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
        />

        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      {/* Products */}
      <div className="products-grid">
        {(isLoading || isFetching) && <p>Loading products...</p>}
        {!isLoading && isError && (
          <p className="error-text">{apiErrorMessage}</p>
        )}
        {!isLoading && !isError && products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((item) => (
            <div className="product-card" key={item._id}>
              <img src={item.imageUrl} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="meta">
                <span>{item.location}</span>
                <span>Rs {item.pricePerDay}/day</span>
              </div>
              {!isOwner && (
                <button
                  onClick={() => {
                    setSelectedProduct(item);
                    setIsRequestOpen(true);
                  }}
                >
                  Request
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="pagination-row">
        <button
          disabled={!canGoPrev || isFetching}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={!canGoNext || isFetching}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {isOwner && (
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {!isOwner && (
        <RequestProductModal
          isOpen={isRequestOpen}
          product={selectedProduct}
          onClose={() => {
            setIsRequestOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
