import { env } from "../config/env";
import { authStorage } from "../utils/storage";

const getApiErrorMessage = (status, fallbackMessage = "Request failed.") => {
  if (status === 401) return "Invalid email or password.";
  if (status === 409) return "Email already exists.";
  if (status === 422) return "Please check your input fields.";
  if (status >= 500) return "Server error. Please try again later.";
  return fallbackMessage;
};

export const apiRequest = async (path, { method = "GET", body, withAuth = false } = {}) => {
  const headers = { "Content-Type": "application/json" };

  if (withAuth) {
    const token = authStorage.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: json?.message || getApiErrorMessage(response.status),
        data: json,
      };
    }

    return { ok: true, status: response.status, data: json };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Check your internet or backend connection.",
      data: null,
    };
  }
};
