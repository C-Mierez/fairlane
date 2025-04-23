import { z } from "zod";

export const DEFAULT_PAGINATION_LIMIT = 10;

// This can be reused in different infinite-query endpoints due to the use of Payload
// Instead of having a cursor specific to the query, through Payload we can just
// have a cursor that corresponds to a particular "page"
export const PaginationSchema = z.object({
    cursor: z.number().default(1),
    limit: z.number().default(DEFAULT_PAGINATION_LIMIT),
});
