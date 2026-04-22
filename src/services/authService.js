import { API_ENDPOINTS } from "../constants";
import { apiRequest } from "./apiClient";

export const authService = {
  register: async (payload) => {
    return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: payload,
    });
  },
  login: async (payload) => {
    return apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: payload,
    });
  },
};
