import { z } from "zod";
import { SyncProductsInput } from "./SyncProductsInput";

const productSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string().min(1).max(255),
  price: z.number().int().positive()
});

export const SyncProductsInputValidator = z.object({
  products: z.array(productSchema)
}) satisfies z.ZodType<SyncProductsInput>;
