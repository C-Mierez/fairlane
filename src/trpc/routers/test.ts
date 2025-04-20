import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../init";

export const testRouter = createTRPCRouter({
    hello: baseProcedure
        .input(
            z.object({
                name: z.string(),
            }),
        )
        .query(async ({ input }) => {
            return { res: `Hello ${input.name}` };
        }),
});
