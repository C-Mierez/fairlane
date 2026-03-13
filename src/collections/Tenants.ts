import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@lib/access";

export const Tenants: CollectionConfig = {
    slug: "tenants",
    admin: {
        useAsTitle: "slug",
    },
    access: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user),
    },
    fields: [
        // Email added by default
        // Add more fields as needed
        {
            name: "name",
            type: "text",
            required: true,
            label: "Store Name",
            admin: {
                description: "This is the name of the store. (e.g. My Store)",
            },
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            admin: {
                description: "This is the subdomain of the store (e.g. [slug].fairlane)",
            },
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "stripeAccountId",
            type: "text",
            required: true,
            admin: {
                readOnly: true,
                description: "Stripe Account ID associated with your shop.",
            },
            access: {
                update: ({ req }) => isSuperAdmin(req.user),
            },
        },
        {
            name: "stripeDetailsSubmitted",
            type: "checkbox",
            defaultValue: false,
            admin: {
                readOnly: true,
                description: "You cannot create products until you have submitted your Stripe account details.",
            },
            access: {
                update: ({ req }) => isSuperAdmin(req.user),
            },
        },
    ],
};
