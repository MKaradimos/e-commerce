import * as repo from "./user.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export const getProfile = async (userId) => {
  const user = await repo.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const updateProfile = (userId, data) => repo.updateById(userId, data);

export const listAll = () => repo.findAll();
