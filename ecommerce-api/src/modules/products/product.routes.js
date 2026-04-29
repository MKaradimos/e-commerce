import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
} from "./product.validators.js";
import * as ctrl from "./product.controller.js";

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List products with search & filters
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated list }
 */
router.get("/", validate(listProductsSchema, "query"), ctrl.list);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product details
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get("/:id", ctrl.getById);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create product (admin only)
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createProductSchema),
  ctrl.create
);

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Update product (admin only)
 */
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateProductSchema),
  ctrl.update
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Soft-delete product (admin only)
 */
router.delete("/:id", authenticate, authorize("ADMIN"), ctrl.remove);

export default router;
