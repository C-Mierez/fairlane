import { z } from "zod";

export const ProductSortSchema = z.enum(["trending", "price_asc", "price_desc", "name_asc", "name_desc"]);

export const GetByFiltersSchema = z.object({
    categorySlug: z.string().nullish(),
    minPrice: z.number().min(0).nullish(),
    maxPrice: z.number().nullish(),
    tags: z.array(z.string()).nullish(),
    sort: ProductSortSchema.default("trending"),
});

export type GetByFiltersSchemaType = z.infer<typeof GetByFiltersSchema>;

export type ProductSortType = z.infer<typeof ProductSortSchema>;
