import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const checkout = async (userId) => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // 1. Re-check stock inside transaction (race-condition safe)
    for (const item of cart.items) {
      const fresh = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, isActive: true, name: true },
      });
      if (!fresh || !fresh.isActive) {
        throw new ApiError(400, `Product ${item.product.name} no longer available`);
      }
      if (fresh.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${fresh.name}`);
      }
    }

    // 2. Calculate total
    const totalAmount = cart.items.reduce(
      (sum, i) => sum + Number(i.product.price) * i.quantity,
      0
    );

    // 3. Create order with snapshot data
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            productName: i.product.name,
            unitPrice: i.product.price,
            quantity: i.quantity,
          })),
        },
        payment: {
          create: { amount: totalAmount, status: "PENDING", provider: "MOCK" },
        },
      },
      include: { items: true, payment: true },
    });

    // 4. Decrement stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 5. Empty cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });
};

export const listMyOrders = (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: { items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });

export const listAllOrders = () =>
  prisma.order.findMany({
    include: {
      items: true,
      payment: true,
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

export const getOrder = async (orderId, user) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payment: true },
  });
  if (!order) throw new ApiError(404, "Order not found");
  if (user.role !== "ADMIN" && order.userId !== user.id) {
    throw new ApiError(403, "Forbidden");
  }
  return order;
};

export const updateStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError(404, "Order not found");
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};
