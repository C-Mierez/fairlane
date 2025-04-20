import type { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import type { RootCategory } from "../types";

export const categoriesRouter = createTRPCRouter({
    getAll: baseProcedure.query(async ({ ctx }) => {
        const categories = await ctx.payload.find({
            collection: "categories",
            where: {
                childOf: {
                    exists: false,
                },
            },
            depth: 1,
            pagination: false,
            sort: "name",
        });

        const flattenedCategories: RootCategory[] = categories.docs.map((doc) => ({
            ...doc,
            children: (doc.children?.docs ?? []).map((child) => ({
                ...(child as Category), // Depth is 1
                children: undefined,
            })),
        }));

        return {
            categories: flattenedCategories,
        };
    }),
});
