import type { RootCategory } from "@modules/categories/types";
import { AllCategory } from "./constants";

export function extendRootCategories(categories: RootCategory[]) {
    return [AllCategory, ...categories];
}

export function extendAllCategories(categories: RootCategory[]) {
    return extendRootCategories(categories).map((cat) => ({
        ...cat,
        children:
            cat.children && cat.children.length > 0 ? [{ ...AllCategory, children: undefined }, ...cat.children] : [],
    }));
}
