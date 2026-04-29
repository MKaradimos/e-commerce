import { api } from "./client";
import type {
  AuthResponse,
  Cart,
  Category,
  Order,
  PaginatedProducts,
  Product,
  ProductFilters,
} from "@/types";

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
};

export const productsApi = {
  list: (filters: ProductFilters = {}) =>
    api
      .get<PaginatedProducts>("/products", { params: filters })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),
};

export const categoriesApi = {
  list: () => api.get<Category[]>("/categories").then((r) => r.data),
};

export const cartApi = {
  get: () => api.get<Cart>("/cart").then((r) => r.data),

  addItem: (productId: string, quantity: number) =>
    api
      .post<Cart>("/cart/items", { productId, quantity })
      .then((r) => r.data),

  updateItem: (productId: string, quantity: number) =>
    api
      .patch<Cart>(`/cart/items/${productId}`, { quantity })
      .then((r) => r.data),

  removeItem: (productId: string) =>
    api.delete<Cart>(`/cart/items/${productId}`).then((r) => r.data),
};

export const ordersApi = {
  checkout: () => api.post<Order>("/orders/checkout").then((r) => r.data),

  getById: (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data),

  myOrders: () => api.get<Order[]>("/orders/me").then((r) => r.data),
};

export const paymentsApi = {
  pay: (orderId: string) =>
    api.post<Order>(`/payments/${orderId}`).then((r) => r.data),
};
