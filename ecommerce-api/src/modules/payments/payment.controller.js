import { asyncHandler } from "../../utils/asyncHandler.js";
import * as paymentService from "./payment.service.js";

export const payOrder = asyncHandler(async (req, res) => {
  res.json(await paymentService.payOrder(req.params.orderId, req.user.id));
});
