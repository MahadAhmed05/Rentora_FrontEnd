import { useState } from "react";
import { useCreateRequestMutation } from "../../../store/api/requestsApi";
import SuccessModal from "../Success";
import "./style.css";

const RequestProductModal = ({ isOpen, onClose, product }) => {
  const [createRequest, { isLoading }] = useCreateRequestMutation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      if (!product?._id) {
        setErrorMessage("Product not selected.");
        return;
      }
      if (!startDate || !endDate) {
        setErrorMessage("Please select both start and end dates.");
        return;
      }

      const start = new Date(`${startDate}T00:00:00`);
      const end = new Date(`${endDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today || end < today) {
        setErrorMessage("Dates cannot be in the past.");
        return;
      }

      if (end <= start) {
        setErrorMessage("End date must be after start date.");
        return;
      }

      const response = await createRequest({
        productId: product._id,
        startDate,
        endDate,
      }).unwrap();

      setSuccessData(response.data);
    } catch (err) {
      setErrorMessage(
        err?.data?.message || "Failed to submit request. Please try again."
      );
    }
  };

  return (
    <>
      {/* REQUEST MODAL */}
      {!successData && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>Request Product</h2>
            <p><b>{product?.name}</b></p>
            {errorMessage && <p className="modal-error">{errorMessage}</p>}

            <div className="modal-form">

              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <div className="modal-actions">
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Confirm Request"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {successData && (
        <SuccessModal
          data={successData}
          product={product}
          onClose={() => {
            setSuccessData(null);
            setStartDate("");
            setEndDate("");
            setErrorMessage("");
            onClose();
          }}
        />
      )}
    </>
  );
};

export default RequestProductModal;