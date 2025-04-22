import { authRouter } from "@modules/auth/server/procedures";
import { categoriesRouter } from "@modules/categories/server/procedures";
import { productsRouter } from "@modules/products/server/procedures";

import { createTRPCRouter } from "../init";
import { testRouter } from "./test";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    products: productsRouter,
    categories: categoriesRouter,
    // Add routes
    test: testRouter,
});

// API Definition
export type AppRouter = typeof appRouter;
