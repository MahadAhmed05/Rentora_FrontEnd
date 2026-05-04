// import { useState } from "react";
// import {
//   useAcceptRequestMutation,
//   useGetIncomingRequestsQuery,
//   useRejectRequestMutation,
// } from "../../../store/api/requestsApi";
// import "./style.css";

// const Requests = () => {
//   const { data, isLoading, isFetching, isError, error, refetch } =
//     useGetIncomingRequestsQuery();
//   const [acceptRequest] = useAcceptRequestMutation();
//   const [rejectRequest] = useRejectRequestMutation();

//   const requests = Array.isArray(data?.data) ? data.data : [];

//   const apiErrorMessage =
//     error?.data?.message || "Failed to load incoming requests. Please try again.";

//   const [loadingId, setLoadingId] = useState(null);
//   const [actionError, setActionError] = useState("");

//   const handleAccept = async (id) => {
//     setLoadingId(id);
//     setActionError("");

//     try {
//       await acceptRequest(id).unwrap();
//     } catch (err) {
//       setActionError(err?.data?.message || "Failed to accept request. Please try again.");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleReject = async (id) => {
//     setLoadingId(id);
//     setActionError("");

//     try {
//       await rejectRequest(id).unwrap();
//     } catch (err) {
//       setActionError(err?.data?.message || "Failed to reject request. Please try again.");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div className="requests-page">
//       <h1>Requests</h1>

//       {(isLoading || isFetching) && <p>Loading requests...</p>}

//       {!isLoading && isError && (
//         <div>
//           <p className="error-text">{apiErrorMessage}</p>
//           <button className="retry-btn" onClick={() => refetch()}>
//             Retry
//           </button>
//         </div>
//       )}

//       {!isLoading && !isError && actionError && (
//         <p className="error-text">{actionError}</p>
//       )}

//       {!isLoading && !isError && requests.length === 0 && (
//         <p>No requests found</p>
//       )}

//       {!isLoading && !isError && requests.length > 0 && (
//         <div className="requests-grid">
//           {requests.map((item) => {
//             const isProcessing = loadingId === item._id;

//             const isDisabled =
//               item.status === "accepted" || item.status === "rejected";

//             return (
//               <div className="request-card" key={item._id}>
//                 {/* Product Info */}
//                 <div className="product-info">
//                   <img src={item.productId?.imageUrl} alt={item.productId?.name} />
//                   <div>
//                     <h3>{item.productId?.name}</h3>
//                     <p>{item.productId?.location}</p>
//                   </div>
//                 </div>

//                 {/* Renter Info */}
//                 <div className="renter-info">
//                   <h4>Renter</h4>
//                   <p>
//                     <strong>Name:</strong> {item.renterId?.name}
//                   </p>
//                   <p>
//                     <strong>Phone:</strong> {item.renterId?.phone}
//                   </p>
//                   <p>
//                     <strong>Email:</strong> {item.renterId?.email}
//                   </p>
//                 </div>

//                 {/* Price */}
//                 <div className="price">Total: Rs {item.totalPrice}</div>

//                 {/* Actions */}
//                 <div className="actions">
//                   <button
//                     className="accept"
//                     type="button"
//                     disabled={isDisabled || isProcessing}
//                     onClick={() => handleAccept(item._id)}
//                   >
//                     {loadingId === item._id ? "Processing..." : "Accept"}
//                   </button>

//                   <button
//                     className="reject"
//                     type="button"
//                     disabled={isDisabled || isProcessing}
//                     onClick={() => handleReject(item._id)}
//                   >
//                     {loadingId === item._id ? "Processing..." : "Reject"}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Requests;



import { useState } from "react";
import {
  useAcceptRequestMutation,
  useGetIncomingRequestsQuery,
  useRejectRequestMutation,
} from "../../../store/api/requestsApi";
import "./style.css";

