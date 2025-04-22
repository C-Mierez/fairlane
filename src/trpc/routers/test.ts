import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { baseProcedure, createTRPCRouter } from "../init";

export const testRouter = createTRPCRouter({
    hello: baseProcedure
        .input(
            z.object({
                name: z.string(),
            }),
        )
        .query(async ({ input }) => {
            if (input.name === "error") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "This is a test error",
                });
            }
            return { res: `Hello ${input.name}` };
        }),
    boolean: baseProcedure.input(z.object({ value: z.boolean() })).query(async ({ input }) => {
        // Simulate a delay of 4 seconds
        // await new Promise((resolve) => setTimeout(resolve, 4000));

        return { res: input.value };
    }),
});
