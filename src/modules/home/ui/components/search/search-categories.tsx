"use client";

import { ListFilterIcon } from "lucide-react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

import { FormattedCategories } from "../../layout/home-layout";
import SearchCategoriesDropdown from "./search-categories-dropdown";
import SearchCategoriesSidebar from "./search-categories-sidebar";
import { useSearchCategories } from "./use-search-categories";

interface SearchCategoriesProps {
    data: FormattedCategories;
}

export const ITEM_GAP_WIDTH = 16; // 16px gap between items

export const ALL_SLUG = "all";

export const AllCategory: FormattedCategories[number] = {
    id: ALL_SLUG,
    name: "All",
    slug: ALL_SLUG,
    color: "accent",
    children: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export default function SearchCategories({ data }: SearchCategoriesProps) {
    // TODO On mobile, only show the Show All button and the currently active category

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
        setActiveCategory,
        isActiveCategoryHidden,
    } = useSearchCategories(data);

    return (
        <div className={cn("relative w-full overflow-hidden px-4 pt-3 pb-4 md:px-8", !isReady && "invisible")}>
            {/* All Categories Sidebar */}
            <SearchCategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={extendedData} />

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
