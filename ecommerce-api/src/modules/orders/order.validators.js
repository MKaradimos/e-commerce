import { z } from "zod";

export const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
});
