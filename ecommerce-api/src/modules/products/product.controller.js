import { asyncHandler } from "../../utils/asyncHandler.js";
import * as productService from "./product.service.js";

export const list = asyncHandler(async (req, res) => {
  res.json(await productService.list(req.query));
});

export const getById = asyncHandler(async (req, res) => {
  res.json(await productService.getById(req.params.id));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await productService.create(req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await productService.update(req.params.id, req.body));
});

export const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).send();
});
