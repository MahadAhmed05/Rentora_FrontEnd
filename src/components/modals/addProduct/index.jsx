import { useState, useEffect } from "react";
import { useAddProductMutation } from "../../../store/api/productsApi";
import { env } from "../../../config/env";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PRODUCT_CATEGORIES, PRODUCT_LOCATIONS } from "../../../constants";
import { generateProductDescription } from "../../../services/openrouter";
import "./style.css";

// 🔥 Zod Schema
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  description: z.string().min(5, "Description is required"),
  pricePerDay: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than 0"),
  location: z.enum(PRODUCT_LOCATIONS, {
    errorMap: () => ({ message: "Please select a valid location" }),
  }),
});

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [addProduct, { isLoading }] = useAddProductMutation();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [apiError, setApiError] = useState("");
  const [step, setStep] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // RHF
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "Electronics",
      location: "Karachi",
    },
  });

  const watchedName = watch("name");
  const watchedCategory = watch("category");

  // 🧹 Revoke object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 🔒 Prevent background scroll when modal is open   <-- ADD HERE
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 📸 Image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ❌ Remove selected image
  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
  };

  // 🤖 AI Description Generator
  const handleGenerateDescription = async () => {
    if (!watchedName || watchedName.trim().length < 2) {
      setApiError("Please enter a product name first.");
      return;
    }

    setApiError("");
    setIsGenerating(true);

    try {
      const description = await generateProductDescription(
        watchedName,
        watchedCategory,
      );
      setValue("description", description, { shouldValidate: true });
    } catch (err) {
      setApiError(err.message || "Failed to generate description.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ☁️ Cloudinary upload
  const uploadImageToCloudinary = async () => {
    const CLOUD_NAME = env.cloudinaryCloudName;
    const UPLOAD_PRESET = env.cloudinaryUploadPreset;

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data },
    );

    if (!res.ok) throw new Error("Image upload failed. Please try again.");

    const result = await res.json();
    if (!result.secure_url)
      throw new Error("Image upload failed. Please try again.");

    return result.secure_url;
    // // transform the URL before returning
    // return result.secure_url.replace(
    //   "/upload/",
    //   "/upload/w_800,f_auto,q_auto/",
    // );
  };

  // 🚀 Submit
  const onSubmit = async (data) => {
    setApiError("");

    if (!imageFile) {
      setApiError("Please select an image");
      return;
    }

    try {
      setStep("Uploading image...");
      const imageUrl = await uploadImageToCloudinary();

      setStep("Saving product...");

      const payload = {
        ...data,
        pricePerDay: Number(data.pricePerDay),
        imageUrl,
      };

      await addProduct(payload).unwrap();

      reset();
      handleRemoveImage();
      onSuccess?.();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else if (err?.status === "FETCH_ERROR") {
        setApiError("Network error. Please try again.");
      } else {
        setApiError(err?.data?.message || "Something went wrong.");
      }
    } finally {
      setStep("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Product</h2>

        {apiError && <p className="modal-error">{apiError}</p>}
        {step && <p className="modal-subtle">{step}</p>}

        <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <input placeholder="Product Name" {...register("name")} />
          <span className="field-error">{errors.name?.message}</span>

          {/* CATEGORY */}
          <select {...register("category")}>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* DESCRIPTION */}
          <div className="description-header">
            <label className="description-label">Description</label>
            <button
              type="button"
              className="ai-generate-btn"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "✨ Generate with AI"}
            </button>
          </div>
          <textarea
            placeholder="Write a description or generate with AI..."
            {...register("description")}
          />
          <span className="field-error">{errors.description?.message}</span>

          {/* PRICE */}
          <input
            type="number"
            placeholder="Price per day (PKR)"
            {...register("pricePerDay", { valueAsNumber: true })}
          />
          <span className="field-error">{errors.pricePerDay?.message}</span>

          {/* LOCATION */}
          <select {...register("location")}>
            {PRODUCT_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <span className="field-error">{errors.location?.message}</span>

          {/* IMAGE */}
          {!preview ? (
            <label className="custum-file-upload">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10 1L3 8v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H10z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="text">
                <span>Click to upload image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <div className="preview-container">
              <img src={preview} className="preview-img" alt="preview" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}

          {/* ACTIONS */}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
