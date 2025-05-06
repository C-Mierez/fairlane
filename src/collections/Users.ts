import type { CollectionConfig } from "payload";

import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

const defaultTenantsArrayField = tenantsArrayField({
    tenantsArrayFieldName: "tenants",
    tenantsCollectionSlug: "tenants", // Same as the slug in the Tenants collection
    tenantsArrayTenantFieldName: "tenant",
    arrayFieldAccess: {
        // TODO Proper access control
        read: () => true,
        create: () => true,
        update: () => true,
    },
    tenantFieldAccess: {
        // TODO Proper access control
        read: () => true,
        create: () => true,
        update: () => true,
    },
});

export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "email",
    },
    auth: true,
    fields: [
        // Email added by default
        // Add more fields as needed
        {
            name: "username",
            type: "text",
            required: true,
            unique: true,
        },
        {
            name: "roles",
            type: "select",
            defaultValue: ["user"],
            hasMany: true,
            options: ["super-admin", "user"],
            admin: {
                position: "sidebar",
            },
        },
        {
            ...defaultTenantsArrayField,
            admin: {
                ...(defaultTenantsArrayField.admin || {}),
                position: "sidebar",
            },
        },
    ],
};
