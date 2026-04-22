import { useState } from "react";
import { useAddProductMutation } from "../../../store/api/productsApi";
import { env } from "../../../config/env";
import "./style.css";

const CATEGORY_OPTIONS = ["Electronics", "Makeup", "Others"];

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    description: "",
    pricePerDay: "",
    location: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage("");
  };

  const getClientValidationError = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!CATEGORY_OPTIONS.includes(form.category)) return "Please select a valid category.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.location.trim()) return "Location is required.";

    const price = Number(form.pricePerDay);
    if (!Number.isFinite(price) || price <= 0) return "Price per day must be a number greater than 0.";

    if (!imageFile) return "Please select an image.";

    return "";
  };

  const formatServerValidation = (err) => {
    const msg = err?.data?.message;
    const errors = err?.data?.errors;

    if (typeof errors === "string") return errors;
    if (Array.isArray(errors) && errors.length) return errors.join("\n");
    if (errors && typeof errors === "object") {
      // common shapes: { field: "msg" } or { field: ["msg1","msg2"] }
      return Object.entries(errors)
        .map(([key, value]) => {
          if (Array.isArray(value)) return `${key}: ${value.join(", ")}`;
          return `${key}: ${String(value)}`;
        })
        .join("\n");
    }

    return msg || "";
  };

  const uploadImageToCloudinary = async () => {
    const CLOUD_NAME = env.cloudinaryCloudName;
    const UPLOAD_PRESET = env.cloudinaryUploadPreset;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary config missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.");
    }

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    if (!res.ok) {
      throw new Error("Image upload failed. Please try again.");
    }

    const result = await res.json();
    if (!result?.secure_url) {
      throw new Error("Cloudinary did not return image URL.");
    }
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const clientError = getClientValidationError();
    if (clientError) {
      setErrorMessage(clientError);
      return;
    }

    try {
      setStep("Uploading image...");
      const imageUrl = await uploadImageToCloudinary();

      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        pricePerDay: Number(form.pricePerDay),
        location: form.location.trim(),
        imageUrl,
      };

      setStep("Saving product...");
      await addProduct(payload).unwrap();
      onSuccess?.();
      onClose();
    } catch (err) {
      const detailed = formatServerValidation(err);
      setErrorMessage(
        detailed || err?.data?.message || err?.message || "Validation failed. Please check fields and try again."
      );
    } finally {
      setStep("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Product</h2>
        {errorMessage && <p className="modal-error">{errorMessage}</p>}
        {step && <p className="modal-subtle">{step}</p>}

        <form onSubmit={handleSubmit} className="modal-form">

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select name="category" value={form.category} onChange={handleChange}>
            <option value="Electronics">Electronics</option>
            <option value="Makeup">Makeup</option>
            <option value="Others">Others</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="pricePerDay"
            placeholder="Price per day"
            value={form.pricePerDay}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] || null);
              setErrorMessage("");
            }}
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;