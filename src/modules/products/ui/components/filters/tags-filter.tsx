"use client";

import { useTRPC } from "@/trpc/client";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import SuspenseWithError from "@components/utils/suspended";
import { DEFAULT_PAGINATION_LIMIT } from "@lib/schema";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

interface Props {
    tags: string[] | null;
    onTagsChange: (value: string[] | null) => void;
}

export default function TagsFilter(props: Props) {
    return (
        <SuspenseWithError>
            <TagsFilterSuspense {...props} />
        </SuspenseWithError>
    );
}

function TagsFilterSuspense({ tags, onTagsChange }: Props) {
    const trpc = useTRPC();
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
        trpc.tags.getInfinite.infiniteQueryOptions(
            {
                limit: DEFAULT_PAGINATION_LIMIT,
            },
            {
                getNextPageParam: (lastPage) => (lastPage.docs.length > 0 ? lastPage.nextPage : undefined),
            },
        ),
    );

    function handleChecked(tag: string) {
        if (tags?.includes(tag)) {
            onTagsChange(tags.filter((t) => t !== tag) || []); // Remove the tag if it already exists in the array
        } else {
            onTagsChange([...(tags || []), tag]); // Add the tag if it doesn't exist in the array
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <ul className="flex flex-col">
                {data.pages.map((page) =>
                    page.docs.map((tag) => (
                        <li
                            key={tag.id}
                            className="flex cursor-pointer items-center justify-between gap-2 py-1"
                            onClick={() => {
                                handleChecked(tag.name);
                            }}
                        >
                            <Label className="cursor-pointer">{tag.name}</Label>
                            <Checkbox
                                checked={tags?.includes(tag.name)}
                                onCheckedChange={() => {
                                    handleChecked(tag.name);
                                }}
                            />
                        </li>
                    )),
                )}
            </ul>
            {hasNextPage && (
                <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
                    Load more
                </Button>
            )}
        </div>
    );
}
