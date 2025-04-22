import type { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import type { Where } from "payload";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
    getAll: baseProcedure.query(async ({ ctx }) => {
        const data = await ctx.payload.find({
            collection: "products",
            depth: 1, // Get the Category data as well
            sort: "name",
        });

        return data;
    }),

    getByCategory: baseProcedure
        .input(
            z.object({
                categorySlug: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            let where: Where = {};

            if (input.categorySlug) {
                // Get the inputted category's children slugs, if any
                const queriedCategory = await ctx.payload.find({
                    collection: "categories",
                    where: {
                        slug: {
                            equals: input.categorySlug,
                        },
                    },
                    select: {
                        children: true,
                    },
                    depth: 1, // Populate the children
                    pagination: false,
                });

                if (queriedCategory.totalDocs === 0) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: `Category with slug ${input.categorySlug} not found`,
                    });
                }

                const existingCategory = queriedCategory.docs[0];
                let childrenSlugs: string[] = [];
                if (existingCategory && existingCategory.children) {
                    childrenSlugs =
                        existingCategory.children.docs?.map(
                            (child) => (child as Category).slug, // Casting is possible because query has depth 1
                        ) || [];
                }

                where = {
                    ["category.slug"]: {
                        in: [input.categorySlug, ...childrenSlugs],
                    },
                };
            }

            const data = await ctx.payload.find({
                collection: "products",
                depth: 1, // Get the Category data as well
                where,
                sort: "name",
            });

            return data;
        }),
});
