import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@lib/access";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

const defaultTenantsArrayField = tenantsArrayField({
    tenantsArrayFieldName: "tenants",
    tenantsCollectionSlug: "tenants", // Same as the slug in the Tenants collection
    tenantsArrayTenantFieldName: "tenant",
    arrayFieldAccess: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
    },
    tenantFieldAccess: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
    },
});

export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "email",
        hidden: ({ user }) => !isSuperAdmin(user),
    },
    access: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req, id }) => {
            if (isSuperAdmin(req.user)) return true;

            return req.user?.id === id;
        },
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
            access: {
                update: ({ req }) => isSuperAdmin(req.user),
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
