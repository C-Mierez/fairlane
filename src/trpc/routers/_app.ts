import { createTRPCRouter } from "../init";
import { testRouter } from "./test";

export const appRouter = createTRPCRouter({
    // Add routes
    test: testRouter,
});

// API Definition
export type AppRouter = typeof appRouter;
