import { useGetMyRequestsQuery } from "../../store/api/requestsApi";
import "./style.css";

const RenterRequests = () => {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetMyRequestsQuery();
  const requests = Array.isArray(data?.data) ? data.data : [];
  const apiErrorMessage =
    error?.data?.message || "Failed to load your requests. Please try again.";

  const getStatusClass = (status) => {
    if (status === "pending") return "pending";
    if (status === "accepted") return "accepted";
    if (status === "rejected") return "rejected";
    return "";
  };

  return (
    <div className="renter-requests-page">
      <h1>My Requests</h1>

      {(isLoading || isFetching) && <p>Loading requests...</p>}

      {!isLoading && isError && (
        <div>
          <p className="error-text">{apiErrorMessage}</p>
          <button className="retry-btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && requests.length === 0 && <p>No requests found</p>}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="request-grid">
          {requests.map((item) => (
            <div className="request-card" key={item._id}>
              {/* Product Info */}
              <div className="product-section">
                <img src={item.productId?.imageUrl} alt={item.productId?.name} />

                <div>
                  <h3>{item.productId?.name}</h3>
                  <p>{item.productId?.location}</p>
                  <p>Rs {item.productId?.pricePerDay}/day</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="price">
                Total: Rs {item.totalPrice}
              </div>

              {/* Status */}
              <div className={`status ${getStatusClass(item.status)}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenterRequests;