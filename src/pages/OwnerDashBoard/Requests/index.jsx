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

  const [loadingId, setLoadingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const handleAccept = async (id) => {
    setLoadingId(id);
    setActionError("");

    try {
      await acceptRequest(id).unwrap();
    } catch (err) {
      setActionError(err?.data?.message || "Failed to accept request. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    setLoadingId(id);
    setActionError("");

    try {
      await rejectRequest(id).unwrap();
    } catch (err) {
      setActionError(err?.data?.message || "Failed to reject request. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="requests-page">
      <h1>Requests</h1>

      {(isLoading || isFetching) && <p>Loading requests...</p>}

      {!isLoading && isError && (
        <div>
          <p className="error-text">{apiErrorMessage}</p>
          <button className="retry-btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && actionError && (
        <p className="error-text">{actionError}</p>
      )}

      {!isLoading && !isError && requests.length === 0 && (
        <p>No requests found</p>
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="requests-grid">
          {requests.map((item) => {
            const isProcessing = loadingId === item._id;

            const isDisabled =
              item.status === "accepted" || item.status === "rejected";

            return (
              <div className="request-card" key={item._id}>
                {/* Product Info */}
                <div className="product-info">
                  <img src={item.productId?.imageUrl} alt={item.productId?.name} />
                  <div>
                    <h3>{item.productId?.name}</h3>
                    <p>{item.productId?.location}</p>
                  </div>
                </div>

                {/* Renter Info */}
                <div className="renter-info">
                  <h4>Renter</h4>
                  <p>
                    <strong>Name:</strong> {item.renterId?.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {item.renterId?.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {item.renterId?.email}
                  </p>
                </div>

                {/* Price */}
                <div className="price">Total: Rs {item.totalPrice}</div>

                {/* Actions */}
                <div className="actions">
                  <button
                    className="accept"
                    type="button"
                    disabled={isDisabled || isProcessing}
                    onClick={() => handleAccept(item._id)}
                  >
                    {loadingId === item._id ? "Processing..." : "Accept"}
                  </button>

                  <button
                    className="reject"
                    type="button"
                    disabled={isDisabled || isProcessing}
                    onClick={() => handleReject(item._id)}
                  >
                    {loadingId === item._id ? "Processing..." : "Reject"}
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