// import { useGetMyRequestsQuery } from "../../store/api/requestsApi";
// import "./style.css";

// const RenterRequests = () => {
//   const { data, isLoading, isFetching, isError, error, refetch } = useGetMyRequestsQuery();
//   const requests = Array.isArray(data?.data) ? data.data : [];
//   const apiErrorMessage =
//     error?.data?.message || "Failed to load your requests. Please try again.";

//   const getStatusClass = (status) => {
//     if (status === "pending") return "pending";
//     if (status === "accepted") return "accepted";
//     if (status === "rejected") return "rejected";
//     return "";
//   };

//   return (
//     <div className="renter-requests-page">
//       <h1>My Requests</h1>

//       {(isLoading || isFetching) && <p>Loading requests...</p>}

//       {!isLoading && isError && (
//         <div>
//           <p className="error-text">{apiErrorMessage}</p>
//           <button className="retry-btn" onClick={() => refetch()}>
//             Retry
//           </button>
//         </div>
//       )}

//       {!isLoading && !isError && requests.length === 0 && <p>No requests found</p>}

//       {!isLoading && !isError && requests.length > 0 && (
//         <div className="request-grid">
//           {requests.map((item) => (
//             <div className="request-card" key={item._id}>
//               {/* Product Info */}
//               <div className="product-section">
//                 <img src={item.productId?.imageUrl} alt={item.productId?.name} />

//                 <div>
//                   <h3>{item.productId?.name}</h3>
//                   <p>{item.productId?.location}</p>
//                   <p>Rs {item.productId?.pricePerDay}/day</p>
//                 </div>
//               </div>

//               {/* Pricing */}
//               <div className="price">
//                 Total: Rs {item.totalPrice}
//               </div>

//               {/* Status */}
//               <div className={`status ${getStatusClass(item.status)}`}>
//                 {item.status}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RenterRequests;


import { useGetMyRequestsQuery } from "../../store/api/requestsApi";
import "./style.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RenterRequests = () => {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMyRequestsQuery();

  const requests = Array.isArray(data?.data) ? data.data : [];
  const apiErrorMessage =
    error?.data?.message || "Failed to load your requests. Please try again.";

  return (
    <div className="rr-page">
      <div className="rr-header">
        <h1>My Requests</h1>
        <span className="rr-count">
          {!isLoading && !isError ? `${requests.length} request${requests.length !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      {/* Loading skeletons */}
      {(isLoading || isFetching) && (
        <div className="rr-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="rr-card skeleton" key={i}>
              <div className="rr-skeleton-top">
                <div className="rr-skeleton-thumb" />
                <div className="rr-skeleton-lines">
                  <div className="rr-skeleton-line wide" />
                  <div className="rr-skeleton-line" />
                  <div className="rr-skeleton-line short" />
                </div>
              </div>
              <div className="rr-skeleton-line" />
              <div className="rr-skeleton-line short" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="rr-state error-state">
          <p>{apiErrorMessage}</p>
          <button className="rr-retry-btn" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isFetching && !isError && requests.length === 0 && (
        <div className="rr-state">
          <div className="rr-empty-icon">📭</div>
          <p>No requests yet.</p>
          <span>Go to the dashboard to request a product.</span>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isFetching && !isError && requests.length > 0 && (
        <div className="rr-grid">
          {requests.map((item) => (
            <div className="rr-card" key={item._id}>

              {/* Product row */}
              <div className="rr-product-row">
                <img
                  src={item.productId?.imageUrl}
                  alt={item.productId?.name}
                  className="rr-product-img"
                />
                <div className="rr-product-info">
                  <h3>{item.productId?.name}</h3>
                  <span className="rr-location">📍 {item.productId?.location}</span>
                  <span className="rr-per-day">Rs {item.productId?.pricePerDay}/day</span>
                </div>
                <span className={`rr-status ${item.status}`}>
                  {item.status}
                </span>
              </div>

              <div className="rr-divider" />

              {/* Dates + price */}
              <div className="rr-details">
                <div className="rr-detail-item">
                  <span className="rr-detail-label">Start Date</span>
                  <span className="rr-detail-value">{formatDate(item.startDate)}</span>
                </div>
                <div className="rr-detail-item">
                  <span className="rr-detail-label">End Date</span>
                  <span className="rr-detail-value">{formatDate(item.endDate)}</span>
                </div>
                <div className="rr-detail-item">
                  <span className="rr-detail-label">Total Price</span>
                  <span className="rr-detail-value accent">Rs {item.totalPrice}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenterRequests;