import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  brand: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().uuid(),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsSchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
