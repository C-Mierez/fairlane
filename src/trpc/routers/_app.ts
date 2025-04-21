import { categoriesRouter } from "@modules/categories/server/procedures";
import { createTRPCRouter } from "../init";
import { testRouter } from "./test";
import { authRouter } from "@modules/auth/server/procedures";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    categories: categoriesRouter,
    // Add routes
    test: testRouter,
});

// API Definition
export type AppRouter = typeof appRouter;
