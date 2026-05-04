// import "../RequestProduct/style.css";

// const SuccessModal = ({ data, product, onClose }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-box success">

//         <h2>🎉 Request Submitted</h2>

//         <div className="success-content">
//           <p><b>Product:</b> {product?.name}</p>
//           <p><b>Start Date:</b> {data.startDate}</p>
//           <p><b>End Date:</b> {data.endDate}</p>
//           <p><b>Total Price:</b> Rs {data.totalPrice}</p>
//           <p><b>Status:</b> {data.status}</p>
//         </div>

//         <button onClick={onClose}>
//           Close
//         </button>

//       </div>
//     </div>
//   );
// };

// export default SuccessModal;


import "./style.css";

const SuccessModal = ({ data, product, onClose }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="sc-overlay">
      <div className="sc-box">

        {/* Animated checkmark */}
        <div className="sc-icon-wrapper">
          <div className="sc-circle">
            <svg className="sc-check" viewBox="0 0 52 52">
              <circle className="sc-circle-bg" cx="26" cy="26" r="25" fill="none" />
              <path className="sc-checkmark" fill="none" d="M14 27l8 8 16-16" />
            </svg>
          </div>
        </div>

        <h2 className="sc-title">Request Submitted!</h2>
        <p className="sc-subtitle">
          Your rental request is pending owner approval.
        </p>

        {/* Product row */}
        <div className="sc-product-row">
          {product?.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="sc-product-img" />
          )}
          <div>
            <p className="sc-product-name">{product?.name}</p>
            <p className="sc-product-location">📍 {product?.location}</p>
          </div>
        </div>

        <div className="sc-divider" />

        {/* Details grid */}
        <div className="sc-details">
          <div className="sc-detail-item">
            <span className="sc-detail-label">Start Date</span>
            <span className="sc-detail-value">{formatDate(data?.startDate)}</span>
          </div>
          <div className="sc-detail-item">
            <span className="sc-detail-label">End Date</span>
            <span className="sc-detail-value">{formatDate(data?.endDate)}</span>
          </div>
          <div className="sc-detail-item">
            <span className="sc-detail-label">Total Price</span>
            <span className="sc-detail-value accent">Rs {data?.totalPrice}</span>
          </div>
          <div className="sc-detail-item">
            <span className="sc-detail-label">Status</span>
            <span className="sc-status-chip">{data?.status}</span>
          </div>
        </div>

        <button className="sc-btn-close" onClick={onClose}>
          Done
        </button>

      </div>
    </div>
  );
};

export default SuccessModal;