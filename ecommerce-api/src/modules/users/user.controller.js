import { asyncHandler } from "../../utils/asyncHandler.js";
import * as userService from "./user.service.js";

export const getMe = asyncHandler(async (req, res) => {
  res.json(await userService.getProfile(req.user.id));
});

export const updateMe = asyncHandler(async (req, res) => {
  res.json(await userService.updateProfile(req.user.id, req.body));
});

export const listAll = asyncHandler(async (_req, res) => {
  res.json(await userService.listAll());
});
