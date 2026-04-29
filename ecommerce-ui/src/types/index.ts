export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: string;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: string;
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  provider: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment | null;
}

export interface ProductFilters {
  q?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}
