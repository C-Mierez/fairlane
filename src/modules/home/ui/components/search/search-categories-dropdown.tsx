"use client";

import { useRef, useState } from "react";

import Link from "next/link";

import { Button } from "@components/ui/button";
import useDropdown from "@hooks/use-dropdown";
import { buildCategoryUrl } from "@lib/urls";
import { cn } from "@lib/utils";

import { FormattedCategories } from "../../layout/home-layout";
import SubcategoriesMenu from "./subcategories-menu";

interface Props {
    category: FormattedCategories[number];
    isActive: boolean;
    isScaffold?: boolean;
}

export default function SearchCategoriesDropdown({
    category,
    isActive,
    isScaffold = false,
}: Props & {
    children?: React.ReactNode;
}) {
    if (isScaffold) {
        return (
            <Button
                type="button"
                aria-hidden
                hover={isActive ? "reverse" : "default"}
                variant={isActive ? "activePrimary" : "default"}
            >
                {category.name}
            </Button>
        );
    }

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { getDropdownPosition } = useDropdown(dropdownRef);

    const dropdownPosition = getDropdownPosition();

    // TODO Fix this when proper typing is in place
    const hasChildren = !!category.children && category.children.length > 0;

    const onPointerEnter = () => {
        if (hasChildren) {
            setIsOpen(true);
        }
    };

    const onPointerLeave = () => {
        if (isOpen) {
            setIsOpen(false);
        }
    };

    return (
        <div ref={dropdownRef} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} className="relative">
            <span className="relative">
                <Button
                    keepHovered={isOpen}
                    hover={isActive ? "reverse" : "default"}
                    variant={isActive ? "activePrimary" : "default"}
                    asChild
                >
                    <Link href={buildCategoryUrl(category.slug)}>{category.name}</Link>
                </Button>

                {/* // Small triangle decorator that connects the button to the dropdown */}
                <div
                    className={cn(
                        "border-foreground absolute -bottom-3 left-1/2 -z-1 size-0 -translate-x-1/2 border-x-8 border-t-0 border-b-8 border-x-transparent opacity-0",
                        hasChildren && isOpen && "opacity-100",
                    )}
                ></div>
            </span>

            <SubcategoriesMenu category={category} isOpen={isOpen} position={dropdownPosition} />
        </div>
    );
}
