"use client";

import { useParams } from "next/navigation";
import { ALL_SLUG } from "../components/search/constants";
import { useMemo } from "react";

export default function useCategoryParams() {
    const params = useParams();

    const categorySlug = params.category as string | undefined;
    const subcategorySlug = params.subcategory as string | undefined;
    const activeCategorySlug = useMemo(() => categorySlug || ALL_SLUG, [categorySlug]);
    const activeSubcategorySlug = useMemo(() => {
        if (activeCategorySlug === ALL_SLUG) {
            return undefined;
        }
        return subcategorySlug;
    }, [activeCategorySlug, subcategorySlug]);

    return {
        activeCategorySlug,
        activeSubcategorySlug,
    };
}
