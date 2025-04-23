import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { PaginationSchema } from "@lib/schema";

export const tagsRouter = createTRPCRouter({
    getInfinite: baseProcedure.input(PaginationSchema).query(async ({ ctx, input }) => {
        const data = await ctx.payload.find({
            collection: "tags",
            page: input.cursor,
            limit: input.limit,
        });

        return data;
    }),
});
