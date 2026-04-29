import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import * as ctrl from "./payment.controller.js";

const router = Router();
router.use(authenticate);

/**
 * @openapi
 * /payments/{orderId}:
 *   post:
 *     tags: [Payments]
 *     summary: Mock payment - sets order to PAID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 */
router.post("/:orderId", ctrl.payOrder);

export default router;
