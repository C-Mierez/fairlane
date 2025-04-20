import { useEffect, useMemo, useRef, useState } from "react";

import { useIsMobile } from "@hooks/use-is-mobile";
import type { RootCategory } from "@modules/categories/types";

import { ALL_SLUG, AllCategory, ITEM_GAP_WIDTH } from "./search-categories";

export function useSearchCategories(data: RootCategory[]) {
    const isMobile = useIsMobile("mobile");

    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const showAllRef = useRef<HTMLDivElement>(null);

    const extendedData = useMemo(() => [AllCategory, ...data], [data]);

    const [isReady, setIsReady] = useState(false); // Hide the component until the width is calculated
    const [visibleCount, setVisibleCount] = useState(extendedData.length);
    const [isHovered, setIsHovered] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeCategorySlug, setActiveCategory] = useState<string>(ALL_SLUG);

    const activeCategoryIndex = extendedData.findIndex((category) => category.slug === activeCategorySlug);
    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

    useEffect(() => {
        function isVisible() {
            if (isMobile) {
                setVisibleCount(1); // Only show the All category
                setIsReady(true);
                return;
            }

            if (!containerRef.current || !measureRef.current || !showAllRef.current) return;

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
            setVisibleCount(visibleItems < 0 ? 0 : visibleItems); // -1 because "Show All" button should not be counted
            setIsReady(true);
        }

        const resizeObserver = new ResizeObserver(isVisible);
        resizeObserver.observe(containerRef.current!);

        return () => {
            resizeObserver.disconnect();
        };
    }, [data.length, isMobile]);

    return {
        containerRef,
        measureRef,
        showAllRef,
        extendedData,
        isReady,
        visibleCount,
        isHovered,
        setIsHovered,
        isSidebarOpen,
        setIsSidebarOpen,
        activeCategorySlug,
        setActiveCategory,
        isActiveCategoryHidden,
    };
}
