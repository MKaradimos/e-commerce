import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validators.js";
import * as ctrl from "./category.controller.js";

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List all categories
 *     security: []
 */
router.get("/", ctrl.list);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category with its products
 *     security: []
 */
router.get("/:id", ctrl.getById);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createCategorySchema),
  ctrl.create
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateCategorySchema),
  ctrl.update
);

router.delete("/:id", authenticate, authorize("ADMIN"), ctrl.remove);

export default router;
