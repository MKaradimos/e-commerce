import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import orderRoutes from "../modules/orders/order.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

export default router;
