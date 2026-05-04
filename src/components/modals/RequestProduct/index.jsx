// import { useState } from "react";
// import { useCreateRequestMutation } from "../../../store/api/requestsApi";
// import SuccessModal from "../Success";
// import "./style.css";

// const RequestProductModal = ({ isOpen, onClose, product }) => {
//   const [createRequest, { isLoading }] = useCreateRequestMutation();
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [successData, setSuccessData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   if (!isOpen) return null;

//   const handleSubmit = async () => {
//     try {
//       setErrorMessage("");
//       if (!product?._id) {
//         setErrorMessage("Product not selected.");
//         return;
//       }
//       if (!startDate || !endDate) {
//         setErrorMessage("Please select both start and end dates.");
//         return;
//       }

//       const start = new Date(`${startDate}T00:00:00`);
//       const end = new Date(`${endDate}T00:00:00`);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       if (start < today || end < today) {
//         setErrorMessage("Dates cannot be in the past.");
//         return;
//       }

//       if (end <= start) {
//         setErrorMessage("End date must be after start date.");
//         return;
//       }

//       const response = await createRequest({
//         productId: product._id,
//         startDate,
//         endDate,
//       }).unwrap();

//       setSuccessData(response.data);
//     } catch (err) {
//       setErrorMessage(
//         err?.data?.message || "Failed to submit request. Please try again."
//       );
//     }
//   };

//   return (
//     <>
//       {/* REQUEST MODAL */}
//       {!successData && (
//         <div className="modal-overlay">
//           <div className="modal-box">

//             <h2>Request Product</h2>
//             <p><b>{product?.name}</b></p>
//             {errorMessage && <p className="modal-error">{errorMessage}</p>}

//             <div className="modal-form">

//               <label>Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />

//               <label>End Date</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />

//               <div className="modal-actions">
//                 <button onClick={onClose}>Cancel</button>
//                 <button onClick={handleSubmit} disabled={isLoading}>
//                   {isLoading ? "Submitting..." : "Confirm Request"}
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>
//       )}

//       {/* SUCCESS MODAL */}
//       {successData && (
//         <SuccessModal
//           data={successData}
//           product={product}
//           onClose={() => {
//             setSuccessData(null);
//             setStartDate("");
//             setEndDate("");
//             setErrorMessage("");
//             onClose();
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default RequestProductModal;

import { useState } from "react";
import { useCreateRequestMutation } from "../../../store/api/requestsApi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import SuccessModal from "../Success";
import "./style.css";

const RequestProductModal = ({ isOpen, onClose, product }) => {
  const [createRequest, { isLoading }] = useCreateRequestMutation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const today = dayjs().startOf("day");

  if (!isOpen) return null;

  const handleModalClose = () => {
    setStartDate(null);
    setEndDate(null);
    setErrorMessage("");
    setSuccessData(null);
    onClose();
  };

  // Derived: total days and price preview
  const totalDays =
    startDate && endDate ? endDate.diff(startDate, "day") : 0;
  const totalPrice = totalDays > 0 ? totalDays * (product?.pricePerDay || 0) : 0;

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!product?._id) {
      setErrorMessage("Product not selected.");
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates.");
      return;
    }

    if (startDate.isBefore(today)) {
      setErrorMessage("Start date cannot be in the past.");
      return;
    }

    if (!endDate.isAfter(startDate)) {
      setErrorMessage("End date must be after start date.");
      return;
    }

    try {
      const response = await createRequest({
        productId: product._id,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      }).unwrap();

      setSuccessData(response.data);
    } catch (err) {
      if (err?.status === "FETCH_ERROR") {
        setErrorMessage("Network error. Please try again.");
      } else {
        setErrorMessage(
          err?.data?.message || "Failed to submit request. Please try again."
        );
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        {/* REQUEST MODAL */}
        {!successData && (
          <div className="rq-overlay">
            <div className="rq-box">

              {/* Header */}
              <div className="rq-header">
                <div className="rq-header-text">
                  <p className="rq-label">Rental Request</p>
                  <h2 className="rq-title">{product?.name}</h2>
                </div>
                {product?.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="rq-product-thumb"
                  />
                )}
              </div>

              {/* Meta row */}
              <div className="rq-meta-row">
                <span className="rq-meta-item">📍 {product?.location}</span>
                <span className="rq-meta-item rq-price-tag">
                  Rs {product?.pricePerDay}/day
                </span>
              </div>

              <div className="rq-divider" />

              {/* Error */}
              {errorMessage && (
                <div className="rq-error">{errorMessage}</div>
              )}

              {/* Date pickers */}
              <div className="rq-dates">
                <div className="rq-date-field">
                  <p className="rq-field-label">Start Date</p>
                  <DatePicker
                    value={startDate}
                    onChange={(val) => {
                      setStartDate(val);
                      // reset end date if it's now invalid
                      if (endDate && val && !endDate.isAfter(val)) {
                        setEndDate(null);
                      }
                    }}
                    minDate={today}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: datePickerSx,
                      },
                    }}
                  />
                </div>

                <div className="rq-date-field">
                  <p className="rq-field-label">End Date</p>
                  <DatePicker
                    value={endDate}
                    onChange={(val) => setEndDate(val)}
                    minDate={startDate ? startDate.add(1, "day") : today}
                    disabled={!startDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: datePickerSx,
                      },
                    }}
                  />
                </div>
              </div>

              {/* Price preview */}
              {totalDays > 0 && (
                <div className="rq-summary">
                  <div className="rq-summary-row">
                    <span>Duration</span>
                    <span>{totalDays} day{totalDays > 1 ? "s" : ""}</span>
                  </div>
                  <div className="rq-summary-row total">
                    <span>Total Price</span>
                    <span>Rs {totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="rq-actions">
                <button className="rq-btn-cancel" onClick={handleModalClose}>
                  Cancel
                </button>
                <button
                  className="rq-btn-confirm"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Confirm Request"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* SUCCESS MODAL */}
        {successData && (
          <SuccessModal
            data={successData}
            product={product}
            onClose={handleModalClose}
          />
        )}
      </>
    </LocalizationProvider>
  );
};

// MUI DatePicker custom styling to match app theme
const datePickerSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    "& fieldset": { borderColor: "#e4e7ec" },
    "&:hover fieldset": { borderColor: "#1d4ed8" },
    "&.Mui-focused fieldset": {
      borderColor: "#1d4ed8",
      boxShadow: "0 0 0 3px rgba(29,78,216,0.1)",
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "#0f172a",
  },
};

export default RequestProductModal;