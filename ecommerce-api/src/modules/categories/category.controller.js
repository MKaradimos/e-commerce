import { asyncHandler } from "../../utils/asyncHandler.js";
import * as categoryService from "./category.service.js";

export const list = asyncHandler(async (_req, res) => {
  res.json(await categoryService.list());
});

export const getById = asyncHandler(async (req, res) => {
  res.json(await categoryService.getById(req.params.id));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(await categoryService.create(req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await categoryService.update(req.params.id, req.body));
});

export const remove = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  res.status(204).send();
});
