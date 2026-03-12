import z from "zod";

export const RatingSchema = z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" });
export const DescriptionSchema = z.string().min(1, { message: "Description must be at least 1 character long" });

export const ReviewSchema = z.object({
    rating: RatingSchema,
    description: DescriptionSchema,
});

export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
