import { useGetMyProductsQuery } from "../../../store/api/productsApi";
import "./style.css";

const Products = () => {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetMyProductsQuery();
  const products = Array.isArray(data?.data) ? data.data : [];
  const apiErrorMessage =
    error?.data?.message || "Failed to load your products. Please try again.";

  return (
    <div className="products-page">
      <h1>My Products</h1>

      {(isLoading || isFetching) && <p>Loading products...</p>}

      {!isLoading && isError && (
        <div>
          <p className="error-text">{apiErrorMessage}</p>
          <button className="retry-btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && <p>No products found</p>}

      {!isLoading && !isError && products.length > 0 && (
        <div className="products-grid">
          {products.map((item) => (
            <div className="product-card" key={item._id}>
              <img src={item.imageUrl} alt={item.name} />

              <div className="product-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className="meta">
                  <span>{item.location}</span>
                  <span>Rs {item.pricePerDay}/day</span>
                </div>

                <div
                  className={`status ${item.status === "available" ? "available" : "rented"}`}
                >
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;