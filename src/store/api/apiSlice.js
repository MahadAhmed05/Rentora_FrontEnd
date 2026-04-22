import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../config/env";
import { authStorage } from "../../utils/storage";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiBaseUrl,
    prepareHeaders: (headers) => {
      const token = authStorage.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Requests", "Bookings", "MyProducts"],
  endpoints: () => ({}),
});
