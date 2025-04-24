"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ListFilterIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@components/ui/button";
import SuspenseWithError from "@components/utils/suspended";
import { useIsMobile } from "@hooks/use-is-mobile";
import { cn } from "@lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import useCategoryParams from "../../hooks/use-category-params";
import { ITEM_GAP_WIDTH } from "./constants";
import SearchBreadcrumbs from "./search-breadcrumbs";
import SearchCategoriesDropdown, { SearchCategoriesDropdownScaffold } from "./search-categories-dropdown";
import SearchCategoriesSidebar from "./search-categories-sidebar";
import { extendAllCategories } from "./utils";

export default function SearchCategories() {
    return (
        <SuspenseWithError fallback={<SearchCategoriesSkeleton />}>
            {/* Need to have a wrapping div for the component to have a valid parentNode */}
            <div>
                <SearchCategoriesSuspense />
            </div>
        </SuspenseWithError>
    );
}

function SearchCategoriesSuspense() {
    // TODO On mobile, only show the Show All button and the currently active category

    const trpc = useTRPC();

    const {
        data: { categories },
    } = useSuspenseQuery(trpc.categories.getAll.queryOptions());

    const isMobile = useIsMobile("mobile");

    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const showAllRef = useRef<HTMLDivElement>(null);

    const extendedData = useMemo(() => extendAllCategories(categories), [categories]);

    const [isReady, setIsReady] = useState(false); // Hide the component until the width is calculated
    const [visibleCount, setVisibleCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { activeCategorySlug, activeSubcategorySlug } = useCategoryParams();
    const activeCategoryIndex = extendedData.findIndex((category) => category.slug === activeCategorySlug);
    const activeCategory = extendedData[activeCategoryIndex];

    const activeSubcategoryIndex =
        activeCategory && activeCategory.children && activeCategory.children.length > 0
            ? activeCategory.children.findIndex((subcategory) => subcategory.slug === activeSubcategorySlug)
            : -1;
    const activeSubcategory =
        activeSubcategoryIndex !== -1 && activeCategory && activeCategory.children
            ? activeCategory.children[activeSubcategoryIndex]
            : undefined;

    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

    useEffect(() => {
        if (!containerRef.current || !measureRef.current || !showAllRef.current) return;

        function isVisible() {
            if (!containerRef.current || !measureRef.current || !showAllRef.current) return;

            if (isMobile) {
                setVisibleCount(1); // Only show the All category
                setIsReady(true);
                return;
            }

            const containerWidth = containerRef.current.getBoundingClientRect().width;
            const showAllWidth = showAllRef.current.getBoundingClientRect().width;
            const remainderWidth = containerWidth - showAllWidth;

            const items = Array.from(measureRef.current.children);

            let totalWidth = 0;
            let visibleItems = 0;

            for (const [i, item] of items.entries()) {
                if (i === items.length - 1) break; // Don't count the last item (Show All button)

                const itemWidth = item.getBoundingClientRect().width + ITEM_GAP_WIDTH; // 16px gap

                if (totalWidth + itemWidth >= remainderWidth) {
                    break;
                }

                totalWidth += itemWidth;
                visibleItems++;
            }
            setVisibleCount(visibleItems < 0 ? 0 : visibleItems);
            setIsReady(true);
        }

        const resizeObserver = new ResizeObserver(isVisible);
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [isMobile]);

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
                        <SearchCategoriesDropdownScaffold
                            category={category}
                            isActive={activeCategorySlug === category.slug}
                        />
                    </div>
                ))}
            </div>

            {/* Real categories */}
            <div ref={containerRef} className="flex w-full flex-nowrap gap-4">
                {extendedData.slice(0, visibleCount).map((category) => (
                    <div key={category.id}>
                        <SearchCategoriesDropdown
                            category={category}
                            isActive={activeCategorySlug === category.slug}
                            activeSubcategorySlug={activeSubcategorySlug}
                        />
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

            <SearchBreadcrumbs activeCategory={activeCategory} activeSubcategory={activeSubcategory} />
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
            variant={isActiveCategoryHidden ? "inverted" : "default"}
            border={isActiveCategoryHidden ? "transparent" : "neo"}
            hover={isActiveCategoryHidden ? "ghost_inverted" : "none"}
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
