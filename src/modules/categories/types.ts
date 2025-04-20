import type { Category } from "@/payload-types";

export type ChildCategory = Category & {
    children: undefined;
};

export type RootCategory = Category & {
    children: ChildCategory[];
};
