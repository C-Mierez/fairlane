import { useMemo } from "react";

import Link from "next/link";

import { Category } from "@/payload-types";
import { Button } from "@components/ui/button";
import { DropdownPosition } from "@hooks/use-dropdown";
import { buildSubcategoryUrl } from "@lib/urls";
import { cn, getCategoryColor } from "@lib/utils";

import { FormattedCategories } from "../../layout/home-layout";

interface Props {
    category: FormattedCategories[number];
    isOpen: boolean;
    position: DropdownPosition;
}

export default function SubcategoriesMenu({ category, isOpen, position }: Props) {
    // TODO Fix this when proper typing is in place
    if (!isOpen || !category.children || category.children.length === 0) return null;

    const { categoryColor, categoryTextColor } = useMemo(getCategoryColor(category), [category]);

    return (
        <div
            className="fixed z-100"
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            <>
                {/* Make sure the height of the bar is the same as the separator decoration */}
                <div className="h-3 w-60"></div>

                {/* Make sure the width is the same as in {`use-dropdown.tsx`} */}
                <div
                    className={cn(
                        "text-foreground neo-container-reverse flex w-60 flex-col overflow-hidden",
                        categoryColor,
                    )}
                >
                    {category.children.map((child: Category) => {
                        return (
                            <Button
                                key={child.id}
                                size={"expanded"}
                                variant={"background"}
                                hover={"none"}
                                className={cn("border-b-neo justify-start py-4", categoryTextColor)}
                                asChild
                            >
                                <Link href={buildSubcategoryUrl(category.slug, child.slug)}>{child.name}</Link>
                            </Button>
                        );
                    })}
                </div>
            </>
        </div>
    );
}
