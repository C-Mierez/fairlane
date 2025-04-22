"use client";

import { useTRPC } from "@/trpc/client";
import SuspenseWithError from "@components/utils/suspended";
import { useSuspenseQuery } from "@tanstack/react-query";
import useProductFilters from "../hooks/use-product-filters";

interface Props {
    categorySlug?: string;
}

export default function ProductGrid(props: Props) {
    return (
        <SuspenseWithError>
            <ProductListSuspense {...props} />
        </SuspenseWithError>
    );
}

function ProductListSuspense({ categorySlug }: Props) {
    const [filters] = useProductFilters();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.products.getByFilters.queryOptions({
            categorySlug,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
        }),
    );

    return (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.docs.map((product) => (
                <li key={product.id} className="neo-container bg-background flex flex-col gap-2 p-2">
                    <div>{product.name}</div>
                    <div>{product.stock}</div>
                    <div>{product.price}$</div>
                </li>
            ))}
        </ul>
    );
}
