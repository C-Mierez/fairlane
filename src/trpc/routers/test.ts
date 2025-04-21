import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";

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
});
