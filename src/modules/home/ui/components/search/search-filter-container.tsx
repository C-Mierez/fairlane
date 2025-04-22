"use client";

import { cn, getCategoryColor } from "@lib/utils";
import useCategoryParams from "../../hooks/use-category-params";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import SuspenseWithError from "@components/utils/suspended";
import { extendRootCategories } from "./utils";
import { ALL_SLUG } from "./constants";

interface Props {
    children: React.ReactNode;
}

export default function SearchFilterContainer({ children }: Props) {
    return (
        <SuspenseWithError fallback={<DefaultContainer>{children}</DefaultContainer>}>
            <SearchFilterContainerSuspense>{children}</SearchFilterContainerSuspense>
        </SuspenseWithError>
    );
}

function SearchFilterContainerSuspense({ children }: Props) {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getAll.queryOptions());

    const { activeCategorySlug } = useCategoryParams();

    const extendedCategories = extendRootCategories(data.categories);
    const activeCategory = extendedCategories.find((category) => category.slug === activeCategorySlug);

    return !!activeCategory ? (
        <PaintedContainer
            className={
                activeCategory.slug === ALL_SLUG ? "bg-background-alt" : getCategoryColor(activeCategory).categoryColor!
            }
        >
            {children}
        </PaintedContainer>
    ) : (
        <DefaultContainer>{children}</DefaultContainer>
    );
}

function PaintedContainer({ children, className }: Props & { className: string }) {
    return <div className={cn("border-b-neo grid w-full transition-colors", className)}>{children}</div>;
}

function DefaultContainer({ children }: Props) {
    return <div className={cn("border-b-neo grid w-full transition-colors")}>{children}</div>;
}