const Requests = () => {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetIncomingRequestsQuery();
  const [acceptRequest] = useAcceptRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();

  const requests = Array.isArray(data?.data) ? data.data : [];
  const apiErrorMessage =
    error?.data?.message || "Failed to load incoming requests. Please try again.";

  // ✅ Per-card error tracking
  const [actionErrors, setActionErrors] = useState({});

  // ✅ Per-card, per-action loading tracking
  const [loadingAction, setLoadingAction] = useState({ id: null, type: null });

  const handleAccept = async (id) => {
    setLoadingAction({ id, type: "accept" });
    setActionErrors((prev) => ({ ...prev, [id]: "" }));

    try {
      await acceptRequest(id).unwrap();
    } catch (err) {
      setActionErrors((prev) => ({
        ...prev,
        [id]: err?.data?.message || "Failed to accept request. Please try again.",
      }));
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleReject = async (id) => {
    setLoadingAction({ id, type: "reject" });
    setActionErrors((prev) => ({ ...prev, [id]: "" }));

    try {
      await rejectRequest(id).unwrap();
    } catch (err) {
      setActionErrors((prev) => ({
        ...prev,
        [id]: err?.data?.message || "Failed to reject request. Please try again.",
      }));
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  return (
    <div className="requests-page">
      <h1>Incoming Requests</h1>

      {/* Loading skeleton */}
      {(isLoading || isFetching) && (
        <div className="requests-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="request-card skeleton" key={i}>
              <div className="skeleton-product">
                <div className="skeleton-thumb" />
                <div className="skeleton-lines">
                  <div className="skeleton-line wide" />
                  <div className="skeleton-line short" />
                </div>
              </div>
              <div className="skeleton-line" />
              <div className="skeleton-line wide" />
              <div className="skeleton-actions">
                <div className="skeleton-btn" />
                <div className="skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fetch error */}
      {!isLoading && isError && (
        <div className="state-message error-state">
          <p>{apiErrorMessage}</p>
          <button className="retry-btn" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isFetching && !isError && requests.length === 0 && (
        <div className="state-message">
          <p>No incoming requests yet.</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isFetching && !isError && requests.length > 0 && (
        <div className="requests-grid">
          {requests.map((item) => {
            const isProcessing = loadingAction.id === item._id;
            const isDisabled =
              item.status === "accepted" || item.status === "rejected";

            return (
              <div className="request-card" key={item._id}>

                {/* Product Info */}
                <div className="product-info">
                  <img
                    src={item.productId?.imageUrl}
                    alt={item.productId?.name}
                  />
                  <div className="product-info-text">
                    <h3>{item.productId?.name}</h3>
                    <span className="meta-location">📍 {item.productId?.location}</span>
                  </div>
                </div>

                <div className="divider" />

                {/* Renter Info */}
                <div className="renter-info">
                  <p className="section-label">Renter Details</p>
                  <div className="renter-row">
                    <span className="renter-avatar">
                      {item.renterId?.name?.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="renter-name">{item.renterId?.name}</p>
                      <p className="renter-contact">{item.renterId?.email}</p>
                      <p className="renter-contact">{item.renterId?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                {/* Price + Status */}
                <div className="price-status-row">
                  <span className="total-price">Rs {item.totalPrice}</span>
                  <span className={`status-chip ${item.status}`}>
                    {item.status}
                  </span>
                </div>

                {/* Per-card action error */}
                {actionErrors[item._id] && (
                  <p className="action-error">{actionErrors[item._id]}</p>
                )}

                {/* Actions */}
                <div className="card-actions">
                  <button
                    className="btn-accept"
                    type="button"
                    disabled={isDisabled || isProcessing}
                    onClick={() => handleAccept(item._id)}
                  >
                    {loadingAction.id === item._id && loadingAction.type === "accept"
                      ? "Accepting..."
                      : "Accept"}
                  </button>

                  <button
                    className="btn-reject"
                    type="button"
                    disabled={isDisabled || isProcessing}
                    onClick={() => handleReject(item._id)}
                  >
                    {loadingAction.id === item._id && loadingAction.type === "reject"
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;