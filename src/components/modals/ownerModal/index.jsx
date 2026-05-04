import { useGetUserByIdQuery } from "../../../store/api/userApi";
import "./style.css";

const OwnerModal = ({ ownerId, product, isOpen, onClose }) => {
  const shouldFetchOwner = isOpen && Boolean(ownerId);
  const { data, isLoading, isFetching, isError, error } = useGetUserByIdQuery(
    ownerId,
    { skip: !shouldFetchOwner }
  );

  const owner = data?.success ? data.user : null;
  const loading = isLoading || isFetching;
  const errorMessage = isError
    ? error?.data?.message || "Failed to load owner"
    : "";

  if (!isOpen) return null;

  // 📱 WhatsApp message builder
  const getWhatsAppMessage = () => {
    if (!product || !owner) return "";

    return `Hello ${owner.name},

I am interested in your product:

📦 Product: ${product.name}
💰 Price per day: Rs ${product.pricePerDay}
📍 Location: ${product.location}

I want to get more information about this product.`;
  };

  const whatsappPhone = owner?.phone ? owner.phone.replace(/\D/g, "") : "";

  const whatsappLink = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        getWhatsAppMessage()
      )}`
    : "#";

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2>Owner Details</h2>

        {/* LOADING */}
        {loading && <p className="modal-subtle">Loading owner...</p>}

        {/* ERROR */}
        {errorMessage && <p className="modal-error">{errorMessage}</p>}

        {/* OWNER INFO */}
        {owner && (
          <div className="owner-card">

            <div className="owner-row">
              <b>Name:</b> {owner.name}
            </div>

            <div className="owner-row">
              <b>Email:</b> {owner.email}
            </div>

            <div className="owner-row">
              <b>Phone:</b> {owner.phone}
            </div>

            <div className="owner-row">
              <b>Role:</b> {owner.role}
            </div>

            <div className="owner-row">
              <b>Joined:</b>{" "}
              {new Date(owner.createdAt).toLocaleDateString()}
            </div>

          </div>
        )}

        {/* WHATSAPP BUTTON */}
        {owner && product && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            Chat on WhatsApp
          </a>
        )}

        {/* CLOSE */}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
};

export default OwnerModal;