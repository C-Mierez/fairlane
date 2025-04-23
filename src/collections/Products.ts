import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
    slug: "products",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "text",
        },
        {
            name: "price",
            type: "number",
            required: true,
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
            required: true,
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: false,
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "policy",
            type: "select",
            options: ["no-refund", "no-exchange", "exchange", "refund"],
            defaultValue: "no-refund",
            required: true,
        },
        {
            name: "policyDuration",
            type: "number",
            required: true,
            defaultValue: 30,
            min: 1,
        },
        {
            name: "stock",
            type: "number",
            required: true,
            defaultValue: 0,
            min: 0,
        },
    ],
};
