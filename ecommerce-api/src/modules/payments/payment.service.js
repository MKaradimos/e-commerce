import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const payOrder = async (orderId, userId) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new ApiError(404, "Order not found");
    if (order.userId !== userId) throw new ApiError(403, "Forbidden");
    if (order.status !== "PENDING") {
      throw new ApiError(400, `Cannot pay an order in status ${order.status}`);
    }

    await tx.payment.update({
      where: { orderId },
      data: { status: "COMPLETED" },
    });

    return tx.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
      include: { payment: true, items: true },
    });
  });
};
