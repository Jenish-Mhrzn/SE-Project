import { z } from "zod";

// Create product schema
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than zero"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  stock: z.number().nonnegative("Stock must be zero or greater").default(0),
  releaseDate: z.string().datetime().optional(), // ISO datetime format
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Update product schema

export const updateProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string(),
  price: z.number().positive(),
  category: z.string().min(1).max(50),
  stock: z.number().nonnegative(),
  releaseDate: z.string().datetime(),
}).partial(); // <-- makes all fields optional


// Product params schema for validating :id in routes
export const productParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
});

// Types
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
