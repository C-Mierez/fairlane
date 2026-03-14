import { getPayload } from "payload";

import payloadConfig from "@payload-config";
import { stripe } from "@lib/stripe";

async function seedAdmin() {
    const payload = await getPayload({ config: payloadConfig });

    const stripeAccount = await stripe.accounts.create({});

    const tenant = await payload.create({
        collection: "tenants",
        data: {
            name: "demoAdmin",
            slug: "demoAdmin",
            stripeAccountId: stripeAccount.id,
        },
    });

    await payload.create({
        collection: "users",
        data: {
            email: "admin@demo.com",
            password: "demodemo",
            roles: ["super-admin"],
            username: "admin",
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
