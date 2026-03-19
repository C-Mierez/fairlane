import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { DEFAULT_PAGINATION_LIMIT } from "@lib/schema";
import LibraryView from "@modules/library/ui/views/library-view";

export default async function LibraryPage() {
    prefetch(
        trpc.library.getInfinite.infiniteQueryOptions(
            {
                limit: DEFAULT_PAGINATION_LIMIT,
            },
            {
                getNextPageParam: (lastPage) => (lastPage.docs.length > 0 ? lastPage.nextPage : undefined),
            },
        ),
    );

    return (
        <HydrateClient>
            <LibraryView />
        </HydrateClient>
    );
}
