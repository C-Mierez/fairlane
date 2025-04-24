import type { UseSuspenseInfiniteQueryResult } from "@tanstack/react-query";
import { Button } from "./ui/button";

interface Props {
    label?: string;
    fetchNextPage: UseSuspenseInfiniteQueryResult<unknown, unknown>["fetchNextPage"];
    hasNextPage: UseSuspenseInfiniteQueryResult["hasNextPage"];
    isFetchingNextPage: UseSuspenseInfiniteQueryResult["isFetchingNextPage"];
}

export default function InfiniteLoader({ label, fetchNextPage, hasNextPage, isFetchingNextPage }: Props) {
    return (
        <div className="flex w-full items-center justify-center py-4">
            {hasNextPage && (
                <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {!!label ? label : "Load more"}
                </Button>
            )}
        </div>
    );
}
