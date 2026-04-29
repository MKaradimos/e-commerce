import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const list = () =>
  prisma.category.findMany({ orderBy: { name: "asc" } });

export const getById = async (id) => {
  const cat = await prisma.category.findUnique({
    where: { id },
    include: { products: { where: { isActive: true } } },
  });
  if (!cat) throw new ApiError(404, "Category not found");
  return cat;
};

export const create = (data) => prisma.category.create({ data });

export const update = async (id, data) => {
  await getById(id);
  return prisma.category.update({ where: { id }, data });
};

export const remove = async (id) => {
  await getById(id);
  return prisma.category.delete({ where: { id } });
};
