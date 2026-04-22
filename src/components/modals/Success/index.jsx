import "../RequestProduct/style.css";

const SuccessModal = ({ data, product, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box success">

        <h2>🎉 Request Submitted</h2>

        <div className="success-content">
          <p><b>Product:</b> {product?.name}</p>
          <p><b>Start Date:</b> {data.startDate}</p>
          <p><b>End Date:</b> {data.endDate}</p>
          <p><b>Total Price:</b> Rs {data.totalPrice}</p>
          <p><b>Status:</b> {data.status}</p>
        </div>

        <button onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
};

export default SuccessModal;