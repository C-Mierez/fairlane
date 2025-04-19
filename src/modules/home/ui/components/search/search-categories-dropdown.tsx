"use client";

import { useRef, useState } from "react";

import { Button } from "@components/ui/button";
import useDropdown from "@hooks/use-dropdown";
import { cn } from "@lib/utils";

import { FormattedCategories } from "../../layout/home-layout";
import SubcategoriesMenu from "./subcategories-menu";

interface Props {
    category: FormattedCategories[number];
    isActive: boolean;
    isNavigationHovered: boolean;
}

export default function SearchCategoriesDropdown({
    category,
    isActive,
    isNavigationHovered,
}: Props & {
    children?: React.ReactNode;
}) {
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
                <Button keepHovered={isOpen}>{category.name}</Button>

                {/* // Small triangle decorator that connects the button to the dropdown */}
                <div
                    className={cn(
                        "bg-foreground absolute -bottom-3 left-1/2 -z-1 size-3 -translate-x-1/2 rotate-45 opacity-0",
                        hasChildren && isOpen && "opacity-100",
                    )}
                ></div>
            </span>

            <SubcategoriesMenu category={category} isOpen={isOpen} position={dropdownPosition} />
        </div>
    );
}
