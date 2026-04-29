import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { addItemSchema, updateItemSchema } from "./cart.validators.js";
import * as ctrl from "./cart.controller.js";

const router = Router();
router.use(authenticate);

/**
 * @openapi
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: View current user's cart
 */
router.get("/", ctrl.getCart);

/**
 * @openapi
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 */
router.post("/items", validate(addItemSchema), ctrl.addItem);

/**
 * @openapi
 * /cart/items/{productId}:
 *   patch:
 *     tags: [Cart]
 *     summary: Update item quantity
 */
router.patch("/items/:productId", validate(updateItemSchema), ctrl.updateItem);

/**
 * @openapi
 * /cart/items/{productId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 */
router.delete("/items/:productId", ctrl.removeItem);

export default router;
