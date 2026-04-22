import { apiSlice } from "./apiSlice";

const buildProductsQueryParams = (params = {}) => {
  const cleaned = Object.entries(params).reduce((acc, [key, value]) => {
    if (value === "" || value === undefined || value === null) return acc;
    acc[key] = value;
    return acc;
  }, {});

  return cleaned;
};

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: buildProductsQueryParams(params),
      }),
      providesTags: ["Products"],
    }),
    getMyProducts: builder.query({
      query: () => ({
        url: "/products/my",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery, useGetMyProductsQuery, useAddProductMutation } = productsApi;
