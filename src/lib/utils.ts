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

export function sanitizeStringAsNumber(value: string) {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    const parts = sanitizedValue.split(".");

    const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1].slice(0, 2) : "");

    return formattedValue;
}

export function formatAsCurrency(price: string) {
    const sanitizedValue = sanitizeStringAsNumber(price);

    if (!sanitizedValue) return "";

    const numberValue = parseFloat(sanitizedValue);

    if (isNaN(numberValue)) return "";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numberValue);
}
