import type { CollectionConfig } from "payload";

import type { Tenant } from "@/payload-types";
import { isSuperAdmin } from "@lib/access";

export const Products: CollectionConfig = {
    slug: "products",
    access: {
        read: () => true,
        create: ({ req }) => {
            if (isSuperAdmin(req.user)) return true;

            const tenant = req.user?.tenants?.[0]?.tenant as Tenant;

            return Boolean(tenant?.stripeDetailsSubmitted);
        },
        delete: ({ req }) => isSuperAdmin(req.user),
    },
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
        // Visible only to customers after purchase
        {
            name: "content",
            type: "textarea",
            admin: {
                description:
                    "Visible only to customers after purchase. Add product documentation, downloadable files, etc.",
            },
        },
        {
            name: "isArchived",
            label: "Archive",
            defaultValue: false,
            type: "checkbox",
            admin: {
                description:
                    "If checked, this product will be hidden from the storefront and customers won't be able to purchase it.",
            },
        },
    ],
};
