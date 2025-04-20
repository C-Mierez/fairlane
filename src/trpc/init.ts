import { cache } from "react";

import superjson from "superjson";
import { ZodError } from "zod";

import { initTRPC } from "@trpc/server";
import { getPayload } from "@lib/server/payload";

export const createTRPCContext = cache(async () => {
    // Add payload instance to context
    const payload = await getPayload();

    return {
        payload,
    };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;

// TODO Authed procedure
// export const authedProcedure = t.procedure.use(async (opts) => {
//     return opts.next({})
// })
