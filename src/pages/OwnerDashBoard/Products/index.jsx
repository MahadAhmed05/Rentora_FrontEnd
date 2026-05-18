import { useState } from "react";
import {
  useGetMyProductsQuery,
  useDeleteProductMutation,
} from "../../../store/api/productsApi";
import { showToast } from "../../../utils/toast";
import "./style.css";

const Products = () => {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMyProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const products = Array.isArray(data?.data) ? data.data : [];
  const apiErrorMessage =
    error?.data?.message || "Failed to load your products. Please try again.";

  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const handleDeleteClick = (id) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = async (id) => {
    setConfirmId(null);
    setDeletingId(id);

    try {
      const response = await deleteProduct(id).unwrap();
      const successMessage =
        response?.message || "Product deleted successfully.";
      showToast(successMessage, true);
      // RTK Query cache invalidation removes the card automatically
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        (err?.status === "FETCH_ERROR"
          ? "Network error. Please try again."
          : "Failed to delete product.");
      showToast(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => setConfirmId(null);

  return (
    <div className="products-page">
      <h1>My Products</h1>

      {/* Loading skeleton */}
      {(isLoading || isFetching) && (
        <div className="products-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="product-card skeleton" key={i}>
              <div className="skeleton-img" />
              <div className="product-content">
                <div className="skeleton-line wide" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="state-message error-state">
          <p>{apiErrorMessage}</p>
          <button className="retry-btn" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isFetching && !isError && products.length === 0 && (
        <div className="state-message">
          <p>No products found. Add your first product from the dashboard.</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isFetching && !isError && products.length > 0 && (
        <div className="products-grid">
          {products.map((item) => {
            const isDeleting = deletingId === item._id;
            const isConfirming = confirmId === item._id;

            return (
              <div
                className={`product-card ${isDeleting ? "is-deleting" : ""}`}
                key={item._id}
              >
                <div className="card-image-wrapper">
                  <img src={item.imageUrl} alt={item.name} />
                  <span className="category-badge">{item.category}</span>
                  <span className={`status-badge ${item.status === "available" ? "available" : "rented"}`}>
                    {item.status}
                  </span>
                </div>

                <div className="product-content">
                  <h3>{item.name}</h3>
                  <p className="card-description">{item.description}</p>

                  <div className="meta">
                    <span className="meta-location">📍 {item.location}</span>
                    <span className="meta-price">Rs {item.pricePerDay}/day</span>
                  </div>

                  {/* Inline confirm or delete button */}
                  {isConfirming ? (
                    <div className="confirm-delete">
                      <p className="confirm-text">Delete this product?</p>
                      <div className="confirm-actions">
                        <button
                          className="btn-cancel-delete"
                          onClick={handleCancelDelete}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-confirm-delete"
                          onClick={() => handleConfirmDelete(item._id)}
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClick(item._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;