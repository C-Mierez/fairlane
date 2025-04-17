import { Category } from "@/payload-types";
import { DropdownPosition } from "@hooks/use-dropdown";
import { cn } from "@lib/utils";
import { useMemo } from "react";

interface Props {
    category: Category;
    isOpen: boolean;
    position: DropdownPosition;
}

export default function SubcategoriesMenu({ category, isOpen, position }: Props) {
    // TODO Fix this when proper typing is in place
    if (!isOpen || !category.children || !category.children.length > 0) return null;

    const categoryColor = useMemo(() => {
        let categoryColor = null;

        if (category.color) {
            switch (category.color) {
                case "primary":
                    categoryColor = "bg-primary";
                    break;
                case "secondary":
                    categoryColor = "bg-secondary";
                    break;
                case "accent":
                    categoryColor = "bg-accent";
                    break;
                default:
                    categoryColor = "bg-primary";
                    break;
            }
        }

        return categoryColor;
    }, [category]);

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
                    className={cn("text-foreground neo-container-reverse flex w-60 flex-col gap-2 p-4", categoryColor)}
                >
                    {category.children.map((child: Category) => {
                        return <span>{child.name}</span>;
                    })}
                </div>
            </>
        </div>
    );
}
