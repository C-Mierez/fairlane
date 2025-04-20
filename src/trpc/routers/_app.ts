import { categoriesRouter } from "@modules/categories/server/procedures";
import { createTRPCRouter } from "../init";
import { testRouter } from "./test";

export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
    // Add routes
    test: testRouter,
});

// API Definition
export type AppRouter = typeof appRouter;
