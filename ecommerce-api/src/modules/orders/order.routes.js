import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { updateStatusSchema } from "./order.validators.js";
import * as ctrl from "./order.controller.js";

const router = Router();
router.use(authenticate);

/**
 * @openapi
 * /orders/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Checkout current cart - creates order & decrements stock atomically
 */
router.post("/checkout", ctrl.checkout);

/**
 * @openapi
 * /orders/me:
 *   get:
 *     tags: [Orders]
 *     summary: Get my order history
 */
router.get("/me", ctrl.myOrders);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: List all orders (admin only)
 */
router.get("/", authorize("ADMIN"), ctrl.allOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order details (owner or admin)
 */
router.get("/:id", ctrl.getOrder);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (admin only)
 */
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  validate(updateStatusSchema),
  ctrl.updateStatus
);

export default router;
