"use client";

import { ListFilterIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@components/ui/button";
import SuspenseWithError from "@components/utils/suspended";
import { cn } from "@lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import SearchCategoriesDropdown from "./search-categories-dropdown";
import SearchCategoriesSidebar from "./search-categories-sidebar";
import { useSearchCategories } from "./use-search-categories";

export default function SearchCategories() {
    return (
        <SuspenseWithError fallback={<SearchCategoriesSkeleton />}>
            <SearchCategoriesSuspense />
        </SuspenseWithError>
    );
}

function SearchCategoriesSuspense() {
    // TODO On mobile, only show the Show All button and the currently active category

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.categories.getAll.queryOptions());

    const {
        extendedData,
        containerRef,
        measureRef,
        showAllRef,
        isReady,
        visibleCount,
        setIsHovered,
        isSidebarOpen,
        setIsSidebarOpen,
        activeCategorySlug,
        isActiveCategoryHidden,
    } = useSearchCategories(data.categories);

    return (
        <div className={cn("relative w-full overflow-hidden px-4 pt-3 pb-4 md:px-8", !isReady && "invisible")}>
            {/* All Categories Sidebar */}
            <SearchCategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

            {/* Invisible categories for measuring width */}
            <div
                ref={measureRef}
                aria-hidden
                className="pointer-events-none invisible absolute top-0 right-8 left-8 -z-1 flex w-full flex-nowrap gap-4"
            >
                {extendedData.map((category) => (
                    <div key={category.id}>
                        <SearchCategoriesDropdown
                            category={category}
                            isActive={activeCategorySlug === category.slug}
                            isScaffold={true}
                        />
                    </div>
                ))}
            </div>

            {/* Real categories */}
            <div
                ref={containerRef}
                className="flex w-full flex-nowrap gap-4 lg:justify-center"
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                {extendedData.slice(0, visibleCount).map((category) => (
                    <div key={category.id}>
                        <SearchCategoriesDropdown category={category} isActive={activeCategorySlug === category.slug} />
                    </div>
                ))}

                <div ref={showAllRef} className="shrink-0">
                    <ShowAllButton
                        isActiveCategoryHidden={isActiveCategoryHidden}
                        onClick={() => {
                            setIsSidebarOpen(true);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

interface ShowAllButtonProps {
    isActiveCategoryHidden: boolean;
    onClick?: () => void;
}

function ShowAllButton({ isActiveCategoryHidden, onClick }: ShowAllButtonProps) {
    // TODO Give a visual clue when current active category is not visible
    return (
        <Button
            type="button"
            hover={isActiveCategoryHidden ? "reverse" : "default"}
            variant={isActiveCategoryHidden ? "activePrimary" : "default"}
            onClick={onClick}
        >
            <span>Show All</span>
            <ListFilterIcon />
        </Button>
    );
}

function SearchCategoriesSkeleton() {
    return <div className="pointer-events-none h-17 pt-3 pb-4" />;
}
