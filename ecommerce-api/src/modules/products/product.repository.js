import { prisma } from "../../config/prisma.js";

export const findMany = async (filters) => {
  const { q, categoryId, brand, minPrice, maxPrice, page, limit } = filters;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(brand && { brand: { equals: brand, mode: "insensitive" } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
};

export const findById = (id) =>
  prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

export const create = (data) => prisma.product.create({ data });
export const update = (id, data) => prisma.product.update({ where: { id }, data });
export const remove = (id) =>
  prisma.product.update({ where: { id }, data: { isActive: false } });
