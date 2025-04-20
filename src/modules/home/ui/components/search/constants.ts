import type { RootCategory } from "@modules/categories/types";

export const ITEM_GAP_WIDTH = 16; // 16px gap between items

export const ALL_SLUG = "all";

export const AllCategory: RootCategory = {
    id: ALL_SLUG,
    name: "All",
    slug: ALL_SLUG,
    color: "accent",
    children: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
