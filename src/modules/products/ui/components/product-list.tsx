"use client";

import { useTRPC } from "@/trpc/client";
import PrettyJSON from "@components/dev/pretty-json";
import SuspenseWithError from "@components/utils/suspended";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    categorySlug?: string;
}

export default function ProductList(props: Props) {
    return (
        <SuspenseWithError>
            <ProductListSuspense {...props} />
        </SuspenseWithError>
    );
}

function ProductListSuspense({ categorySlug }: Props) {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.products.getByCategory.queryOptions({
            categorySlug,
        }),
    );

    return (
        <>
            <PrettyJSON data={data} />
        </>
    );
}
