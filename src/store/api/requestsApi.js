import { apiSlice } from "./apiSlice";

export const requestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyRequests: builder.query({
      query: () => ({
        url: "/requests/my",
        method: "GET",
      }),
      providesTags: ["Requests"],
    }),
    getIncomingRequests: builder.query({
      query: () => ({
        url: "/requests/incoming",
        method: "GET",
      }),
      providesTags: ["Requests"],
    }),
    createRequest: builder.mutation({
      query: (body) => ({
        url: "/requests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Requests"],
    }),
    acceptRequest: builder.mutation({
      query: (id) => ({
        url: `/requests/${id}/accept`,
        method: "PUT",
      }),
      invalidatesTags: ["Requests", "Bookings", "Products", "MyProducts"],
    }),
    rejectRequest: builder.mutation({
      query: (id) => ({
        url: `/requests/${id}/reject`,
        method: "PUT",
      }),
      invalidatesTags: ["Requests"],
    }),
  }),
});

export const {
  useGetMyRequestsQuery,
  useGetIncomingRequestsQuery,
  useCreateRequestMutation,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} = requestsApi;
