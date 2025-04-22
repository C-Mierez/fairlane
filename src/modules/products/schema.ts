import { z } from "zod";

export const GetByFiltersSchema = z.object({
    categorySlug: z.string().nullish(),
    minPrice: z.number().min(0).nullish(),
    maxPrice: z.number().nullish(),
});

export type GetByFiltersSchemaType = z.infer<typeof GetByFiltersSchema>;
