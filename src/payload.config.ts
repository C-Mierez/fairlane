import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { isSuperAdmin } from "@lib/access";
// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { uploadthingStorage } from "@payloadcms/storage-uploadthing";

import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Products } from "./collections/Products";
import { Reviews } from "./collections/Reviews";
import { Tags } from "./collections/Tags";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { env } from "./env";
import type { Config } from "./payload-types";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        components: {
            beforeNavLinks: ["@/components/stripe-verify-button"],
        },
    },
    collections: [Users, Media, Categories, Products, Tags, Tenants, Orders, Reviews],
    cookiePrefix: "fairlane",
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: mongooseAdapter({
        url: process.env.DATABASE_URI || "",
    }),
    sharp,
    plugins: [
        payloadCloudPlugin(),
        multiTenantPlugin<Config>({
            collections: {
                products: {},
                media: {},
            },
            tenantsArrayField: {
                includeDefaultField: false,
            },
            userHasAccessToAllTenants: (user) => isSuperAdmin(user),
        }),
        uploadthingStorage({
            collections: {
                media: true,
            },
            options: {
                token: env.UPLOADTHING_TOKEN,
                acl: "public-read",
            },
            clientUploads: true,
        }),
    ],
});
