import { prisma } from "../../config/prisma.js";

const publicSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
};

export const findById = (id) =>
  prisma.user.findUnique({ where: { id }, select: publicSelect });

export const updateById = (id, data) =>
  prisma.user.update({ where: { id }, data, select: publicSelect });

export const findAll = () =>
  prisma.user.findMany({ select: publicSelect, orderBy: { createdAt: "desc" } });
