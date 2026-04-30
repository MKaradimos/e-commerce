import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

const ensureCart = async (userId) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });
  return cart;
};

export const getCart = async (userId) => {
  const cart = await ensureCart(userId);
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });

  const total = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0
  );

  return { id: cart.id, items, total: total.toFixed(2) };
};

export const addItem = async (userId, productId, quantity) => {
  if (quantity <= 0) throw new ApiError(400, "Quantity must be positive");

  const cart = await ensureCart(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
  });

  return getCart(userId);
};

export const updateItem = async (userId, productId, quantity) => {
  if (quantity <= 0) throw new ApiError(400, "Use remove endpoint to delete");

  const cart = await ensureCart(userId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

  await prisma.cartItem
    .update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    })
    .catch(() => {
      throw new ApiError(404, "Cart item not found");
    });
  return getCart(userId);
};

export const removeItem = async (userId, productId) => {
  const cart = await ensureCart(userId);
  await prisma.cartItem
    .delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    })
    .catch(() => {
      throw new ApiError(404, "Cart item not found");
    });
  return getCart(userId);
};
