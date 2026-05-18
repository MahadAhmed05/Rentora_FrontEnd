import { toast } from "react-toastify";

export const showToast = (message, success = false) => {
  const baseOptions = {
    position: "bottom-center",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  if (success) {
    toast.success(message, baseOptions);
    return;
  }

  toast.error(message, {
    ...baseOptions,
    autoClose: 15000,
  });
};
