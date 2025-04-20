"use client";

import { useMemo, useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useTRPC } from "@/trpc/client";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@components/ui/sheet";
import SuspenseWithError from "@components/utils/suspended";
import { buildCategoryUrl, buildSubcategoryUrl } from "@lib/urls";
import { cn, getCategoryColor } from "@lib/utils";
import type { ChildCategory, RootCategory } from "@modules/categories/types";
import { useSuspenseQuery } from "@tanstack/react-query";

import { extendAllCategories } from "./utils";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function SearchCategoriesSidebar(props: Props) {
    return (
        <SuspenseWithError>
            <SearchCategoriesSidebarSuspense {...props} />
        </SuspenseWithError>
    );
}

function SearchCategoriesSidebarSuspense({ isOpen, onOpenChange }: Props) {
    const trpc = useTRPC();

    const {
        data: { categories },
    } = useSuspenseQuery(trpc.categories.getAll.queryOptions());

    // Adds the "All" category to the list of children categories if they exist
    const extendedData = useMemo(() => extendAllCategories(categories), [categories]);

    const [activeCategory, setActiveCategory] = useState<RootCategory | null>(null);

    const handleCategoryClick = (category: RootCategory) => {
        setActiveCategory((prev) => {
            if (prev?.id === category.id) {
                return null; // Collapse the category if it's already open
            }
            return category; // Expand the clicked category
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="rounded-r-base shadow-neo gap-0">
                <SheetHeader className="border-b-neo">
                    <SheetTitle className="font-brand font-base">All Categories</SheetTitle>
                </SheetHeader>
                <ScrollArea>
                    {extendedData.map((category) => (
                        <div
                            key={category.id}
                            className={activeCategory?.id === category.id ? "bg-background-alt" : ""}
                        >
                            {/* Expandable button if children exist, otherwise link to category */}
                            {category.children && category.children.length > 0 ? (
                                <SidebarButton
                                    category={category}
                                    isLeaf={false}
                                    onClick={() => handleCategoryClick(category)}
                                    isActive={activeCategory?.id === category.id}
                                />
                            ) : (
                                <SidebarButton
                                    category={category}
                                    isLeaf={true}
                                    isActive={activeCategory?.id === category.id}
                                />
                            )}

                            {category.children &&
                                category.children.length > 0 &&
                                activeCategory?.id === category.id && (
                                    <div>
                                        {activeCategory.children.map((child) => (
                                            <SidebarButton
                                                key={child.id}
                                                parent={category}
                                                category={child}
                                                isLeaf={true}
                                                onClick={() => {
                                                    onOpenChange(false);
                                                }}
                                                isActive={activeCategory?.id === child.id}
                                            />
                                        ))}
                                    </div>
                                )}
                        </div>
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

function SidebarButton({
    category,
    parent,
    isLeaf,
    onClick,
    isActive,
}: {
    category: RootCategory | ChildCategory;
    parent?: RootCategory;
    isLeaf: boolean;
    onClick?: () => void;
    isActive?: boolean;
}) {
    const { categoryColorHover, categoryTextColorHover, categoryColor, categoryTextColor } = useMemo(
        () => getCategoryColor(parent ?? category),
        [parent, category],
    );

    const content = (
        <>
            {category.name}
            {isLeaf ? null : isActive ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </>
    );

    return (
        <Button
            key={category.id}
            onClick={onClick}
            size={"expanded"}
            variant={"transparent"}
            radius={"none"}
            border={"none"}
            hover={"none"}
            rise={"none"}
            className={cn(
                "justify-between py-4",
                categoryColorHover,
                categoryTextColorHover,
                !!parent && "pl-8",
                isLeaf && "underline",
                isActive && `${categoryColor} ${categoryTextColor}`,
            )}
            asChild={isLeaf}
        >
            {isLeaf ? (
                <Link
                    href={
                        // Build a category or subcategory URL
                        !!parent ? buildSubcategoryUrl(parent.slug, category.slug) : buildCategoryUrl(category.slug)
                    }
                >
                    {content}
                </Link>
            ) : (
                content
            )}
        </Button>
    );
}
