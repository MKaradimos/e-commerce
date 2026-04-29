import * as repo from "./product.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export const list = (filters) => repo.findMany(filters);

export const getById = async (id) => {
  const product = await repo.findById(id);
  if (!product || !product.isActive) throw new ApiError(404, "Product not found");
  return product;
};

export const create = (data) => repo.create(data);

export const update = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

export const remove = async (id) => {
  await getById(id);
  return repo.remove(id);
};
