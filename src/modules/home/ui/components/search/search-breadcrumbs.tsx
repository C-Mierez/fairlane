import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@components/ui/breadcrumb";
import { cn } from "@lib/utils";
import type { ChildCategory, RootCategory } from "@modules/categories/types";

import { ALL_SLUG } from "./constants";

interface Props {
    activeCategory?: RootCategory;
    activeSubcategory?: ChildCategory;
}

export default function SearchBreadcrumbs({ activeCategory, activeSubcategory }: Props) {
    if (!activeCategory) return null;

    const isCategoryAll = activeCategory.slug === ALL_SLUG;
    const isSubcategoryAll = activeSubcategory && activeSubcategory.slug === ALL_SLUG;

    return (
        <Breadcrumb className="pt-6 pb-1">
            <BreadcrumbList className="text-foreground font-brand-medium text-xl md:text-2xl">
                <BreadcrumbItem>
                    <BreadcrumbLink
                        href={isCategoryAll ? "/" : `/${activeCategory.slug}`}
                        className={cn(isCategoryAll ? "hover:opacity-80" : "hover:text-background")}
                    >
                        {activeCategory.name}
                        {isCategoryAll ? <span>&nbsp;Categories</span> : null}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {isCategoryAll || !activeSubcategory ? null : (
                    <>
                        <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={`/${activeCategory.slug}/${isSubcategoryAll ? "" : activeSubcategory.slug}`}
                                className="no-underline"
                            >
                                {activeSubcategory.name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
