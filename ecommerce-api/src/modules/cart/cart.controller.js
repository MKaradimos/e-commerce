import { asyncHandler } from "../../utils/asyncHandler.js";
import * as cartService from "./cart.service.js";

export const getCart = asyncHandler(async (req, res) => {
  res.json(await cartService.getCart(req.user.id));
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  res.json(await cartService.addItem(req.user.id, productId, quantity));
});

export const updateItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  res.json(await cartService.updateItem(req.user.id, productId, quantity));
});

export const removeItem = asyncHandler(async (req, res) => {
  res.json(await cartService.removeItem(req.user.id, req.params.productId));
});
