import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ROLES } from "../../constants";
import { useGetProductsQuery } from "../../store/api/productsApi";

import AddProductModal from "../../components/modals/addProduct";
import RequestProductModal from "../../components/modals/RequestProduct";
import OwnerModal from "../../components/modals/ownerModal";

import "./style.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isOwner = user?.role === ROLES.OWNER;

  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const queryParams = useMemo(
    () => ({
      category: filters.category || undefined,
      location: filters.location || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      page,
      limit,
    }),
    [filters, page, limit],
  );

  // MODALS
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  // SELECTED DATA
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);

  // API
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetProductsQuery(queryParams);
  const products = useMemo(
    () => (data?.success ? data.data || [] : []),
    [data],
  );

  const totalPages = data?.pagination?.totalPages || 1;
  const apiError = error?.data?.message || "Failed to load products.";

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleViewOwner = (ownerId, product) => {
    setSelectedProduct(product);
    setSelectedOwnerId(ownerId);
    setIsOwnerModalOpen(true);
  };

  const handleRequestClick = (item) => {
    setSelectedProduct(item);
    setIsRequestOpen(true);
  };

  const handleCloseRequest = () => {
    setIsRequestOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Dashboard</h1>
          <p className="welcome-text">
            Welcome back, <span>{user?.name}</span>
          </p>
        </div>

        <div className="actions-row">
          <button
            className="btn-secondary"
            onClick={() => navigate(isOwner ? "/owner/products" : "/renter")}
          >
            {isOwner ? "My Listings" : "My Rentals"}
          </button>

          {isOwner && (
            <button
              className="btn-primary"
              onClick={() => setIsAddProductOpen(true)}
            >
              + Add Product
            </button>
          )}

          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
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
          onChange={handleFilterChange}
        />

        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />

        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        {/* Loading skeleton */}
        {(isLoading || isFetching) && (
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="product-card skeleton" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-line wide" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="state-message error-state">
            <p>{apiError}</p>
            <button className="btn-primary" onClick={refetch}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isFetching && !isError && products.length === 0 && (
          <div className="state-message">
            <p>No products found for your current filters.</p>
          </div>
        )}

        {/* Cards */}
        {!isLoading && !isFetching && products.length > 0 && (
          <div className="products-grid">
            {products.map((item) => (
              <div className="product-card" key={item._id}>
                <div className="card-image-wrapper">
                  <img src={item.imageUrl} alt={item.name} />
                  <span className="category-badge">{item.category}</span>
                </div>

                <div className="card-body">
                  <h3>{item.name}</h3>
                  <p className="card-description">{item.description}</p>

                  <div className="meta">
                    <span className="meta-location">📍 {item.location}</span>
                    <span className="meta-price">
                      Rs {item.pricePerDay}/day
                    </span>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-owner"
                      onClick={() => handleViewOwner(item.ownerId, item)}
                    >
                      View Owner
                    </button>

                    {!isOwner && (
                      <button
                        className="btn-request"
                        onClick={() => handleRequestClick(item)}
                      >
                        Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="pagination-row">
          <button
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* MODALS */}
      {isOwner && (
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onSuccess={refetch}
        />
      )}

      {!isOwner && selectedProduct && (
        <RequestProductModal
          isOpen={isRequestOpen}
          product={selectedProduct}
          onClose={handleCloseRequest}
        />
      )}

      <OwnerModal
        isOpen={isOwnerModalOpen}
        ownerId={selectedOwnerId}
        product={selectedProduct}
        onClose={() => {
          setIsOwnerModalOpen(false);
          setSelectedOwnerId(null);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
