import type { CollectionConfig } from "payload";
import { relationship } from "payload/shared";

export const Categories: CollectionConfig = {
    slug: "categories",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
        },
        {
            name: "color",
            type: "select",
            options: [
                {
                    label: "Primary",
                    value: "primary",
                },
                {
                    label: "Secondary",
                    value: "secondary",
                },
                {
                    label: "Accent",
                    value: "accent",
                },
            ],
        },
        {
            name: "childOf",
            type: "relationship",
            relationTo: "categories",
            hasMany: false,
            required: false,
            validate: async (value, opts) => {
                if (!value) return relationship(value, opts);

                // Allow only one level of nesting for categories
                const parent = await opts.req.payload.find({
                    collection: "categories",
                    where: {
                        id: {
                            equals: value,
                        },
                    },
                    pagination: false,
                });

                // Check if the category already has a parent
                if (parent.docs && parent.docs[0].childOf) {
                    return "You can only have one level of nesting for categories.";
                }

                return relationship(value, opts);
            },
        },
        {
            name: "children",
            type: "join",
            collection: "categories",
            on: "childOf",
            hasMany: true,
            required: false,
        },
    ],
};
