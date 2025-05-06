import type { Sort, Where } from "payload";

import type { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { GetByFiltersSchema } from "../schema";

export const productsRouter = createTRPCRouter({
    getAll: baseProcedure.query(async ({ ctx }) => {
        const data = await ctx.payload.find({
            collection: "products",
            depth: 1, // Get the Category data as well
            sort: "name",
        });

        return data;
    }),

    getInfiniteByFilters: baseProcedure.input(GetByFiltersSchema).query(async ({ ctx, input }) => {
        const where: Where = {};
        let sort: Sort = "-createdAt";

        if (input.sort) {
            switch (input.sort) {
                case "trending":
                    sort = "-createdAt";
                    break;
                case "price_asc":
                    sort = "price";
                    break;
                case "price_desc":
                    sort = "-price";
                    break;
                case "name_asc":
                    sort = "name";
                    break;
                case "name_desc":
                    sort = "-name";
                    break;
            }
        }

        if (input.minPrice && input.maxPrice) {
            where["price"] = {
                greater_than_equal: input.minPrice,
                less_than_equal: input.maxPrice,
            };
        } else if (input.minPrice) {
            where["price"] = {
                greater_than_equal: input.minPrice,
            };
        } else if (input.maxPrice) {
            where["price"] = {
                less_than_equal: input.maxPrice,
            };
        }

        if (input.tags && input.tags.length > 0) {
            where["tags.name"] = {
                in: input.tags,
            };
        }

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

            where["category.slug"] = {
                in: [input.categorySlug, ...childrenSlugs],
            };
        }

        const data = await ctx.payload.find({
            collection: "products",
            depth: 2, // Get the Category, Tenant, Media data as well
            where,
            sort,
            page: input.cursor,
            limit: input.limit,
        });

        return {
            ...data,
            docs: data.docs.map((doc) => ({
                ...doc,
                image: doc.image as Media | null, // Cast is possible because query has depth 2
                tenant: doc.tenant as Tenant & { image: Media | null }, // Cast is possible because query has depth 2 and Tenant is required
            })),
        };
    }),
});
