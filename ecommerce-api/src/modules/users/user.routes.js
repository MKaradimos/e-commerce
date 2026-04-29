import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { updateProfileSchema } from "./user.validators.js";
import * as ctrl from "./user.controller.js";

const router = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     responses:
 *       200: { description: Current user }
 */
router.get("/me", authenticate, ctrl.getMe);

/**
 * @openapi
 * /users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update current user profile
 */
router.patch("/me", authenticate, validate(updateProfileSchema), ctrl.updateMe);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 */
router.get("/", authenticate, authorize("ADMIN"), ctrl.listAll);

export default router;
