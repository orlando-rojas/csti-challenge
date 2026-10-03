import { z } from "zod";

export const ratingSchema = z.object({
  rate: z.number(),
  count: z.number().int().nonnegative(),
});

export const fakeStoreProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string(),
  category: z.string().min(1),
  image: z.url(),
  rating: ratingSchema,
});

export const fakeStoreProductListSchema = z.array(fakeStoreProductSchema);
export const categoryListSchema = z.array(z.string().min(1));

export type FakeStoreProduct = z.infer<typeof fakeStoreProductSchema>;
