"use client";

import { useMemo, useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@components/ui/sheet";
import { buildCategoryUrl, buildSubcategoryUrl } from "@lib/urls";
import { cn, getCategoryColor } from "@lib/utils";

import { FormattedCategories } from "../../layout/home-layout";
import { AllCategory } from "./search-categories";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    data: FormattedCategories; // TODO Change this to be fetched independently
}

export default function SearchCategoriesSidebar({ isOpen, onOpenChange, data }: Props) {
    const extendedData = useMemo(
        () =>
            data.map((cat) => {
                return {
                    ...cat,
                    children:
                        cat.children && cat.children.length > 0
                            ? [{ ...AllCategory, children: undefined }, ...cat.children]
                            : [],
                };
            }),
        [data],
    );

    const [activeCategory, setActiveCategory] = useState<FormattedCategories[number] | null>(null);

    const handleCategoryClick = (category: FormattedCategories[number]) => {
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
                    <SheetTitle>All Categories</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col gap-2">
                    <div>
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
                    </div>
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
    category: FormattedCategories[number] | FormattedCategories[number]["children"][number];
    parent?: FormattedCategories[number];
    isLeaf: boolean;
    onClick?: () => void;
    isActive?: boolean;
}) {
    // TODO Fix types
    const { categoryColorHover, categoryTextColorHover, categoryColor, categoryTextColor } = useMemo(
        getCategoryColor(parent ?? (category as any)),
        [category],
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
            variant={"background"}
            hover={"none"}
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
