import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Category } from "@/payload-types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getCategoryColor(category: Category) {
    let categoryColor = null;
    let categoryTextColor = null;
    let categoryColorHover = null;
    let categoryTextColorHover = null;

    if (category.color) {
        switch (category.color) {
            case "primary":
                categoryColor = "bg-primary";
                categoryTextColor = "text-primary-foreground";
                categoryColorHover = "hover:bg-primary";
                categoryTextColorHover = "hover:text-primary-foreground";
                break;
            case "secondary":
                categoryColor = "bg-secondary";
                categoryTextColor = "text-secondary-foreground";
                categoryColorHover = "hover:bg-secondary";
                categoryTextColorHover = "hover:text-secondary-foreground";
                break;
            case "accent":
                categoryColor = "bg-accent";
                categoryTextColor = "text-accent-foreground";
                categoryColorHover = "hover:bg-accent";
                categoryTextColorHover = "hover:text-accent-foreground";
                break;
            default:
                categoryColor = "bg-primary";
                categoryTextColor = "text-primary-foreground";
                categoryColorHover = "hover:bg-primary";
                categoryTextColorHover = "hover:text-primary-foreground";
                break;
        }
    }

    return { categoryColor, categoryTextColor, categoryColorHover, categoryTextColorHover };
}
