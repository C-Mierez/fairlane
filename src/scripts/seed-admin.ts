import { getPayload } from "payload";

import payloadConfig from "@payload-config";

async function seedAdmin() {
    const payload = await getPayload({ config: payloadConfig });

    const tenant = await payload.create({
        collection: "tenants",
        data: {
            name: "demoAdmin",
            slug: "demoAdmin",
            stripeAccountId: "test", // TODO Add actual stripe account id
        },
    });

    await payload.create({
        collection: "users",
        data: {
            email: "demo@demo.com",
            password: "demo",
            roles: ["super-admin"],
            username: "demoAdmin",
            tenants: [
                {
                    tenant: tenant.id,
                },
            ],
        },
    });
}
try {
    await seedAdmin();
    console.log("Admin seeded successfully.");
    process.exit(0);
} catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
}
