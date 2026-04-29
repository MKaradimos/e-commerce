import { asyncHandler } from "../../utils/asyncHandler.js";
import * as orderService from "./order.service.js";

export const checkout = asyncHandler(async (req, res) => {
  res.status(201).json(await orderService.checkout(req.user.id));
});

export const myOrders = asyncHandler(async (req, res) => {
  res.json(await orderService.listMyOrders(req.user.id));
});

export const allOrders = asyncHandler(async (_req, res) => {
  res.json(await orderService.listAllOrders());
});

export const getOrder = asyncHandler(async (req, res) => {
  res.json(await orderService.getOrder(req.params.id, req.user));
});

export const updateStatus = asyncHandler(async (req, res) => {
  res.json(await orderService.updateStatus(req.params.id, req.body.status));
});
